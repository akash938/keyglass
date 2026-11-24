"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Fingerprint,
  Gauge,
  Mouse,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { MOUSE_BUTTONS, MouseButtonId } from "@/domain/entities/pointer";
import { usePointerTester } from "@/application/hooks/usePointerTester";

interface TouchpadMouseTesterProps {
  soundEnabled: boolean;
  resetSignal: number;
}

const CLICK_SPRING = { type: "spring" as const, stiffness: 720, damping: 30, mass: 0.45 };

export const TouchpadMouseTester = memo(function TouchpadMouseTester({
  soundEnabled,
  resetSignal,
}: TouchpadMouseTesterProps) {
  const [padResetSpin, setPadResetSpin] = useState(0);
  const {
    stageRef,
    padRef,
    reticleX,
    reticleY,
    spotlightX,
    spotlightY,
    cursorInside,
    hudCoords,
    activeButtons,
    testedButtons,
    chatterButtons,
    buttonCounts,
    totalClicks,
    lastClickHoldMs,
    lastChatterInfo,
    padPressed,
    ripples,
    touchPoints,
    peakTouches,
    pollingHz,
    peakHz,
    scrollDir,
    scrollDelta,
    scrollCount,
    testedScrollDirs,
    verifiedCount,
    resetAll,
    handleStageMouseDown,
    handleStageMouseUp,
    handleStageMouseLeave,
    handlePadPointerMove,
    handlePadPointerLeave,
    updateTouchContacts,
    clearTouchContacts,
  } = usePointerTester(soundEnabled, resetSignal);

  const getBtnStateClass = (id: MouseButtonId) => {
    if (activeButtons.has(id)) return "keycap-active";
    if (chatterButtons.has(id)) return "keycap-chatter";
    if (testedButtons.has(id)) return "keycap-tested";
    return "keycap-base";
  };

  return (
    <section
      id="mouse-touchpad"
      aria-labelledby="mouse-touchpad-heading"
      className="mx-auto max-w-[1280px] scroll-mt-24 px-3 pt-2 pb-10 sm:px-6"
    >
      <motion.div
        ref={stageRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={handleStageMouseDown}
        onMouseUp={handleStageMouseUp}
        onAuxClick={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        onMouseLeave={handleStageMouseLeave}
        className="glass-panel relative overflow-hidden rounded-[28px] p-4 select-none sm:p-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/85 to-transparent dark:via-white/25"
        />

        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)]">
              <Mouse className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="mouse-touchpad-heading"
                className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[18px]"
              >
                Touchpad &amp; Mouse Button Tester
              </h2>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Click Left, Right, Middle, Side Back/Forward, scroll 2-finger gestures, or drag on
                the glass trackpad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.span
              key={verifiedCount}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={CLICK_SPRING}
              className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {verifiedCount}/{MOUSE_BUTTONS.length} Buttons
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={() => {
                setPadResetSpin((n) => n - 360);
                resetAll();
              }}
              className="glass-pill inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[11.5px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <motion.span
                animate={{ rotate: padResetSpin }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="inline-flex"
              >
                <RotateCcw className="h-3 w-3" />
              </motion.span>
              <span>Reset Pad</span>
            </motion.button>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left: 120fps GPU Apple Glass Trackpad */}
          <div className="flex flex-col gap-3 lg:col-span-7">
            <motion.div
              ref={padRef}
              animate={{ scale: padPressed ? 0.992 : 1 }}
              transition={CLICK_SPRING}
              onPointerMove={handlePadPointerMove}
              onPointerLeave={handlePadPointerLeave}
              onTouchStart={updateTouchContacts}
              onTouchMove={updateTouchContacts}
              onTouchEnd={updateTouchContacts}
              onTouchCancel={clearTouchContacts}
              className="keyboard-deck relative h-[260px] w-full cursor-crosshair overflow-hidden rounded-[22px] sm:h-[290px]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(120,130,150,0.45) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* GPU-composited Radial Cursor Spotlight (MotionValue -> zero React re-renders) */}
              <motion.div
                aria-hidden="true"
                style={{ x: spotlightX, y: spotlightY }}
                animate={{ opacity: cursorInside ? 1 : 0 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-none absolute top-0 left-0 -mt-20 -ml-20 h-40 w-40 rounded-full will-change-transform"
              >
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0, 122, 255, 0.16) 0%, transparent 70%)",
                  }}
                />
              </motion.div>

              {/* GPU-composited 120fps Spring Reticle */}
              <motion.div
                aria-hidden="true"
                style={{ x: reticleX, y: reticleY }}
                animate={{
                  opacity: cursorInside ? 1 : 0,
                  scale: padPressed ? 0.8 : 1,
                }}
                transition={{
                  opacity: { duration: 0.14 },
                  scale: CLICK_SPRING,
                }}
                className="pointer-events-none absolute top-0 left-0 -mt-3 -ml-3 will-change-transform"
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${
                    padPressed
                      ? "border-[#007aff] bg-[#007aff]/25"
                      : "border-[#007aff]/75 bg-white/80 dark:bg-white/15"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
                </div>
              </motion.div>

              {/* Multi-Touch Contact Rings */}
              {touchPoints.map((tp, idx) => (
                <motion.div
                  key={tp.id}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={CLICK_SPRING}
                  className="pointer-events-none absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-400/20 font-mono text-xs font-bold text-emerald-700 shadow-[0_0_16px_rgba(16,185,129,0.45)] dark:text-emerald-200"
                  style={{ left: `${tp.x}%`, top: `${tp.y}%` }}
                >
                  {idx + 1}
                </motion.div>
              ))}

              {/* Click Ripples */}
              <AnimatePresence>
                {ripples.map((r) => (
                  <motion.span
                    key={r.id}
                    initial={{ scale: 0.25, opacity: 0.8 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.44, ease: "easeOut" }}
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                    className={`pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 will-change-transform ${
                      r.button === 2
                        ? "border-violet-500 bg-violet-500/18"
                        : r.button === 1
                          ? "border-emerald-500 bg-emerald-500/18"
                          : "border-[#007aff] bg-[#007aff]/18"
                    }`}
                  />
                ))}
              </AnimatePresence>

              <div className="pointer-events-none absolute top-3 left-3.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/80 px-2.5 py-1 text-[10.5px] font-semibold text-[var(--text-secondary)] dark:border-white/[0.1] dark:bg-black/45">
                  <Fingerprint className="h-3 w-3 text-[var(--accent)]" />
                  Apple Glass Touchpad
                </span>
              </div>

              <div className="pointer-events-none absolute top-3 right-3.5 flex items-center gap-1.5">
                <span className="rounded-full border border-black/[0.06] bg-white/80 px-2.5 py-1 font-mono text-[10.5px] font-medium text-[var(--text-secondary)] dark:border-white/[0.1] dark:bg-black/45">
                  X:{hudCoords.x}% Y:{hudCoords.y}%
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/80 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-[var(--accent)] dark:border-white/[0.1] dark:bg-black/45">
                  <Gauge className="h-3 w-3" />
                  {pollingHz > 0 ? `${pollingHz} Hz` : "— Hz"}
                </span>
              </div>

              {!cursorInside && touchPoints.length === 0 && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">
                    Move, Click, Right-Click, Scroll or Pinch Here
                  </span>
                  <span className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                    Tests single/two-finger gestures, scroll wheel &amp; touch tracking
                  </span>
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "up", icon: ArrowUp, label: "Up" },
                    { id: "down", icon: ArrowDown, label: "Down" },
                    { id: "left", icon: ArrowLeft, label: "Left" },
                    { id: "right", icon: ArrowRight, label: "Right" },
                  ].map((g) => {
                    const Icon = g.icon;
                    const active = scrollDir === g.id;
                    const tested = testedScrollDirs.has(g.id);
                    return (
                      <motion.span
                        key={g.id}
                        animate={{ scale: active ? 1.08 : 1 }}
                        transition={CLICK_SPRING}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[10px] font-medium transition-colors ${
                          active
                            ? "border-[#007aff] bg-[#007aff] text-white shadow-[0_0_10px_rgba(0,122,255,0.45)]"
                            : tested
                              ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "border-black/[0.06] bg-white/80 text-[var(--text-tertiary)] dark:border-white/[0.08] dark:bg-black/40"
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="hidden sm:inline">{g.label}</span>
                      </motion.span>
                    );
                  })}
                  <motion.span
                    animate={{ scale: scrollDir === "pinch" ? 1.08 : 1 }}
                    transition={CLICK_SPRING}
                    className={`rounded-lg border px-2 py-1 font-mono text-[10px] font-medium transition-colors ${
                      scrollDir === "pinch"
                        ? "border-violet-500 bg-violet-500 text-white"
                        : testedScrollDirs.has("pinch")
                          ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "border-black/[0.06] bg-white/80 text-[var(--text-tertiary)] dark:border-white/[0.08] dark:bg-black/40"
                    }`}
                  >
                    Pinch
                  </motion.span>
                </div>

                <span className="rounded-lg border border-black/[0.06] bg-white/80 px-2 py-1 font-mono text-[10px] text-[var(--text-secondary)] dark:border-white/[0.08] dark:bg-black/40">
                  ΔX:{scrollDelta.x} ΔY:{scrollDelta.y}
                </span>
              </div>
            </motion.div>

            {/* Telemetry Row */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-[16px] border border-black/[0.06] bg-white/65 px-3 py-2 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <div className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                  Total Clicks
                </div>
                <motion.div
                  key={totalClicks}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={CLICK_SPRING}
                  className="mt-0.5 inline-block font-mono text-base font-semibold text-[var(--text-primary)]"
                >
                  {totalClicks}
                </motion.div>
              </div>
              <div className="rounded-[16px] border border-black/[0.06] bg-white/65 px-3 py-2 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <div className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                  Click Hold
                </div>
                <div className="mt-0.5 font-mono text-base font-semibold text-[var(--text-primary)]">
                  {lastClickHoldMs !== null ? `${lastClickHoldMs}ms` : "—"}
                </div>
              </div>
              <div className="rounded-[16px] border border-black/[0.06] bg-white/65 px-3 py-2 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <div className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                  Scroll Events
                </div>
                <motion.div
                  key={scrollCount}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={CLICK_SPRING}
                  className="mt-0.5 inline-block font-mono text-base font-semibold text-[var(--text-primary)]"
                >
                  {scrollCount}
                </motion.div>
              </div>
              <div className="rounded-[16px] border border-black/[0.06] bg-white/65 px-3 py-2 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <div className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                  Peak Rate / Touch
                </div>
                <div className="mt-0.5 font-mono text-base font-semibold text-[var(--text-primary)]">
                  {peakTouches > 0 ? `${peakTouches} Finger` : peakHz > 0 ? `${peakHz}Hz` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sculpted Mouse Silhouette */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-5">
            <div className="keyboard-deck flex flex-1 flex-col items-center justify-center rounded-[22px] p-4 sm:p-5">
              <div className="relative flex items-center justify-center gap-2.5">
                {/* Side Thumb Buttons */}
                <div className="flex flex-col gap-2">
                  <motion.div
                    animate={{
                      x: activeButtons.has(4) ? 2 : 0,
                      scale: activeButtons.has(4) ? 0.94 : 1,
                    }}
                    transition={CLICK_SPRING}
                    className={`flex h-12 w-9 flex-col items-center justify-center rounded-l-[12px] rounded-r-[6px] font-mono text-[9.5px] font-semibold transition-colors ${getBtnStateClass(4)}`}
                    title="Side Forward Button (Mouse 5)"
                  >
                    <span>M5</span>
                    <span className="text-[8px] opacity-70">{buttonCounts[4] || 0}</span>
                  </motion.div>
                  <motion.div
                    animate={{
                      x: activeButtons.has(3) ? 2 : 0,
                      scale: activeButtons.has(3) ? 0.94 : 1,
                    }}
                    transition={CLICK_SPRING}
                    className={`flex h-12 w-9 flex-col items-center justify-center rounded-l-[12px] rounded-r-[6px] font-mono text-[9.5px] font-semibold transition-colors ${getBtnStateClass(3)}`}
                    title="Side Back Button (Mouse 4)"
                  >
                    <span>M4</span>
                    <span className="text-[8px] opacity-70">{buttonCounts[3] || 0}</span>
                  </motion.div>
                </div>

                {/* Main Mouse Shell */}
                <div className="relative flex h-[228px] w-[156px] flex-col overflow-hidden rounded-[66px] border border-black/[0.1] bg-white/85 p-2 shadow-[0_14px_34px_-10px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] dark:border-white/[0.12] dark:bg-white/[0.05] dark:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.65)]">
                  <div className="relative grid h-[108px] grid-cols-2 gap-1.5">
                    <motion.div
                      animate={{
                        y: activeButtons.has(0) ? 2 : 0,
                        scale: activeButtons.has(0) ? 0.955 : 1,
                      }}
                      transition={CLICK_SPRING}
                      className={`flex flex-col items-center justify-center rounded-tl-[56px] rounded-tr-[10px] rounded-bl-[14px] rounded-br-[10px] transition-colors ${getBtnStateClass(0)}`}
                    >
                      <span className="text-[11px] font-semibold">Left</span>
                      <span className="mt-0.5 font-mono text-[10px] opacity-75">
                        {buttonCounts[0] || 0}
                      </span>
                    </motion.div>

                    <motion.div
                      animate={{
                        y: activeButtons.has(2) ? 2 : 0,
                        scale: activeButtons.has(2) ? 0.955 : 1,
                      }}
                      transition={CLICK_SPRING}
                      className={`flex flex-col items-center justify-center rounded-tl-[10px] rounded-tr-[56px] rounded-bl-[10px] rounded-br-[14px] transition-colors ${getBtnStateClass(2)}`}
                    >
                      <span className="text-[11px] font-semibold">Right</span>
                      <span className="mt-0.5 font-mono text-[10px] opacity-75">
                        {buttonCounts[2] || 0}
                      </span>
                    </motion.div>

                    <motion.div
                      animate={{
                        y:
                          scrollDir === "up"
                            ? -3
                            : scrollDir === "down"
                              ? 3
                              : activeButtons.has(1)
                                ? 2
                                : 0,
                        scale: activeButtons.has(1) ? 0.92 : 1,
                      }}
                      transition={CLICK_SPRING}
                      className={`absolute top-1/2 left-1/2 flex h-[50px] w-[26px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border shadow-md transition-colors ${
                        scrollDir === "up" || scrollDir === "down"
                          ? "keycap-active"
                          : getBtnStateClass(1)
                      }`}
                      title="Middle Click & Scroll Wheel"
                    >
                      <span className="h-2.5 w-[2px] rounded-full bg-current opacity-55" />
                      <span className="mt-0.5 font-mono text-[8px] font-bold">
                        {buttonCounts[1] || 0}
                      </span>
                    </motion.div>
                  </div>

                  <div className="mt-2 flex flex-1 flex-col items-center justify-center rounded-b-[54px] border border-black/[0.04] bg-black/[0.02] dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <span className="font-mono text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
                      KeyGlass
                    </span>
                    <span className="mt-1 text-[10px] text-[var(--text-tertiary)]">
                      {activeButtons.size > 0 ? `${activeButtons.size} Held` : "Click Anywhere"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex w-full items-center justify-between rounded-[14px] border border-black/[0.06] bg-white/70 px-3 py-2 text-[11.5px] dark:border-white/[0.08] dark:bg-white/[0.03]">
                <span className="font-medium text-[var(--text-secondary)]">Mouse Switch Health</span>
                {chatterButtons.size === 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" /> Clean (&gt;80ms)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3" /> {lastChatterInfo || "Double-Click Chatter"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {MOUSE_BUTTONS.map((btn) => {
                const active = activeButtons.has(btn.id);
                const tested = testedButtons.has(btn.id);
                const chatter = chatterButtons.has(btn.id);
                return (
                  <motion.div
                    key={btn.id}
                    animate={{ scale: active ? 0.94 : 1, y: active ? 1.5 : 0 }}
                    transition={CLICK_SPRING}
                    className={`flex flex-col items-center justify-center rounded-[12px] py-2 text-center transition-colors ${
                      active
                        ? "keycap-active"
                        : chatter
                          ? "keycap-chatter"
                          : tested
                            ? "keycap-tested"
                            : "keycap-base"
                    }`}
                  >
                    <span className="font-mono text-[10.5px] font-semibold">{btn.short}</span>
                    <span className="mt-0.5 font-mono text-[9.5px] opacity-75">
                      {buttonCounts[btn.id] || 0}×
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});
