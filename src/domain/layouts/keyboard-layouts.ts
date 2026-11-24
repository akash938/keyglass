import {
  KeyDef,
  KeyboardLayoutId,
  LayoutMeta,
  NumpadKeyDef,
  OsMode,
} from "@/domain/entities/keyboard";

export const LAYOUT_OPTIONS: LayoutMeta[] = [
  {
    id: "full",
    name: "Full Size (100%)",
    shortName: "100% Full",
    description: "Complete 104-key desktop & gaming keyboard with Numpad",
    keyCountLabel: "104 Keys",
  },
  {
    id: "tkl",
    name: "Tenkeyless (80%)",
    shortName: "80% TKL",
    description: "87-key mechanical & esports layout without Numpad",
    keyCountLabel: "87 Keys",
  },
  {
    id: "laptop",
    name: "75% / MacBook",
    shortName: "75% Laptop",
    description: "Compact MacBook Pro & laptop layout with function row",
    keyCountLabel: "84 Keys",
  },
  {
    id: "compact",
    name: "Compact (60%)",
    shortName: "60% Mini",
    description: "Minimalist 61-key portable & custom mechanical layout",
    keyCountLabel: "61 Keys",
  },
];

// Main Function Row for Full & TKL (total width = 15u)
export const MAIN_FN_ROW: KeyDef[] = [
  { code: "Escape", label: "Esc", macLabel: "esc", w: 1, compactText: true },
  { code: "spacer-fn-1", label: "", w: 1, isSpacer: true },
  { code: "F1", label: "F1", macSubLabel: "☀︎", w: 1 },
  { code: "F2", label: "F2", macSubLabel: "☀", w: 1 },
  { code: "F3", label: "F3", w: 1 },
  { code: "F4", label: "F4", w: 1 },
  { code: "spacer-fn-2", label: "", w: 0.5, isSpacer: true },
  { code: "F5", label: "F5", w: 1 },
  { code: "F6", label: "F6", w: 1 },
  { code: "F7", label: "F7", macSubLabel: "⏮", w: 1 },
  { code: "F8", label: "F8", macSubLabel: "⏯", w: 1 },
  { code: "spacer-fn-3", label: "", w: 0.5, isSpacer: true },
  { code: "F9", label: "F9", macSubLabel: "⏭", w: 1 },
  { code: "F10", label: "F10", macSubLabel: "🔇", w: 1 },
  { code: "F11", label: "F11", macSubLabel: "🔉", w: 1 },
  { code: "F12", label: "F12", macSubLabel: "🔊", w: 1 },
];

// Main 5 Alpha/Modifier Rows (each row sums to exactly 15u)
export const MAIN_ALPHA_ROWS: KeyDef[][] = [
  [
    { code: "Backquote", label: "`", subLabel: "~", w: 1 },
    { code: "Digit1", label: "1", subLabel: "!", w: 1 },
    { code: "Digit2", label: "2", subLabel: "@", w: 1 },
    { code: "Digit3", label: "3", subLabel: "#", w: 1 },
    { code: "Digit4", label: "4", subLabel: "$", w: 1 },
    { code: "Digit5", label: "5", subLabel: "%", w: 1 },
    { code: "Digit6", label: "6", subLabel: "^", w: 1 },
    { code: "Digit7", label: "7", subLabel: "&", w: 1 },
    { code: "Digit8", label: "8", subLabel: "*", w: 1 },
    { code: "Digit9", label: "9", subLabel: "(", w: 1 },
    { code: "Digit0", label: "0", subLabel: ")", w: 1 },
    { code: "Minus", label: "-", subLabel: "_", w: 1 },
    { code: "Equal", label: "=", subLabel: "+", w: 1 },
    {
      code: "Backspace",
      label: "Backspace",
      macLabel: "delete",
      macIcon: "⌫",
      w: 2,
      align: "right",
      compactText: true,
    },
  ],
  [
    {
      code: "Tab",
      label: "Tab",
      macLabel: "tab",
      macIcon: "⇥",
      w: 1.5,
      align: "left",
      compactText: true,
    },
    { code: "KeyQ", label: "Q", w: 1 },
    { code: "KeyW", label: "W", w: 1 },
    { code: "KeyE", label: "E", w: 1 },
    { code: "KeyR", label: "R", w: 1 },
    { code: "KeyT", label: "T", w: 1 },
    { code: "KeyY", label: "Y", w: 1 },
    { code: "KeyU", label: "U", w: 1 },
    { code: "KeyI", label: "I", w: 1 },
    { code: "KeyO", label: "O", w: 1 },
    { code: "KeyP", label: "P", w: 1 },
    { code: "BracketLeft", label: "[", subLabel: "{", w: 1 },
    { code: "BracketRight", label: "]", subLabel: "}", w: 1 },
    { code: "Backslash", label: "\\", subLabel: "|", w: 1.5 },
  ],
  [
    {
      code: "CapsLock",
      label: "Caps",
      macLabel: "caps lock",
      macIcon: "⇪",
      w: 1.75,
      align: "left",
      compactText: true,
    },
    { code: "KeyA", label: "A", w: 1 },
    { code: "KeyS", label: "S", w: 1 },
    { code: "KeyD", label: "D", w: 1 },
    { code: "KeyF", label: "F", w: 1 },
    { code: "KeyG", label: "G", w: 1 },
    { code: "KeyH", label: "H", w: 1 },
    { code: "KeyJ", label: "J", w: 1 },
    { code: "KeyK", label: "K", w: 1 },
    { code: "KeyL", label: "L", w: 1 },
    { code: "Semicolon", label: ";", subLabel: ":", w: 1 },
    { code: "Quote", label: "'", subLabel: '"', w: 1 },
    {
      code: "Enter",
      label: "Enter",
      macLabel: "return",
      macIcon: "↵",
      w: 2.25,
      align: "right",
      compactText: true,
    },
  ],
  [
    {
      code: "ShiftLeft",
      label: "Shift",
      macLabel: "shift",
      macIcon: "⇧",
      w: 2.25,
      align: "left",
      compactText: true,
    },
    { code: "KeyZ", label: "Z", w: 1 },
    { code: "KeyX", label: "X", w: 1 },
    { code: "KeyC", label: "C", w: 1 },
    { code: "KeyV", label: "V", w: 1 },
    { code: "KeyB", label: "B", w: 1 },
    { code: "KeyN", label: "N", w: 1 },
    { code: "KeyM", label: "M", w: 1 },
    { code: "Comma", label: ",", subLabel: "<", w: 1 },
    { code: "Period", label: ".", subLabel: ">", w: 1 },
    { code: "Slash", label: "/", subLabel: "?", w: 1 },
    {
      code: "ShiftRight",
      label: "Shift",
      macLabel: "shift",
      macIcon: "⇧",
      w: 2.75,
      align: "right",
      compactText: true,
    },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", macLabel: "control", macIcon: "⌃", w: 1.25, compactText: true },
    { code: "MetaLeft", label: "Win", macLabel: "option", macIcon: "⌥", w: 1.25, compactText: true },
    { code: "AltLeft", label: "Alt", macLabel: "command", macIcon: "⌘", w: 1.25, compactText: true },
    { code: "Space", label: "", macLabel: "", w: 6.25 },
    { code: "AltRight", label: "Alt", macLabel: "command", macIcon: "⌘", w: 1.25, compactText: true },
    { code: "MetaRight", label: "Win", macLabel: "option", macIcon: "⌥", w: 1.25, compactText: true },
    { code: "ContextMenu", label: "Menu", macLabel: "fn", macIcon: "🌐", w: 1.25, compactText: true },
    { code: "ControlRight", label: "Ctrl", macLabel: "control", macIcon: "⌃", w: 1.25, compactText: true },
  ],
];

export function getBottomRowForOs(os: OsMode): KeyDef[] {
  if (os === "mac") {
    return [
      { code: "Fn", label: "fn", macLabel: "fn", macIcon: "🌐", w: 1.25, align: "left", compactText: true },
      { code: "ControlLeft", label: "Ctrl", macLabel: "control", macIcon: "⌃", w: 1.25, compactText: true },
      { code: "AltLeft", label: "Alt", macLabel: "option", macIcon: "⌥", w: 1.25, compactText: true },
      { code: "MetaLeft", label: "Win", macLabel: "command", macIcon: "⌘", w: 1.5, compactText: true },
      { code: "Space", label: "", macLabel: "", w: 5.5 },
      { code: "MetaRight", label: "Win", macLabel: "command", macIcon: "⌘", w: 1.5, compactText: true },
      { code: "AltRight", label: "Alt", macLabel: "option", macIcon: "⌥", w: 1.25, compactText: true },
      { code: "ControlRight", label: "Ctrl", macLabel: "control", macIcon: "⌃", w: 1.5, compactText: true },
    ];
  }
  return MAIN_ALPHA_ROWS[4];
}

export const NAV_ROWS: KeyDef[][] = [
  [
    { code: "PrintScreen", label: "PrtSc", macLabel: "F13", w: 1, compactText: true },
    { code: "ScrollLock", label: "ScrLk", macLabel: "F14", w: 1, compactText: true },
    { code: "Pause", label: "Pause", macLabel: "F15", w: 1, compactText: true },
  ],
  [
    { code: "Insert", label: "Ins", macLabel: "ins", w: 1, compactText: true },
    { code: "Home", label: "Home", macLabel: "↖", w: 1, compactText: true },
    { code: "PageUp", label: "PgUp", macLabel: "⇞", w: 1, compactText: true },
  ],
  [
    { code: "Delete", label: "Del", macLabel: "⌦", w: 1, compactText: true },
    { code: "End", label: "End", macLabel: "↘", w: 1, compactText: true },
    { code: "PageDown", label: "PgDn", macLabel: "⇟", w: 1, compactText: true },
  ],
  [{ code: "spacer-nav-mid", label: "", w: 3, isSpacer: true }],
  [
    { code: "spacer-up-l", label: "", w: 1, isSpacer: true },
    { code: "ArrowUp", label: "↑", w: 1 },
    { code: "spacer-up-r", label: "", w: 1, isSpacer: true },
  ],
  [
    { code: "ArrowLeft", label: "←", w: 1 },
    { code: "ArrowDown", label: "↓", w: 1 },
    { code: "ArrowRight", label: "→", w: 1 },
  ],
];

export const NUMPAD_KEYS: NumpadKeyDef[] = [
  { code: "NumLock", label: "Num", macLabel: "clear", colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1, compactText: true },
  { code: "NumpadDivide", label: "/", colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
  { code: "NumpadMultiply", label: "*", colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
  { code: "NumpadSubtract", label: "-", colStart: 4, colSpan: 1, rowStart: 1, rowSpan: 1 },
  { code: "Numpad7", label: "7", subLabel: "Home", colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
  { code: "Numpad8", label: "8", subLabel: "↑", colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
  { code: "Numpad9", label: "9", subLabel: "PgUp", colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 1 },
  { code: "NumpadAdd", label: "+", colStart: 4, colSpan: 1, rowStart: 2, rowSpan: 2 },
  { code: "Numpad4", label: "4", subLabel: "←", colStart: 1, colSpan: 1, rowStart: 3, rowSpan: 1 },
  { code: "Numpad5", label: "5", colStart: 2, colSpan: 1, rowStart: 3, rowSpan: 1 },
  { code: "Numpad6", label: "6", subLabel: "→", colStart: 3, colSpan: 1, rowStart: 3, rowSpan: 1 },
  { code: "Numpad1", label: "1", subLabel: "End", colStart: 1, colSpan: 1, rowStart: 4, rowSpan: 1 },
  { code: "Numpad2", label: "2", subLabel: "↓", colStart: 2, colSpan: 1, rowStart: 4, rowSpan: 1 },
  { code: "Numpad3", label: "3", subLabel: "PgDn", colStart: 3, colSpan: 1, rowStart: 4, rowSpan: 1 },
  { code: "NumpadEnter", label: "Ent", macLabel: "⌤", colStart: 4, colSpan: 1, rowStart: 4, rowSpan: 2, compactText: true },
  { code: "Numpad0", label: "0", subLabel: "Ins", colStart: 1, colSpan: 2, rowStart: 5, rowSpan: 1 },
  { code: "NumpadDecimal", label: ".", subLabel: "Del", colStart: 3, colSpan: 1, rowStart: 5, rowSpan: 1 },
];

export function getLaptopRows(os: OsMode): KeyDef[][] {
  return [
    [
      { code: "Escape", label: "Esc", macLabel: "esc", w: 1.5, compactText: true },
      { code: "F1", label: "F1", macSubLabel: "☀︎", w: 1 },
      { code: "F2", label: "F2", macSubLabel: "☀", w: 1 },
      { code: "F3", label: "F3", w: 1 },
      { code: "F4", label: "F4", w: 1 },
      { code: "F5", label: "F5", w: 1 },
      { code: "F6", label: "F6", w: 1 },
      { code: "F7", label: "F7", macSubLabel: "⏮", w: 1 },
      { code: "F8", label: "F8", macSubLabel: "⏯", w: 1 },
      { code: "F9", label: "F9", macSubLabel: "⏭", w: 1 },
      { code: "F10", label: "F10", macSubLabel: "🔇", w: 1 },
      { code: "F11", label: "F11", macSubLabel: "🔉", w: 1 },
      { code: "F12", label: "F12", macSubLabel: "🔊", w: 1 },
      { code: "Insert", label: "Ins", macLabel: "mic", w: 1.25, compactText: true },
      { code: "Delete", label: "Del", macLabel: "⌦", w: 1.25, compactText: true },
    ],
    [...MAIN_ALPHA_ROWS[0], { code: "Home", label: "Home", macLabel: "↖", w: 1, compactText: true }],
    [...MAIN_ALPHA_ROWS[1], { code: "PageUp", label: "PgUp", macLabel: "⇞", w: 1, compactText: true }],
    [...MAIN_ALPHA_ROWS[2], { code: "PageDown", label: "PgDn", macLabel: "⇟", w: 1, compactText: true }],
    [
      { code: "ShiftLeft", label: "Shift", macLabel: "shift", macIcon: "⇧", w: 2.25, align: "left", compactText: true },
      { code: "KeyZ", label: "Z", w: 1 },
      { code: "KeyX", label: "X", w: 1 },
      { code: "KeyC", label: "C", w: 1 },
      { code: "KeyV", label: "V", w: 1 },
      { code: "KeyB", label: "B", w: 1 },
      { code: "KeyN", label: "N", w: 1 },
      { code: "KeyM", label: "M", w: 1 },
      { code: "Comma", label: ",", subLabel: "<", w: 1 },
      { code: "Period", label: ".", subLabel: ">", w: 1 },
      { code: "Slash", label: "/", subLabel: "?", w: 1 },
      { code: "ShiftRight", label: "Shift", macLabel: "shift", macIcon: "⇧", w: 1.75, align: "right", compactText: true },
      { code: "ArrowUp", label: "↑", w: 1 },
      { code: "End", label: "End", macLabel: "↘", w: 1, compactText: true },
    ],
    os === "mac"
      ? [
          { code: "Fn", label: "fn", macLabel: "fn", macIcon: "🌐", w: 1.25, align: "left", compactText: true },
          { code: "ControlLeft", label: "Ctrl", macLabel: "control", macIcon: "⌃", w: 1.25, compactText: true },
          { code: "AltLeft", label: "Alt", macLabel: "option", macIcon: "⌥", w: 1.25, compactText: true },
          { code: "MetaLeft", label: "Win", macLabel: "command", macIcon: "⌘", w: 1.5, compactText: true },
          { code: "Space", label: "", macLabel: "", w: 5.5 },
          { code: "MetaRight", label: "Win", macLabel: "command", macIcon: "⌘", w: 1.25, compactText: true },
          { code: "AltRight", label: "Alt", macLabel: "option", macIcon: "⌥", w: 1, compactText: true },
          { code: "ArrowLeft", label: "←", w: 1 },
          { code: "ArrowDown", label: "↓", w: 1 },
          { code: "ArrowRight", label: "→", w: 1 },
        ]
      : [
          { code: "ControlLeft", label: "Ctrl", w: 1.25, compactText: true },
          { code: "MetaLeft", label: "Win", w: 1.25, compactText: true },
          { code: "AltLeft", label: "Alt", w: 1.25, compactText: true },
          { code: "Space", label: "", w: 6.25 },
          { code: "AltRight", label: "Alt", w: 1, compactText: true },
          { code: "ContextMenu", label: "Fn", w: 1, compactText: true },
          { code: "ControlRight", label: "Ctrl", w: 1, compactText: true },
          { code: "ArrowLeft", label: "←", w: 1 },
          { code: "ArrowDown", label: "↓", w: 1 },
          { code: "ArrowRight", label: "→", w: 1 },
        ],
  ];
}

export function getLayoutKeyCodes(layout: KeyboardLayoutId, os: OsMode): string[] {
  const codes = new Set<string>();
  const addRows = (rows: KeyDef[][]) => {
    for (const row of rows) {
      for (const k of row) {
        if (!k.isSpacer) codes.add(k.code);
      }
    }
  };

  if (layout === "compact") {
    addRows([...MAIN_ALPHA_ROWS.slice(0, 4), getBottomRowForOs(os)]);
  } else if (layout === "laptop") {
    addRows(getLaptopRows(os));
  } else if (layout === "tkl") {
    addRows([MAIN_FN_ROW, ...MAIN_ALPHA_ROWS.slice(0, 4), getBottomRowForOs(os)]);
    addRows(NAV_ROWS);
  } else {
    addRows([MAIN_FN_ROW, ...MAIN_ALPHA_ROWS.slice(0, 4), getBottomRowForOs(os)]);
    addRows(NAV_ROWS);
    for (const nk of NUMPAD_KEYS) {
      codes.add(nk.code);
    }
  }

  return Array.from(codes);
}

export function getDisplayLabel(
  key: KeyDef,
  os: OsMode
): { main: string; sub?: string; icon?: string } {
  if (os === "mac") {
    return {
      main: key.macLabel !== undefined ? key.macLabel : key.label,
      sub: key.macSubLabel !== undefined ? key.macSubLabel : key.subLabel,
      icon: key.macIcon,
    };
  }
  return {
    main: key.label,
    sub: key.subLabel,
  };
}
