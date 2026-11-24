import { OsMode } from "@/domain/entities/keyboard";

const CHAR_TO_CODE: Record<string, string> = {
  "`": "Backquote",
  "~": "Backquote",
  "1": "Digit1",
  "!": "Digit1",
  "2": "Digit2",
  "@": "Digit2",
  "3": "Digit3",
  "#": "Digit3",
  "4": "Digit4",
  "$": "Digit4",
  "5": "Digit5",
  "%": "Digit5",
  "6": "Digit6",
  "^": "Digit6",
  "7": "Digit7",
  "&": "Digit7",
  "8": "Digit8",
  "*": "Digit8",
  "9": "Digit9",
  "(": "Digit9",
  "0": "Digit0",
  ")": "Digit0",
  "-": "Minus",
  "_": "Minus",
  "=": "Equal",
  "+": "Equal",
  "[": "BracketLeft",
  "{": "BracketLeft",
  "]": "BracketRight",
  "}": "BracketRight",
  "\\": "Backslash",
  "|": "Backslash",
  ";": "Semicolon",
  ":": "Semicolon",
  "'": "Quote",
  '"': "Quote",
  ",": "Comma",
  "<": "Comma",
  ".": "Period",
  ">": "Period",
  "/": "Slash",
  "?": "Slash",
  " ": "Space",
};

const SPECIAL_KEY_TO_CODE: Record<string, string> = {
  Escape: "Escape",
  Backspace: "Backspace",
  Tab: "Tab",
  Enter: "Enter",
  CapsLock: "CapsLock",
  Shift: "ShiftLeft",
  Control: "ControlLeft",
  Alt: "AltLeft",
  Meta: "MetaLeft",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Insert: "Insert",
  Delete: "Delete",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  PrintScreen: "PrintScreen",
  ScrollLock: "ScrollLock",
  Pause: "Pause",
  NumLock: "NumLock",
  ContextMenu: "ContextMenu",
  Fn: "Fn",
  Function: "Fn",
  Globe: "Fn",
};

const MAC_MEDIA_TO_FKEY: Record<string, string> = {
  BrightnessDown: "F1",
  BrightnessUp: "F2",
  MediaTrackPrevious: "F7",
  MediaPlayPause: "F8",
  MediaTrackNext: "F9",
  AudioVolumeMute: "F10",
  VolumeMute: "F10",
  AudioVolumeDown: "F11",
  VolumeDown: "F11",
  AudioVolumeUp: "F12",
  VolumeUp: "F12",
};

export function resolveKeyCode(
  code: string,
  key: string,
  keyCode = 0,
  os: OsMode = "windows"
): string {
  if (
    code === "Fn" ||
    code === "Globe" ||
    code === "Function" ||
    key === "Fn" ||
    key === "Function" ||
    key === "Globe" ||
    (os === "mac" && (keyCode === 63 || keyCode === 179))
  ) {
    return "Fn";
  }

  if (code === "F11" || key === "F11" || keyCode === 122) {
    return "F11";
  }

  if (os === "mac") {
    if (MAC_MEDIA_TO_FKEY[code]) return MAC_MEDIA_TO_FKEY[code];
    if (MAC_MEDIA_TO_FKEY[key]) return MAC_MEDIA_TO_FKEY[key];
  }

  if (code && code !== "Unidentified") {
    return code;
  }
  return mapCharOrKeyToCode(key);
}

export function mapCharOrKeyToCode(key: string): string {
  if (!key) return "Unidentified";
  if (SPECIAL_KEY_TO_CODE[key]) return SPECIAL_KEY_TO_CODE[key];
  if (/^F([1-9]|1[0-2])$/.test(key)) return key;
  if (key.length === 1) {
    const upper = key.toUpperCase();
    if (upper >= "A" && upper <= "Z") {
      return `Key${upper}`;
    }
    if (CHAR_TO_CODE[key]) {
      return CHAR_TO_CODE[key];
    }
  }
  return key;
}

export function isMacFnChordEvent(
  code: string,
  key: string,
  fnModifierActive: boolean,
  os: OsMode
): boolean {
  if (os !== "mac") return false;
  return (
    fnModifierActive ||
    (code === "Backspace" && key === "Delete") ||
    (code.startsWith("Arrow") && ["Home", "End", "PageUp", "PageDown"].includes(key))
  );
}

export function formatReadableKey(code: string, key: string): string {
  if (key === " ") return "Space";
  if (key && key !== "Unidentified" && key.length === 1) return key.toUpperCase();
  if (key && key !== "Unidentified") return key;
  return code;
}

export function getLocationLabel(location: number): string {
  switch (location) {
    case 1:
      return "Left (1)";
    case 2:
      return "Right (2)";
    case 3:
      return "Numpad (3)";
    default:
      return "Standard (0)";
  }
}

export const MODIFIER_CODES = new Set([
  "Fn",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "CapsLock",
  "Space",
  "Enter",
  "Backspace",
  "Tab",
]);
