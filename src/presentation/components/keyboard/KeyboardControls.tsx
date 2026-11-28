"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Smartphone } from "lucide-react";
import { KeyboardLayoutId, OsMode } from "@/domain/entities/keyboard";
import { LAYOUT_OPTIONS } from "@/domain/layouts/keyboard-layouts";

interface KeyboardControlsProps {
  layout: KeyboardLayoutId;
  onSelectLayout: (layout: KeyboardLayoutId) => void;
  os: OsMode;
  onSelectOs: (os: OsMode) => void;
  testLock: boolean;
  mobileInputOpen: boolean;
  onToggleMobileInput: () => void;
  mobileText: string;
  onMobileTextChange: (val: string) => void;
  mobileInputRef: React.RefObject<HTMLInputElement | null>;
  copiedReport: boolean;
  onCopyReport: () => void;
}

const PILL_SPRING = { type: "spring" as const, stiffness: 560, damping: 36 };
const TAP_SPRING = { type: "spring" as const, stiffness: 580, damping: 28 };

export const KeyboardControls = memo(function KeyboardControls({
  layout,
  onSelectLayout,
  os,
  onSelectOs,
  testLock,
  mobileInputOpen,
  onToggleMobileInput,
  mobileText,
  onMobileTextChange,
  mobileInputRef,
  copiedReport,
  onCopyReport,
}: KeyboardControlsProps) {
  const controlTabIndex = testLock ? -1 : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5"
      >
        {/* Layout Switcher Pill */}
        <div
          role="tablist"
          aria-label="Keyboard Layout"
          className="glass-pill inline-flex flex-wrap items-center gap-1 rounded-full p-1"
        >
          {LAYOUT_OPTIONS.map((opt) => {
            const selected = layout === opt.id;
            return (
              <motion.button
                key={opt.id}
                role="tab"
                tabIndex={controlTabIndex}
                aria-selected={selected}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectLayout(opt.id)}
                className={`relative cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  selected
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="activeLayoutPill"
                    transition={PILL_SPRING}
                    className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/[0.14]"
                  />
                )}
                <span className="relative z-10">{opt.shortName}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Controls: OS Mode, Mobile Keyboard, Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Operating System Key Legends"
            className="glass-pill inline-flex items-center gap-1 rounded-full p-1"
          >
            {(["mac", "windows"] as OsMode[]).map((mode) => {
              const selected = os === mode;
              return (
                <motion.button
                  key={mode}
                  role="tab"
                  tabIndex={controlTabIndex}
                  aria-selected={selected}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectOs(mode)}
                  className={`relative cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    selected
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="activeOsPill"
                      transition={PILL_SPRING}
                      className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/[0.14]"
                    />
                  )}
                  <span className="relative z-10">
                    {mode === "mac" ? "⌘ macOS" : "⊞ Windows"}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            transition={TAP_SPRING}
            type="button"
            tabIndex={controlTabIndex}
            onClick={onToggleMobileInput}
            className={`glass-pill inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-colors ${
              mobileInputOpen
                ? "border-[var(--accent)]/40 text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile Input</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            transition={TAP_SPRING}
            type="button"
            tabIndex={controlTabIndex}
            onClick={onCopyReport}
            className="glass-pill inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copiedReport ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Report</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Expandable Mobile / Touch / Bluetooth Keyboard Bridge */}
      <AnimatePresence>
        {mobileInputOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="overflow-hidden"
          >
            <div className="glass-panel flex flex-col gap-2 rounded-[18px] p-3 sm:flex-row sm:items-center">
              <span className="shrink-0 text-xs font-medium text-[var(--text-secondary)]">
                Touch / Mobile Keyboard Bridge:
              </span>
              <input
                ref={mobileInputRef}
                data-mobile-bridge="true"
                type="text"
                value={mobileText}
                onChange={(e) => onMobileTextChange(e.target.value)}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                placeholder="Tap here on iPhone, iPad, or Android to open your on-screen or Bluetooth keyboard…"
                className="w-full rounded-xl border border-black/[0.08] bg-white/75 px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none dark:border-white/[0.1] dark:bg-black/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
