export type KeySoundKind = "press" | "release" | "chatter";

export interface SoundEnginePort {
  play(kind: KeySoundKind, isModifier?: boolean): void;
}
