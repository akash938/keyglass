export type MouseButtonId = 0 | 1 | 2 | 3 | 4;

export interface MouseButtonMeta {
  id: MouseButtonId;
  name: string;
  short: string;
}

export type ScrollDirection = "up" | "down" | "left" | "right" | "pinch";

export interface CursorPosition {
  x: number;
  y: number;
  inside: boolean;
}

export interface RipplePoint {
  id: number;
  x: number;
  y: number;
  button: number;
}

export interface TouchContactPoint {
  id: number;
  x: number;
  y: number;
}

export const MOUSE_BUTTONS: MouseButtonMeta[] = [
  { id: 0, name: "Left Click", short: "LMB" },
  { id: 2, name: "Right Click", short: "RMB" },
  { id: 1, name: "Middle / Wheel", short: "MMB" },
  { id: 3, name: "Side Back", short: "M4" },
  { id: 4, name: "Side Forward", short: "M5" },
];
