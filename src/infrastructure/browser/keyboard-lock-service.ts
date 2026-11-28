interface NavigatorKeyboard {
  lock?: (keyCodes?: string[]) => Promise<void>;
  unlock?: () => void;
}

interface NavigatorWithKeyboard extends Navigator {
  keyboard?: NavigatorKeyboard;
}

export interface FullscreenLockResult {
  fullscreen: boolean;
  keyboardApiLocked: boolean;
  error?: string;
}

export function isFullscreenApiSupported(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.fullscreenEnabled &&
      typeof document.documentElement?.requestFullscreen === "function"
  );
}

export function isKeyboardLockApiSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  const kb = (navigator as NavigatorWithKeyboard).keyboard;
  return Boolean(kb && typeof kb.lock === "function");
}

export function isDocumentFullscreen(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(document.fullscreenElement);
}

/**
 * Locks all browser-lockable keys (F1-F12, Escape, Tab, Cmd/Ctrl+W/T/N/R, etc.)
 * via the W3C Keyboard Lock API. In Chromium browsers this takes effect while in
 * JavaScript-initiated fullscreen mode.
 */
export async function lockNavigatorKeyboard(): Promise<boolean> {
  if (!isKeyboardLockApiSupported()) return false;
  const kb = (navigator as NavigatorWithKeyboard).keyboard;
  if (!kb?.lock) return false;
  try {
    await kb.lock();
    return true;
  } catch {
    return false;
  }
}

export function unlockNavigatorKeyboard(): void {
  if (typeof navigator === "undefined") return;
  const kb = (navigator as NavigatorWithKeyboard).keyboard;
  if (kb && typeof kb.unlock === "function") {
    try {
      kb.unlock();
    } catch {
      // Ignore unlock errors when not currently locked
    }
  }
}

export async function engageFullscreenKeyboardLock(): Promise<FullscreenLockResult> {
  if (!isFullscreenApiSupported()) {
    return {
      fullscreen: false,
      keyboardApiLocked: false,
      error: "Fullscreen API is not supported in this browser.",
    };
  }

  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    }
    const keyboardApiLocked = await lockNavigatorKeyboard();
    return {
      fullscreen: Boolean(document.fullscreenElement),
      keyboardApiLocked,
    };
  } catch (err) {
    return {
      fullscreen: Boolean(document.fullscreenElement),
      keyboardApiLocked: false,
      error: err instanceof Error ? err.message : "Could not enter fullscreen lock.",
    };
  }
}

export async function releaseFullscreenKeyboardLock(exitFullscreen = true): Promise<void> {
  unlockNavigatorKeyboard();
  if (
    exitFullscreen &&
    typeof document !== "undefined" &&
    document.fullscreenElement &&
    typeof document.exitFullscreen === "function"
  ) {
    try {
      await document.exitFullscreen();
    } catch {
      // Ignore exit errors if fullscreen already ended
    }
  }
}
