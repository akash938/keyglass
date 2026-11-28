"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChatterIncident,
  KeyEventRecord,
  KeyHistoryItem,
  KeyboardLayoutId,
  LedState,
  OsMode,
} from "@/domain/entities/keyboard";
import { LAYOUT_OPTIONS, getLayoutKeyCodes } from "@/domain/layouts/keyboard-layouts";
import {
  MODIFIER_CODES,
  formatReadableKey,
  isMacFnChordEvent,
  mapCharOrKeyToCode,
  resolveKeyCode,
} from "@/domain/services/key-normalizer";
import {
  KEYBOARD_CHATTER_THRESHOLD_MS,
  evaluateSwitchChatter,
} from "@/domain/services/chatter-detector";
import { formatDiagnosticReport } from "@/domain/services/report-formatter";
import { SoundEnginePort } from "@/application/ports/sound-port";
import { webAudioSoundEngine } from "@/infrastructure/audio/web-audio-sound-engine";
import { copyTextToClipboard } from "@/infrastructure/browser/clipboard-service";
import {
  engageFullscreenKeyboardLock,
  isDocumentFullscreen,
  isFullscreenApiSupported,
  isKeyboardLockApiSupported,
  lockNavigatorKeyboard,
  releaseFullscreenKeyboardLock,
  unlockNavigatorKeyboard,
} from "@/infrastructure/browser/keyboard-lock-service";

export function useKeyboardTester(soundEngine: SoundEnginePort = webAudioSoundEngine) {
  const [layout, setLayout] = useState<KeyboardLayoutId>("full");
  const [os, setOs] = useState<OsMode>("mac");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [testLock, setTestLock] = useState<boolean>(true);
  const [fullscreenLocked, setFullscreenLocked] = useState<boolean>(false);
  const [keyboardApiLocked, setKeyboardApiLocked] = useState<boolean>(false);
  const [canFullscreenLock, setCanFullscreenLock] = useState<boolean>(false);
  const [canKeyboardLockApi, setCanKeyboardLockApi] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [adOpen, setAdOpen] = useState<boolean>(false);
  const [mobileInputOpen, setMobileInputOpen] = useState<boolean>(false);
  const [mobileText, setMobileText] = useState<string>("");
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [resetSignal, setResetSignal] = useState<number>(0);

  // Live Keyboard State
  const [activeKeys, setActiveKeys] = useState<Set<string>>(() => new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(() => new Set());
  const [chatterKeys, setChatterKeys] = useState<Set<string>>(() => new Set());
  const [pressCounts, setPressCounts] = useState<Record<string, number>>({});
  const [totalPresses, setTotalPresses] = useState<number>(0);
  const [peakNkro, setPeakNkro] = useState<number>(0);
  const [chatterLog, setChatterLog] = useState<ChatterIncident[]>([]);
  const [history, setHistory] = useState<KeyHistoryItem[]>([]);
  const [lastEvent, setLastEvent] = useState<KeyEventRecord | null>(null);
  const [ledState, setLedState] = useState<LedState>({
    capsLock: false,
    numLock: false,
    scrollLock: false,
  });

  // High-precision mutable refs (zero unnecessary re-renders)
  const eventIdRef = useRef<number>(0);
  const keyDownTimesRef = useRef<Map<string, number>>(new Map());
  const lastDownPerKeyRef = useRef<Map<string, number>>(new Map());
  const lastGlobalDownRef = useRef<number | null>(null);
  const lastContextMenuKeyRef = useRef<number>(0);
  const activeKeysRef = useRef<Set<string>>(new Set());
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const testLockRef = useRef<boolean>(testLock);
  const adOpenRef = useRef<boolean>(adOpen);
  const osRef = useRef<OsMode>(os);
  const captureStageRef = useRef<HTMLElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    testLockRef.current = testLock;
  }, [testLock]);

  useEffect(() => {
    adOpenRef.current = adOpen;
  }, [adOpen]);

  useEffect(() => {
    osRef.current = os;
  }, [os]);

  const focusKeyboardStage = useCallback(() => {
    if (typeof document === "undefined") return;
    const active = document.activeElement as HTMLElement | null;
    if (active?.dataset?.mobileBridge === "true") return;
    if (active && active !== captureStageRef.current && active !== document.body) {
      active.blur();
    }
    captureStageRef.current?.focus({ preventScroll: true });
    setIsFocused(true);
  }, []);

  // Auto-detect OS, capabilities & viewport layout, enforce default Apple White theme, focus stage & show ad on every visit
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const platform = navigator.platform || "";
    const isApple = /Mac|iPhone|iPad|iPod/i.test(platform) || /Mac OS X/i.test(ua);
    setOs(isApple ? "mac" : "windows");

    if (window.innerWidth < 820 || (isApple && window.innerWidth < 1260)) {
      setLayout("laptop");
    }

    setCanFullscreenLock(isFullscreenApiSupported());
    setCanKeyboardLockApi(isKeyboardLockApiSupported());

    // Always default to Apple White (Light Frost); Dark Mode activates only on explicit user click
    setDarkMode(false);
    document.documentElement.classList.remove("dark");

    focusKeyboardStage();
    const focusTimer = window.setTimeout(focusKeyboardStage, 120);
    const adTimer = window.setTimeout(() => setAdOpen(true), 80);

    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(adTimer);
      unlockNavigatorKeyboard();
    };
  }, [focusKeyboardStage]);

  const handleCloseAd = useCallback(() => {
    adOpenRef.current = false;
    setAdOpen(false);
    if (testLockRef.current) {
      window.setTimeout(focusKeyboardStage, 40);
    }
  }, [focusKeyboardStage]);

  const toggleTestLock = useCallback(() => {
    const next = !testLockRef.current;
    testLockRef.current = next;
    setTestLock(next);

    if (next) {
      window.setTimeout(focusKeyboardStage, 0);
      if (isDocumentFullscreen()) {
        void lockNavigatorKeyboard().then((locked) => {
          setKeyboardApiLocked(locked);
        });
      }
    } else {
      setFullscreenLocked(false);
      setKeyboardApiLocked(false);
      void releaseFullscreenKeyboardLock(true);
      if (typeof document !== "undefined") {
        const active = document.activeElement as HTMLElement | null;
        if (active && active !== document.body) {
          active.blur();
        }
      }
    }
  }, [focusKeyboardStage]);

  const toggleFullscreenLock = useCallback(async () => {
    if (isDocumentFullscreen()) {
      await releaseFullscreenKeyboardLock(true);
      setFullscreenLocked(false);
      setKeyboardApiLocked(false);
      if (testLockRef.current) {
        window.setTimeout(focusKeyboardStage, 0);
      }
      return;
    }

    if (!testLockRef.current) {
      testLockRef.current = true;
      setTestLock(true);
    }

    const result = await engageFullscreenKeyboardLock();
    setFullscreenLocked(result.fullscreen);
    setKeyboardApiLocked(result.keyboardApiLocked);
    window.setTimeout(focusKeyboardStage, 40);
  }, [focusKeyboardStage]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
    if (testLockRef.current) {
      window.setTimeout(focusKeyboardStage, 0);
    }
  }, [focusKeyboardStage]);

  // Derived layout metrics
  const layoutKeyCodes = useMemo(() => getLayoutKeyCodes(layout, os), [layout, os]);
  const layoutKeySet = useMemo(() => new Set(layoutKeyCodes), [layoutKeyCodes]);

  const testedInLayoutCount = useMemo(() => {
    let count = 0;
    for (const code of layoutKeyCodes) {
      if (testedKeys.has(code)) count++;
    }
    return count;
  }, [layoutKeyCodes, testedKeys]);

  const extraDetectedKeys = useMemo(() => {
    const extras: string[] = [];
    testedKeys.forEach((code) => {
      if (!layoutKeySet.has(code)) extras.push(code);
    });
    return extras;
  }, [testedKeys, layoutKeySet]);

  const isComplete =
    layoutKeyCodes.length > 0 && testedInLayoutCount === layoutKeyCodes.length;

  // Physical / Mobile keydown processor (never triggered by mouse clicks on keycaps)
  const recordKeyDown = useCallback(
    (payload: {
      code: string;
      key: string;
      keyCode?: number;
      location?: number;
      repeat?: boolean;
      shiftKey?: boolean;
      ctrlKey?: boolean;
      altKey?: boolean;
      metaKey?: boolean;
      fnKey?: boolean;
    }) => {
      const {
        code,
        key,
        keyCode = 0,
        location = 0,
        repeat = false,
        shiftKey = false,
        ctrlKey = false,
        altKey = false,
        metaKey = false,
        fnKey = false,
      } = payload;

      const now = performance.now();
      const readable = formatReadableKey(code, key);

      if (code === "ContextMenu") {
        lastContextMenuKeyRef.current = now;
      }

      if (!repeat) {
        const chatter = evaluateSwitchChatter(
          lastDownPerKeyRef.current.get(code),
          now,
          KEYBOARD_CHATTER_THRESHOLD_MS
        );

        if (chatter.isChatter && chatter.deltaMs !== null) {
          setChatterKeys((prev) => {
            const next = new Set(prev);
            next.add(code);
            return next;
          });
          setChatterLog((prev) => [
            { code, label: readable, deltaMs: chatter.deltaMs!, timestamp: Date.now() },
            ...prev.slice(0, 14),
          ]);
        }

        lastDownPerKeyRef.current.set(code, now);
        keyDownTimesRef.current.set(code, now);

        if (soundEnabledRef.current) {
          soundEngine.play(chatter.isChatter ? "chatter" : "press", MODIFIER_CODES.has(code));
        }

        activeKeysRef.current.add(code);
        const currentSimultaneous = activeKeysRef.current.size;
        setActiveKeys(new Set(activeKeysRef.current));
        setPeakNkro((prev) => (currentSimultaneous > prev ? currentSimultaneous : prev));

        setTestedKeys((prev) => {
          if (prev.has(code)) return prev;
          const next = new Set(prev);
          next.add(code);
          return next;
        });

        setPressCounts((prev) => ({ ...prev, [code]: (prev[code] || 0) + 1 }));
        setTotalPresses((prev) => prev + 1);

        const intervalMs =
          lastGlobalDownRef.current !== null
            ? Math.min(9999, Math.round(now - lastGlobalDownRef.current))
            : null;
        lastGlobalDownRef.current = now;

        eventIdRef.current += 1;
        const nextId = eventIdRef.current;

        setLastEvent({
          id: nextId,
          code,
          key,
          keyCode,
          location,
          repeat,
          shiftKey,
          ctrlKey,
          altKey,
          metaKey,
          fnKey: fnKey || code === "Fn",
          holdDurationMs: null,
          intervalMs,
        });

        setHistory((prev) => [
          { id: nextId, code, label: readable, chatter: chatter.isChatter },
          ...prev.slice(0, 17),
        ]);
      } else if (!activeKeysRef.current.has(code)) {
        activeKeysRef.current.add(code);
        setActiveKeys(new Set(activeKeysRef.current));
      }
    },
    [soundEngine]
  );

  const recordKeyUp = useCallback((code: string) => {
    const now = performance.now();
    const downTime = keyDownTimesRef.current.get(code);
    let holdDurationMs: number | null = null;

    if (downTime !== undefined) {
      holdDurationMs = Math.max(1, Math.round(now - downTime));
      keyDownTimesRef.current.delete(code);
    }

    if (code === "PrintScreen") {
      setTestedKeys((prev) => {
        if (prev.has(code)) return prev;
        const next = new Set(prev);
        next.add(code);
        return next;
      });
    }

    if (code === "MetaLeft" || code === "MetaRight") {
      activeKeysRef.current.clear();
    } else {
      activeKeysRef.current.delete(code);
    }

    setActiveKeys(new Set(activeKeysRef.current));

    if (holdDurationMs !== null) {
      setLastEvent((prev) => (prev && prev.code === code ? { ...prev, holdDurationMs } : prev));
    }
  }, []);

  // Capture-phase physical keyboard listener (blocks browser/OS defaults & keeps stage focused when Key Lock is On)
  useEffect(() => {
    const isMobileBridgeTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return el?.dataset?.mobileBridge === "true";
    };

    const syncLeds = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === "function") {
        setLedState({
          capsLock: e.getModifierState("CapsLock"),
          numLock: e.getModifierState("NumLock"),
          scrollLock: e.getModifierState("ScrollLock"),
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (adOpenRef.current) {
        if (e.key === "Escape" || e.code === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          handleCloseAd();
        }
        return;
      }

      const isMobileField = isMobileBridgeTarget(e.target);

      if (testLockRef.current && !isMobileField) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }

      syncLeds(e);

      if (isMobileField && (e.key === "Unidentified" || e.keyCode === 229)) {
        return;
      }

      const fnModActive =
        typeof e.getModifierState === "function" &&
        (e.getModifierState("Fn") || e.getModifierState("FnLock"));
      const rawKeyCode = e.keyCode || e.which || 0;
      const resolvedCode = resolveKeyCode(e.code, e.key, rawKeyCode, osRef.current);
      const macFnChord = isMacFnChordEvent(
        e.code,
        e.key,
        e.location,
        fnModActive,
        osRef.current
      );

      if (macFnChord && resolvedCode !== "Fn") {
        activeKeysRef.current.add("Fn");
        setActiveKeys(new Set(activeKeysRef.current));
        setTestedKeys((prev) => {
          if (prev.has("Fn")) return prev;
          const next = new Set(prev);
          next.add("Fn");
          return next;
        });
        setPressCounts((prev) => ({ ...prev, Fn: (prev.Fn || 0) + (e.repeat ? 0 : 1) }));
      }

      recordKeyDown({
        code: resolvedCode,
        key: e.key,
        keyCode: rawKeyCode,
        location: e.location,
        repeat: e.repeat,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        fnKey: macFnChord || resolvedCode === "Fn",
      });
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (adOpenRef.current) return;
      if (testLockRef.current && !isMobileBridgeTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (adOpenRef.current) return;
      const isMobileField = isMobileBridgeTarget(e.target);

      if (testLockRef.current && !isMobileField) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }

      syncLeds(e);

      const fnStillHeld =
        typeof e.getModifierState === "function" &&
        (e.getModifierState("Fn") || e.getModifierState("FnLock"));
      if (!fnStillHeld && activeKeysRef.current.has("Fn")) {
        activeKeysRef.current.delete("Fn");
      }

      const resolvedCode = resolveKeyCode(
        e.code,
        e.key,
        e.keyCode || e.which || 0,
        osRef.current
      );
      recordKeyUp(resolvedCode);
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!testLockRef.current) return;
      const recentlyPressedMenuKey = performance.now() - lastContextMenuKeyRef.current < 350;
      const isKeyboardTriggered =
        recentlyPressedMenuKey || (e.clientX === 0 && e.clientY === 0) || e.button === 0;
      if (isKeyboardTriggered) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handlePointerUpGlobal = (e: PointerEvent) => {
      if (!testLockRef.current || isMobileBridgeTarget(e.target)) return;
      window.setTimeout(focusKeyboardStage, 0);
    };

    const handleWindowFocus = () => {
      setIsFocused(true);
      if (testLockRef.current) {
        focusKeyboardStage();
      }
    };

    const handleWindowBlur = () => {
      setIsFocused(false);
      activeKeysRef.current.clear();
      setActiveKeys(new Set());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && testLockRef.current) {
        focusKeyboardStage();
      }
    };

    const handleFullscreenChange = () => {
      const inFs = isDocumentFullscreen();
      setFullscreenLocked(inFs);
      if (inFs && testLockRef.current) {
        void lockNavigatorKeyboard().then((locked) => {
          setKeyboardApiLocked(locked);
        });
      } else if (!inFs) {
        unlockNavigatorKeyboard();
        setKeyboardApiLocked(false);
        if (testLockRef.current) {
          window.setTimeout(focusKeyboardStage, 30);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    window.addEventListener("keypress", handleKeyPress, { capture: true, passive: false });
    window.addEventListener("keyup", handleKeyUp, { capture: true, passive: false });
    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("pointerup", handlePointerUpGlobal, { passive: true });
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keypress", handleKeyPress, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("pointerup", handlePointerUpGlobal);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [recordKeyDown, recordKeyUp, focusKeyboardStage, handleCloseAd]);

  const handleMobileInputChange = useCallback(
    (value: string) => {
      if (value.length > 0) {
        const char = value[value.length - 1];
        const mappedCode = mapCharOrKeyToCode(char);
        recordKeyDown({
          code: mappedCode,
          key: char,
          keyCode: char.charCodeAt(0),
          location: 0,
          repeat: false,
        });
        window.setTimeout(() => recordKeyUp(mappedCode), 140);
      }
      setMobileText("");
    },
    [recordKeyDown, recordKeyUp]
  );

  const handleReset = useCallback(() => {
    activeKeysRef.current.clear();
    keyDownTimesRef.current.clear();
    lastDownPerKeyRef.current.clear();
    lastGlobalDownRef.current = null;
    setActiveKeys(new Set());
    setTestedKeys(new Set());
    setChatterKeys(new Set());
    setPressCounts({});
    setTotalPresses(0);
    setPeakNkro(0);
    setChatterLog([]);
    setHistory([]);
    setLastEvent(null);
    setResetSignal((s) => s + 1);
    if (testLockRef.current) {
      window.setTimeout(focusKeyboardStage, 0);
    }
  }, [focusKeyboardStage]);

  const handleCopyReport = useCallback(async () => {
    const layoutName = LAYOUT_OPTIONS.find((l) => l.id === layout)?.name ?? layout;
    const report = formatDiagnosticReport({
      layoutName,
      os,
      testedCount: testedInLayoutCount,
      totalKeys: layoutKeyCodes.length,
      totalPresses,
      peakNkro,
      chatterCount: chatterLog.length,
      chatterKeyCodes: Array.from(chatterKeys),
      testedAt: new Date(),
    });

    const ok = await copyTextToClipboard(report);
    if (ok) {
      setCopiedReport(true);
      window.setTimeout(() => setCopiedReport(false), 2200);
    }
    if (testLockRef.current) {
      window.setTimeout(focusKeyboardStage, 0);
    }
  }, [
    layout,
    os,
    testedInLayoutCount,
    layoutKeyCodes.length,
    totalPresses,
    peakNkro,
    chatterLog.length,
    chatterKeys,
    focusKeyboardStage,
  ]);

  const toggleMobileInput = useCallback(() => {
    setMobileInputOpen((prev) => {
      const next = !prev;
      if (next) {
        window.setTimeout(() => mobileInputRef.current?.focus(), 80);
      } else if (testLockRef.current) {
        window.setTimeout(focusKeyboardStage, 40);
      }
      return next;
    });
  }, [focusKeyboardStage]);

  return {
    // Refs
    captureStageRef,
    mobileInputRef,
    // Configuration & UI state
    layout,
    setLayout,
    os,
    setOs,
    darkMode,
    toggleDarkMode,
    soundEnabled,
    setSoundEnabled,
    testLock,
    toggleTestLock,
    fullscreenLocked,
    keyboardApiLocked,
    canFullscreenLock,
    canKeyboardLockApi,
    toggleFullscreenLock,
    isFocused,
    focusKeyboardStage,
    adOpen,
    handleCloseAd,
    mobileInputOpen,
    toggleMobileInput,
    mobileText,
    handleMobileInputChange,
    copiedReport,
    handleCopyReport,
    handleReset,
    resetSignal,
    // Keyboard live diagnostics
    activeKeys,
    testedKeys,
    chatterKeys,
    pressCounts,
    totalPresses,
    peakNkro,
    chatterLog,
    history,
    lastEvent,
    ledState,
    layoutKeyCodes,
    testedInLayoutCount,
    extraDetectedKeys,
    isComplete,
  };
}
