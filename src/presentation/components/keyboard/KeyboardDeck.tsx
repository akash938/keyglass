"use client";

import React, { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyDef,
  KeyboardLayoutId,
  LedState,
  OsMode,
} from "@/domain/entities/keyboard";
import {
  MAIN_ALPHA_ROWS,
  MAIN_FN_ROW,
  NAV_ROWS,
  NUMPAD_KEYS,
  getBottomRowForOs,
  getLaptopRows,
} from "@/domain/layouts/keyboard-layouts";
import { KeyCap } from "./KeyCap";

interface KeyboardDeckProps {
  layout: KeyboardLayoutId;
  os: OsMode;
  activeKeys: Set<string>;
  testedKeys: Set<string>;
  chatterKeys: Set<string>;
  pressCounts: Record<string, number>;
  ledState: LedState;
}

const DECK_TRANSITION = {
  type: "spring" as const,
  stiffness: 480,
  damping: 36,
  mass: 0.7,
};

const preventMouse = (e: React.MouseEvent) => e.preventDefault();

export const KeyboardDeck = memo(function KeyboardDeck({
  layout,
  os,
  activeKeys,
  testedKeys,
  chatterKeys,
  pressCounts,
  ledState,
}: KeyboardDeckProps) {
  const mainRows = useMemo(() => {
    const bottomRow = getBottomRowForOs(os);
    const alpha = [...MAIN_ALPHA_ROWS.slice(0, 4), bottomRow];
    if (layout === "compact") return alpha;
    return [MAIN_FN_ROW, ...alpha];
  }, [layout, os]);

  const laptopRows = useMemo(() => getLaptopRows(os), [os]);

  const renderRow = (row: KeyDef[], rowIdx: number, rowHeightClass: string) => (
    <div key={rowIdx} className={`flex w-full gap-[5px] ${rowHeightClass}`}>
      {row.map((keyDef) => (
        <KeyCap
          key={keyDef.code}
          keyDef={keyDef}
          os={os}
          isActive={activeKeys.has(keyDef.code)}
          isTested={testedKeys.has(keyDef.code)}
          hasChatter={chatterKeys.has(keyDef.code)}
          pressCount={pressCounts[keyDef.code] || 0}
          isCapsLedOn={keyDef.code === "CapsLock" ? ledState.capsLock : undefined}
          flexGrow={keyDef.w ?? 1}
          className="h-full min-w-0"
        />
      ))}
    </div>
  );

  const deckMinWidth =
    layout === "full"
      ? "min-w-[960px]"
      : layout === "tkl"
        ? "min-w-[780px]"
        : layout === "laptop"
          ? "min-w-[680px]"
          : "min-w-[580px]";

  const deckMaxWidth =
    layout === "full"
      ? "max-w-[1220px]"
      : layout === "tkl"
        ? "max-w-[980px]"
        : layout === "laptop"
          ? "max-w-[880px]"
          : "max-w-[760px]";

  return (
    <div
      onMouseDown={preventMouse}
      onClick={preventMouse}
      className="glass-panel relative mx-auto w-full select-none rounded-[28px] p-2.5 sm:p-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/25"
      />

      <div className="glass-scrollbar overflow-x-auto pb-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${layout}-${os}`}
            initial={{ opacity: 0, y: 8, scale: 0.988 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.988 }}
            transition={DECK_TRANSITION}
            className={`keyboard-deck mx-auto w-full ${deckMinWidth} ${deckMaxWidth} rounded-[20px] p-3 will-change-transform sm:p-3.5`}
          >
            {layout === "laptop" && (
              <div className="flex flex-col gap-[5px]">
                {laptopRows.map((row, idx) =>
                  renderRow(row, idx, idx === 0 ? "h-[36px] sm:h-[40px]" : "h-[46px] sm:h-[52px]")
                )}
              </div>
            )}

            {layout === "compact" && (
              <div className="flex flex-col gap-[6px]">
                {mainRows.map((row, idx) => renderRow(row, idx, "h-[48px] sm:h-[54px]"))}
              </div>
            )}

            {(layout === "tkl" || layout === "full") && (
              <div className="flex items-stretch gap-3 sm:gap-3.5">
                <div className="flex flex-col gap-[5px]" style={{ flexGrow: 15, flexBasis: 0 }}>
                  {mainRows.map((row, idx) => (
                    <div key={idx} className={idx === 0 ? "mb-[6px]" : ""}>
                      {renderRow(
                        row,
                        idx,
                        idx === 0 ? "h-[36px] sm:h-[40px]" : "h-[44px] sm:h-[50px]"
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-[5px]" style={{ flexGrow: 3, flexBasis: 0 }}>
                  {NAV_ROWS.map((row, idx) => (
                    <div key={idx} className={idx === 0 ? "mb-[6px]" : ""}>
                      {renderRow(
                        row,
                        idx,
                        idx === 0 ? "h-[36px] sm:h-[40px]" : "h-[44px] sm:h-[50px]"
                      )}
                    </div>
                  ))}
                </div>

                {layout === "full" && (
                  <div className="flex flex-col gap-[5px]" style={{ flexGrow: 4, flexBasis: 0 }}>
                    <div className="mb-[6px] flex h-[36px] items-center justify-center gap-4 rounded-[10px] border border-black/[0.04] bg-black/[0.025] px-2 sm:h-[40px] dark:border-white/[0.05] dark:bg-white/[0.025]">
                      {[
                        { label: "NUM", on: ledState.numLock },
                        { label: "CAPS", on: ledState.capsLock },
                        { label: "SCRL", on: ledState.scrollLock },
                      ].map((led) => (
                        <div key={led.label} className="flex flex-col items-center gap-1">
                          <span
                            className={`h-1.5 w-1.5 rounded-full transition-colors duration-150 ${
                              led.on
                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                                : "bg-slate-400/35 dark:bg-white/15"
                            }`}
                          />
                          <span className="font-mono text-[8px] font-semibold tracking-wider text-[var(--text-tertiary)]">
                            {led.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="grid flex-1 gap-[5px]"
                      style={{
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gridTemplateRows: "repeat(5, minmax(44px, 1fr))",
                      }}
                    >
                      {NUMPAD_KEYS.map((nk) => (
                        <KeyCap
                          key={nk.code}
                          keyDef={nk}
                          os={os}
                          isActive={activeKeys.has(nk.code)}
                          isTested={testedKeys.has(nk.code)}
                          hasChatter={chatterKeys.has(nk.code)}
                          pressCount={pressCounts[nk.code] || 0}
                          gridColStart={nk.colStart}
                          gridColSpan={nk.colSpan}
                          gridRowStart={nk.rowStart}
                          gridRowSpan={nk.rowSpan}
                          className="h-full w-full min-w-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend Footer */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-[var(--text-secondary)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[4px] border border-black/15 bg-white shadow-xs dark:border-white/20 dark:bg-slate-700" />
            Untested
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[4px] bg-[#007aff] shadow-[0_0_8px_rgba(0,122,255,0.6)]" />
            Pressed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[4px] border border-emerald-500/40 bg-emerald-400/35" />
            Verified
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[4px] border border-red-500/50 bg-red-500/35" />
            Chatter (&lt;55ms)
          </span>
        </div>
        <span className="hidden font-mono text-[10.5px] text-[var(--text-tertiary)] sm:inline">
          Physical keyboard input only — mouse clicks disabled on keycaps
        </span>
      </div>

      {/* OS Special Keys Notice (macOS fn/F11 live status & bypass + Windows/Linux F11 Fullscreen Lock tip) */}
      <AnimatePresence initial={false}>
        {os === "mac" ? (
          <motion.div
            key="mac-hardware-notice"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-black/[0.06] bg-black/[0.025] px-3 py-2 text-[11px] text-[var(--text-secondary)] dark:border-white/[0.08] dark:bg-white/[0.03]">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <strong className="font-semibold text-[var(--text-primary)]">
                  macOS 🌐 fn &amp; F11:
                </strong>
                <span>
                  Test{" "}
                  <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                    fn
                  </kbd>{" "}
                  via{" "}
                  <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                    fn + delete
                  </kbd>{" "}
                  (or{" "}
                  <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                    fn + return
                  </kbd>
                  ). Test{" "}
                  <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                    F11
                  </kbd>{" "}
                  via{" "}
                  <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                    ⌃ control + fn + F11
                  </kbd>{" "}
                  to bypass macOS Show Desktop without changing settings (or uncheck{" "}
                  <em>Show Desktop</em> in <em>System Settings → Keyboard Shortcuts → Mission Control</em>).
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-semibold">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    testedKeys.has("Fn")
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-black/[0.05] text-[var(--text-tertiary)] dark:bg-white/[0.08]"
                  }`}
                >
                  {testedKeys.has("Fn") ? "✓ fn verified" : "fn untested"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    testedKeys.has("F11")
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-black/[0.05] text-[var(--text-tertiary)] dark:bg-white/[0.08]"
                  }`}
                >
                  {testedKeys.has("F11") ? "✓ F11 verified" : "F11 untested"}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="win-hardware-notice"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-black/[0.06] bg-black/[0.025] px-3 py-2 text-[11px] text-[var(--text-secondary)] dark:border-white/[0.08] dark:bg-white/[0.03]">
              <span>
                <strong className="font-semibold text-[var(--text-primary)]">
                  F11 &amp; Browser Shortcuts:
                </strong>{" "}
                Keep <strong>Key Lock On</strong> to block browser actions, or click{" "}
                <strong>FS Lock</strong> in the top bar to trap browser-reserved{" "}
                <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                  F11
                </kbd>{" "}
                ,{" "}
                <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                  Esc
                </kbd>{" "}
                &amp;{" "}
                <kbd className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-2xs dark:bg-white/10">
                  Ctrl
                </kbd>{" "}
                combos.
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  testedKeys.has("F11")
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-black/[0.05] text-[var(--text-tertiary)] dark:bg-white/[0.08]"
                }`}
              >
                {testedKeys.has("F11") ? "✓ F11 verified" : "F11 untested"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
