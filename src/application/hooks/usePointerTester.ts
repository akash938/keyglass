"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import {
  MOUSE_BUTTONS,
  RipplePoint,
  ScrollDirection,
  TouchContactPoint,
} from "@/domain/entities/pointer";
import {
  MOUSE_CHATTER_THRESHOLD_MS,
  evaluateSwitchChatter,
} from "@/domain/services/chatter-detector";
import { SoundEnginePort } from "@/application/ports/sound-port";
import { webAudioSoundEngine } from "@/infrastructure/audio/web-audio-sound-engine";

const RETICLE_SPRING = { stiffness: 760, damping: 40, mass: 0.28 };
const SPOTLIGHT_SPRING = { stiffness: 320, damping: 34, mass: 0.45 };

export function usePointerTester(
  soundEnabled: boolean,
  resetSignal: number,
  soundEngine: SoundEnginePort = webAudioSoundEngine
) {
  const [activeButtons, setActiveButtons] = useState<Set<number>>(() => new Set());
  const [testedButtons, setTestedButtons] = useState<Set<number>>(() => new Set());
  const [chatterButtons, setChatterButtons] = useState<Set<number>>(() => new Set());
  const [buttonCounts, setButtonCounts] = useState<Record<number, number>>({});
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [lastClickHoldMs, setLastClickHoldMs] = useState<number | null>(null);
  const [lastChatterInfo, setLastChatterInfo] = useState<string | null>(null);

  // GPU-driven 120fps MotionValues for zero React re-renders during cursor movement
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const reticleX = useSpring(rawX, RETICLE_SPRING);
  const reticleY = useSpring(rawY, RETICLE_SPRING);
  const spotlightX = useSpring(rawX, SPOTLIGHT_SPRING);
  const spotlightY = useSpring(rawY, SPOTLIGHT_SPRING);

  const [cursorInside, setCursorInside] = useState<boolean>(false);
  const [hudCoords, setHudCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [padPressed, setPadPressed] = useState<boolean>(false);
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [touchPoints, setTouchPoints] = useState<TouchContactPoint[]>([]);
  const [peakTouches, setPeakTouches] = useState<number>(0);
  const [pollingHz, setPollingHz] = useState<number>(0);
  const [peakHz, setPeakHz] = useState<number>(0);

  const [scrollDir, setScrollDir] = useState<ScrollDirection | null>(null);
  const [scrollDelta, setScrollDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollCount, setScrollCount] = useState<number>(0);
  const [testedScrollDirs, setTestedScrollDirs] = useState<Set<string>>(() => new Set());

  const stageRef = useRef<HTMLDivElement | null>(null);
  const padRef = useRef<HTMLDivElement | null>(null);
  const rippleIdRef = useRef<number>(0);
  const downTimesRef = useRef<Map<number, number>>(new Map());
  const lastClickTimeRef = useRef<Map<number, number>>(new Map());
  const moveTimestampsRef = useRef<number[]>([]);
  const lastHudSyncRef = useRef<number>(0);
  const scrollClearTimerRef = useRef<number | null>(null);
  const soundEnabledRef = useRef<boolean>(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const resetAll = useCallback(() => {
    setActiveButtons(new Set());
    setTestedButtons(new Set());
    setChatterButtons(new Set());
    setButtonCounts({});
    setTotalClicks(0);
    setLastClickHoldMs(null);
    setLastChatterInfo(null);
    setRipples([]);
    setTouchPoints([]);
    setPeakTouches(0);
    setPollingHz(0);
    setPeakHz(0);
    setScrollDir(null);
    setScrollDelta({ x: 0, y: 0 });
    setScrollCount(0);
    setTestedScrollDirs(new Set());
    downTimesRef.current.clear();
    lastClickTimeRef.current.clear();
    moveTimestampsRef.current = [];
  }, []);

  useEffect(() => {
    if (resetSignal > 0) {
      resetAll();
    }
  }, [resetSignal, resetAll]);

  // Non-passive wheel gesture capture on touchpad + mouse stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dx = Math.round(e.deltaX);
      const dy = Math.round(e.deltaY);

      let dir: ScrollDirection = "down";
      if (e.ctrlKey) {
        dir = "pinch";
      } else if (Math.abs(dy) >= Math.abs(dx)) {
        dir = dy < 0 ? "up" : "down";
      } else {
        dir = dx < 0 ? "left" : "right";
      }

      setScrollDir(dir);
      setScrollDelta({ x: dx, y: dy });
      setScrollCount((c) => c + 1);
      setTestedScrollDirs((prev) => {
        if (prev.has(dir)) return prev;
        const next = new Set(prev);
        next.add(dir);
        return next;
      });

      if (scrollClearTimerRef.current) {
        window.clearTimeout(scrollClearTimerRef.current);
      }
      scrollClearTimerRef.current = window.setTimeout(() => {
        setScrollDir(null);
      }, 280);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (scrollClearTimerRef.current) {
        window.clearTimeout(scrollClearTimerRef.current);
      }
    };
  }, []);

  const registerButtonDown = useCallback(
    (button: number, rippleCoords?: { x: number; y: number }) => {
      const now = performance.now();
      const chatter = evaluateSwitchChatter(
        lastClickTimeRef.current.get(button),
        now,
        MOUSE_CHATTER_THRESHOLD_MS
      );

      if (chatter.isChatter && chatter.deltaMs !== null) {
        setChatterButtons((prev) => {
          const next = new Set(prev);
          next.add(button);
          return next;
        });
        const label = MOUSE_BUTTONS.find((b) => b.id === button)?.name ?? `Button ${button}`;
        setLastChatterInfo(`${label} bounced in ${chatter.deltaMs}ms`);
      }

      lastClickTimeRef.current.set(button, now);
      downTimesRef.current.set(button, now);

      if (soundEnabledRef.current) {
        soundEngine.play(chatter.isChatter ? "chatter" : "press", button === 1);
      }

      setActiveButtons((prev) => {
        const next = new Set(prev);
        next.add(button);
        return next;
      });
      setTestedButtons((prev) => {
        if (prev.has(button)) return prev;
        const next = new Set(prev);
        next.add(button);
        return next;
      });
      setButtonCounts((prev) => ({ ...prev, [button]: (prev[button] || 0) + 1 }));
      setTotalClicks((c) => c + 1);

      if (rippleCoords) {
        rippleIdRef.current += 1;
        const id = rippleIdRef.current;
        setRipples((prev) => [
          ...prev.slice(-4),
          { id, x: rippleCoords.x, y: rippleCoords.y, button },
        ]);
        window.setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 460);
      }
    },
    [soundEngine]
  );

  const registerButtonUp = useCallback((button: number) => {
    const now = performance.now();
    const downTime = downTimesRef.current.get(button);
    if (downTime !== undefined) {
      setLastClickHoldMs(Math.max(1, Math.round(now - downTime)));
      downTimesRef.current.delete(button);
    }
    setActiveButtons((prev) => {
      if (!prev.has(button)) return prev;
      const next = new Set(prev);
      next.delete(button);
      return next;
    });
  }, []);

  const handleStageMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      let coords: { x: number; y: number } | undefined;
      if (padRef.current && padRef.current.contains(e.target as Node)) {
        const rect = padRef.current.getBoundingClientRect();
        coords = {
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        };
        setPadPressed(true);
      }
      registerButtonDown(e.button, coords);
    },
    [registerButtonDown]
  );

  const handleStageMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setPadPressed(false);
      registerButtonUp(e.button);
    },
    [registerButtonUp]
  );

  const handleStageMouseLeave = useCallback(() => {
    setPadPressed(false);
    setActiveButtons(new Set());
  }, []);

  // Zero-rerender pointer move: drives Framer MotionValues on GPU; throttles text readout to ~12fps
  const handlePadPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pxX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const pxY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      rawX.set(pxX);
      rawY.set(pxY);
      if (!cursorInside) {
        setCursorInside(true);
      }

      const now = performance.now();
      const stamps = moveTimestampsRef.current;
      stamps.push(now);
      const cutoff = now - 400;
      while (stamps.length > 0 && stamps[0] < cutoff) {
        stamps.shift();
      }

      // Throttle numeric HUD pill updates to once every 75ms
      if (now - lastHudSyncRef.current >= 75) {
        lastHudSyncRef.current = now;
        const pctX = Math.round((pxX / rect.width) * 100);
        const pctY = Math.round((pxY / rect.height) * 100);
        setHudCoords({ x: pctX, y: pctY });

        if (stamps.length >= 2) {
          const spanSec = (now - stamps[0]) / 1000;
          if (spanSec > 0.04) {
            const hz = Math.min(8000, Math.round((stamps.length - 1) / spanSec));
            setPollingHz(hz);
            setPeakHz((prev) => (hz > prev ? hz : prev));
          }
        }
      }
    },
    [cursorInside, rawX, rawY]
  );

  const handlePadPointerLeave = useCallback(() => {
    setCursorInside(false);
  }, []);

  const updateTouchContacts = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const next: TouchContactPoint[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      next.push({
        id: t.identifier,
        x: Math.max(0, Math.min(100, ((t.clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((t.clientY - rect.top) / rect.height) * 100)),
      });
    }
    setTouchPoints(next);
    setPeakTouches((prev) => (next.length > prev ? next.length : prev));
  }, []);

  const clearTouchContacts = useCallback(() => {
    setTouchPoints([]);
  }, []);

  const verifiedCount = MOUSE_BUTTONS.filter((b) => testedButtons.has(b.id)).length;

  return {
    stageRef,
    padRef,
    reticleX,
    reticleY,
    spotlightX,
    spotlightY,
    cursorInside,
    hudCoords,
    activeButtons,
    testedButtons,
    chatterButtons,
    buttonCounts,
    totalClicks,
    lastClickHoldMs,
    lastChatterInfo,
    padPressed,
    ripples,
    touchPoints,
    peakTouches,
    pollingHz,
    peakHz,
    scrollDir,
    scrollDelta,
    scrollCount,
    testedScrollDirs,
    verifiedCount,
    resetAll,
    handleStageMouseDown,
    handleStageMouseUp,
    handleStageMouseLeave,
    handlePadPointerMove,
    handlePadPointerLeave,
    updateTouchContacts,
    clearTouchContacts,
  };
}
