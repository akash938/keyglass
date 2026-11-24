export type KeyboardLayoutId = "full" | "tkl" | "laptop" | "compact";
export type OsMode = "mac" | "windows";

export interface KeyDef {
  code: string;
  label: string;
  subLabel?: string;
  macLabel?: string;
  macSubLabel?: string;
  /** Width in standard key units (1u = alpha key) */
  w?: number;
  /** Height in standard key units (default 1) */
  h?: number;
  /** Invisible spacer gap in key units */
  isSpacer?: boolean;
  /** Visual legend alignment */
  align?: "center" | "left" | "right";
  /** Compact typography for longer legends */
  compactText?: boolean;
  /** Secondary macOS symbol (e.g. ⌘, ⌥, ⌃, ⇧, 🌐) */
  macIcon?: string;
}

export interface NumpadKeyDef extends KeyDef {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

export interface LayoutMeta {
  id: KeyboardLayoutId;
  name: string;
  shortName: string;
  description: string;
  keyCountLabel: string;
}

export interface LedState {
  capsLock: boolean;
  numLock: boolean;
  scrollLock: boolean;
}

export interface KeyEventRecord {
  id: number;
  code: string;
  key: string;
  keyCode: number;
  location: number;
  repeat: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  fnKey?: boolean;
  holdDurationMs: number | null;
  intervalMs: number | null;
}

export interface ChatterIncident {
  code: string;
  label: string;
  deltaMs: number;
  timestamp: number;
}

export interface KeyHistoryItem {
  id: number;
  code: string;
  label: string;
  chatter?: boolean;
}

export interface KeyboardReportData {
  layoutName: string;
  os: OsMode;
  testedCount: number;
  totalKeys: number;
  totalPresses: number;
  peakNkro: number;
  chatterCount: number;
  chatterKeyCodes: string[];
  testedAt: Date;
}
