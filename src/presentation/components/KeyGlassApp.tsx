"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { useKeyboardTester } from "@/application/hooks/useKeyboardTester";
import { TopNavbar } from "./layout/TopNavbar";
import { KeyboardControls } from "./keyboard/KeyboardControls";
import { KeyboardDeck } from "./keyboard/KeyboardDeck";
import { DiagnosticsHud } from "./keyboard/DiagnosticsHud";
import { TouchpadMouseTester } from "./pointer/TouchpadMouseTester";
import { AdDialog } from "./overlays/AdDialog";

export function KeyGlassApp() {
  const {
    captureStageRef,
    mobileInputRef,
    layout,
    setLayout,
    os,
    setOs,
    darkMode,
    toggleDarkMode,
    soundEnabled,
    setSoundEnabled,
    testLock,
    toggleTestLock,
    fullscreenLocked,
    keyboardApiLocked,
    canFullscreenLock,
    canKeyboardLockApi,
    toggleFullscreenLock,
    isFocused,
    focusKeyboardStage,
    adOpen,
    handleCloseAd,
    mobileInputOpen,
    toggleMobileInput,
    mobileText,
    handleMobileInputChange,
    copiedReport,
    handleCopyReport,
    handleReset,
    resetSignal,
    activeKeys,
    testedKeys,
    chatterKeys,
    pressCounts,
    totalPresses,
    peakNkro,
    chatterLog,
    history,
    lastEvent,
    ledState,
    layoutKeyCodes,
    testedInLayoutCount,
    extraDetectedKeys,
    isComplete,
  } = useKeyboardTester();

  // Stable memoized callback prevents TopNavbar from re-rendering on keystrokes
  const handleToggleSound = useCallback(() => setSoundEnabled((s) => !s), [setSoundEnabled]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <AdDialog open={adOpen} onClose={handleCloseAd} />

        <TopNavbar
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          testLock={testLock}
          onToggleTestLock={toggleTestLock}
          fullscreenLocked={fullscreenLocked}
          keyboardApiLocked={keyboardApiLocked}
          canFullscreenLock={canFullscreenLock}
          canKeyboardLockApi={canKeyboardLockApi}
          onToggleFullscreenLock={toggleFullscreenLock}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onReset={handleReset}
        />

        <section
          id="tester"
          ref={captureStageRef}
          tabIndex={0}
          aria-label="Interactive Keyboard Capture Area"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-3 pt-4 pb-8 focus:outline-none sm:px-6 sm:pt-5"
        >
          {/* Minimal Apple Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-4 max-w-3xl text-center"
          >
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
              <motion.button
                type="button"
                tabIndex={testLock ? -1 : 0}
                aria-pressed={testLock}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (!isFocused) {
                    focusKeyboardStage();
                  } else {
                    toggleTestLock();
                  }
                }}
                className={`glass-pill inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                  isFocused && testLock
                    ? fullscreenLocked
                      ? "border-[var(--accent)]/40 text-[var(--accent)]"
                      : "border-emerald-500/35 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/40 text-amber-700 dark:text-amber-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isFocused && testLock
                      ? fullscreenLocked
                        ? "bg-[var(--accent)] shadow-[0_0_8px_rgba(0,113,227,0.85)]"
                        : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
                      : "bg-amber-500"
                  }`}
                />
                <span>
                  {!isFocused
                    ? "Window Unfocused — Click Anywhere to Resume Key Capture"
                    : testLock && fullscreenLocked && keyboardApiLocked
                      ? "Fullscreen Key Lock Active — Browser Shortcuts & F1–F12 Trapped (Click to Unlock)"
                      : testLock && fullscreenLocked
                        ? "Fullscreen Key Lock Active — Default Key Actions Blocked (Click to Turn Off)"
                        : testLock
                          ? "Key Lock On — Default Key Actions Blocked (Click to Turn Off)"
                          : "Key Lock Off — Normal Browser Keys Active (Click to Turn On)"}
                </span>
              </motion.button>

              <span className="glass-pill hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-medium text-[var(--text-secondary)] sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% Client-Side • Zero Keylogging</span>
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl">
              Online Keyboard Tester
            </h1>
            <p className="mx-auto mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
              Just start typing with <strong>Key Lock On</strong>, every physical key is captured
              automatically without triggering browser scrolling, Tab jumps, menus, or{" "}
              <code className="font-mono text-xs">F1–F12</code> shortcuts.
            </p>
          </motion.div>

          <KeyboardControls
            layout={layout}
            onSelectLayout={setLayout}
            os={os}
            onSelectOs={setOs}
            testLock={testLock}
            mobileInputOpen={mobileInputOpen}
            onToggleMobileInput={toggleMobileInput}
            mobileText={mobileText}
            onMobileTextChange={handleMobileInputChange}
            mobileInputRef={mobileInputRef}
            copiedReport={copiedReport}
            onCopyReport={handleCopyReport}
          />

          {/* 100% Complete Celebration Banner */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 480, damping: 30 }}
                className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-[18px] border border-emerald-500/35 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>
                    All {layoutKeyCodes.length} keys in this layout passed! Peak rollover:{" "}
                    <strong>{peakNkro}KRO</strong>.
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  tabIndex={testLock ? -1 : 0}
                  onClick={handleCopyReport}
                  className="cursor-pointer rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  {copiedReport ? "Report Copied!" : "Copy Verified Report"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sculpted Glassmorphic Interactive Keyboard UI (Physical Input Only) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <KeyboardDeck
              layout={layout}
              os={os}
              activeKeys={activeKeys}
              testedKeys={testedKeys}
              chatterKeys={chatterKeys}
              pressCounts={pressCounts}
              ledState={ledState}
            />
          </motion.div>

          {/* Live Telemetry & Diagnostics HUD */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3.5"
          >
            <DiagnosticsHud
              lastEvent={lastEvent}
              activeKeys={activeKeys}
              testedInLayoutCount={testedInLayoutCount}
              totalLayoutKeys={layoutKeyCodes.length}
              totalPresses={totalPresses}
              peakNkro={peakNkro}
              chatterLog={chatterLog}
              history={history}
              extraDetectedKeys={extraDetectedKeys}
            />
          </motion.div>
        </section>

        {/* Interactive 120fps Apple Glass Touchpad & Mouse Button Tester */}
        <TouchpadMouseTester soundEnabled={soundEnabled} resetSignal={resetSignal} />
      </div>
    </MotionConfig>
  );
}
