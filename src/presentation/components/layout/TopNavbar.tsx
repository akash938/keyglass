"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard,
  Lock,
  Moon,
  RotateCcw,
  Sun,
  Unlock,
  Volume2,
  VolumeX,
} from "lucide-react";

interface TopNavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  testLock: boolean;
  onToggleTestLock: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onReset: () => void;
}

const BTN_SPRING = { type: "spring" as const, stiffness: 560, damping: 28 };
const ICON_SWAP = { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const };

export const TopNavbar = memo(function TopNavbar({
  soundEnabled,
  onToggleSound,
  testLock,
  onToggleTestLock,
  darkMode,
  onToggleDarkMode,
  onReset,
}: TopNavbarProps) {
  const [resetRotation, setResetRotation] = useState(0);

  return (
    <header className="sticky top-0 z-40 px-3 pt-2.5 sm:px-6">
      <nav
        aria-label="Primary Navigation"
        className="glass-panel-strong mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-full px-3.5 py-2 sm:px-5"
      >
        <a href="#tester" tabIndex={-1} className="flex items-center gap-2.5 focus:outline-none">
          <motion.div
            whileHover={{ scale: 1.07, rotate: -4 }}
            whileTap={{ scale: 0.92 }}
            transition={BTN_SPRING}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#1e8eff] to-[#0062d6] text-white shadow-[0_4px_12px_rgba(0,113,227,0.4)]"
          >
            <Keyboard className="h-4 w-4" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[14px] leading-none font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              KeyGlass
            </span>
            <span className="mt-0.5 hidden text-[10px] leading-none font-medium text-[var(--text-tertiary)] sm:inline">
              Universal Keyboard Tester
            </span>
          </div>
        </a>

        <div className="hidden items-center gap-6 text-[13px] font-medium text-[var(--text-secondary)] lg:flex">
          {[
            { href: "#tester", label: "Keyboard" },
            { href: "#mouse-touchpad", label: "Mouse & Pad" },
            { href: "#devices", label: "Devices" },
            { href: "#how-to-test", label: "Guide" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              tabIndex={-1}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_SPRING}
              className="transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle with Animated Icon Morph */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            transition={BTN_SPRING}
            type="button"
            tabIndex={-1}
            onClick={onToggleSound}
            title={soundEnabled ? "Mute tactile sound" : "Enable tactile sound"}
            aria-label={soundEnabled ? "Mute key sound" : "Enable key sound"}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors ${
              soundEnabled
                ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-transparent bg-black/[0.04] text-[var(--text-secondary)] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={soundEnabled ? "on" : "off"}
                initial={{ scale: 0.65, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.65, opacity: 0 }}
                transition={ICON_SWAP}
                className="inline-flex"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Key Capture Lock Toggle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.93 }}
            transition={BTN_SPRING}
            type="button"
            tabIndex={-1}
            aria-pressed={testLock}
            onClick={onToggleTestLock}
            title={
              testLock
                ? "Key Lock ON: Blocks browser scrolling, Tab focus jump, F1–F12 & shortcuts"
                : "Key Lock OFF: Normal browser shortcuts & scrolling allowed"
            }
            className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-medium transition-colors ${
              testLock
                ? "border-emerald-500/40 bg-emerald-500/14 text-emerald-700 shadow-[0_2px_10px_rgba(16,185,129,0.16)] dark:text-emerald-300"
                : "border-black/[0.08] bg-black/[0.04] text-[var(--text-secondary)] hover:bg-black/[0.08] dark:border-white/[0.1] dark:bg-white/[0.06]"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={testLock ? "locked" : "unlocked"}
                initial={{ scale: 0.7, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: 14, opacity: 0 }}
                transition={ICON_SWAP}
                className="inline-flex"
              >
                {testLock ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </motion.span>
            </AnimatePresence>
            <span>{testLock ? "Key Lock On" : "Key Lock Off"}</span>
          </motion.button>

          {/* Theme Toggle with Smooth Rotating Sun <-> Moon */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            transition={BTN_SPRING}
            type="button"
            tabIndex={-1}
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Apple Light Frost" : "Switch to Apple Dark Glass"}
            aria-label="Toggle color theme"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/[0.04] text-[var(--text-secondary)] transition-colors hover:bg-black/[0.08] hover:text-[var(--text-primary)] dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={darkMode ? "sun" : "moon"}
                initial={{ rotate: -65, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 65, scale: 0.6, opacity: 0 }}
                transition={ICON_SWAP}
                className="inline-flex"
              >
                {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Reset Button with Smooth 360° Spring Spin */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            transition={BTN_SPRING}
            type="button"
            tabIndex={-1}
            onClick={() => {
              setResetRotation((r) => r - 360);
              onReset();
            }}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-3 text-[12px] font-medium text-[var(--bg-canvas)] shadow-xs transition-opacity hover:opacity-90"
          >
            <motion.span
              animate={{ rotate: resetRotation }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="inline-flex"
            >
              <RotateCcw className="h-3 w-3" />
            </motion.span>
            <span>Reset</span>
          </motion.button>
        </div>
      </nav>
    </header>
  );
});
