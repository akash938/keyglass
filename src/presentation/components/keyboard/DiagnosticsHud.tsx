"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ChatterIncident,
  KeyEventRecord,
  KeyHistoryItem,
} from "@/domain/entities/keyboard";
import { formatReadableKey, getLocationLabel } from "@/domain/services/key-normalizer";

interface DiagnosticsHudProps {
  lastEvent: KeyEventRecord | null;
  activeKeys: Set<string>;
  testedInLayoutCount: number;
  totalLayoutKeys: number;
  totalPresses: number;
  peakNkro: number;
  chatterLog: ChatterIncident[];
  history: KeyHistoryItem[];
  extraDetectedKeys: string[];
}

const POP_SPRING = {
  type: "spring" as const,
  stiffness: 580,
  damping: 28,
  mass: 0.55,
};

export const DiagnosticsHud = memo(function DiagnosticsHud({
  lastEvent,
  activeKeys,
  testedInLayoutCount,
  totalLayoutKeys,
  totalPresses,
  peakNkro,
  chatterLog,
  history,
  extraDetectedKeys,
}: DiagnosticsHudProps) {
  const coverageRatio =
    totalLayoutKeys > 0 ? Math.min(1, testedInLayoutCount / totalLayoutKeys) : 0;
  const coveragePct = Math.round(coverageRatio * 100);

  const activeList = Array.from(activeKeys);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Live Key Event Inspector */}
        <div className="glass-panel flex flex-col justify-between rounded-[22px] p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
              <Cpu className="h-3.5 w-3.5 text-[var(--accent)]" />
              Live Key Event
            </span>
            {lastEvent && (
              <motion.span
                key={lastEvent.id}
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={POP_SPRING}
                className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--accent)]"
              >
                #{lastEvent.keyCode || "—"}
              </motion.span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <motion.div
              key={lastEvent ? lastEvent.id : "idle"}
              initial={{ scale: 0.82, y: 4, opacity: 0.4 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={POP_SPRING}
              className={`flex h-12 min-w-[54px] items-center justify-center rounded-[14px] px-2.5 font-mono text-sm font-semibold will-change-transform ${
                lastEvent ? "keycap-active" : "keycap-base text-[var(--text-tertiary)]"
              }`}
            >
              {lastEvent ? formatReadableKey(lastEvent.code, lastEvent.key) : "—"}
            </motion.div>

            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[13px] font-semibold text-[var(--text-primary)]">
                {lastEvent ? lastEvent.code : "Press any key"}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-[var(--text-secondary)]">
                <span>
                  key:{" "}
                  <code className="font-mono text-[var(--text-primary)]">
                    {lastEvent ? (lastEvent.key === " " ? '" "' : lastEvent.key) : "—"}
                  </code>
                </span>
                {lastEvent && (
                  <span className="text-[var(--text-tertiary)]">
                    • {getLocationLabel(lastEvent.location)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {[
              { name: "Fn", on: lastEvent?.fnKey || lastEvent?.code === "Fn" },
              { name: "Shift", on: lastEvent?.shiftKey },
              { name: "Ctrl", on: lastEvent?.ctrlKey },
              { name: "Alt", on: lastEvent?.altKey },
              { name: "Meta", on: lastEvent?.metaKey },
            ].map((mod) => (
              <motion.span
                key={mod.name}
                animate={{ scale: mod.on ? 1.06 : 1 }}
                transition={POP_SPRING}
                className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium transition-colors ${
                  mod.on
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "bg-black/[0.045] text-[var(--text-tertiary)] dark:bg-white/[0.06]"
                }`}
              >
                {mod.name}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Card 2: Coverage Progress (GPU scaleX bar -> zero layout thrashing) */}
        <div className="glass-panel flex flex-col justify-between rounded-[22px] p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Test Coverage
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {coveragePct}%
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <motion.span
              key={testedInLayoutCount}
              initial={{ scale: 1.16 }}
              animate={{ scale: 1 }}
              transition={POP_SPRING}
              className="inline-block text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
            >
              {testedInLayoutCount}
            </motion.span>
            <span className="text-xs text-[var(--text-tertiary)]">
              / {totalLayoutKeys} keys verified
            </span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#007aff] via-[#34c759] to-[#10b981] will-change-transform"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: coverageRatio }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span>Total keystrokes</span>
            <span className="font-mono font-semibold text-[var(--text-primary)]">
              {totalPresses.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 3: N-Key Rollover */}
        <div className="glass-panel flex flex-col justify-between rounded-[22px] p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
              <Layers className="h-3.5 w-3.5 text-violet-500" />
              NKRO / Rollover
            </span>
            <motion.span
              key={peakNkro}
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={POP_SPRING}
              className="rounded-full bg-violet-500/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-violet-600 dark:text-violet-300"
            >
              Peak {peakNkro}KRO
            </motion.span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <motion.span
              key={activeList.length}
              initial={{ scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={POP_SPRING}
              className="inline-block text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
            >
              {activeList.length}
            </motion.span>
            <span className="text-xs text-[var(--text-tertiary)]">simultaneous keys held</span>
          </div>

          <div className="mt-2.5 flex min-h-[24px] flex-wrap items-center gap-1">
            {activeList.length === 0 ? (
              <span className="text-[11px] text-[var(--text-tertiary)]">
                Hold multiple keys to test ghosting
              </span>
            ) : (
              <AnimatePresence initial={false}>
                {activeList.slice(0, 6).map((code) => (
                  <motion.span
                    key={code}
                    initial={{ scale: 0.72, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.72, opacity: 0 }}
                    transition={POP_SPRING}
                    className="rounded-md bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white"
                  >
                    {code.replace("Key", "").replace("Digit", "")}
                  </motion.span>
                ))}
              </AnimatePresence>
            )}
            {activeList.length > 6 && (
              <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                +{activeList.length - 6}
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Switch Chatter & Latency */}
        <div className="glass-panel flex flex-col justify-between rounded-[22px] p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
              <Activity className="h-3.5 w-3.5 text-amber-500" />
              Switch Health
            </span>
            {chatterLog.length === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-2.5 w-2.5" /> Clean
              </span>
            ) : (
              <motion.span
                key={chatterLog.length}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={POP_SPRING}
                className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400"
              >
                <AlertTriangle className="h-2.5 w-2.5" /> {chatterLog.length} Chatter
              </motion.span>
            )}
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-black/[0.03] px-2.5 py-1.5 dark:bg-white/[0.04]">
              <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                <Clock className="h-2.5 w-2.5" /> Hold Time
              </div>
              <div className="mt-0.5 font-mono text-sm font-semibold text-[var(--text-primary)]">
                {lastEvent?.holdDurationMs != null ? `${lastEvent.holdDurationMs}ms` : "—"}
              </div>
            </div>
            <div className="rounded-xl bg-black/[0.03] px-2.5 py-1.5 dark:bg-white/[0.04]">
              <div className="text-[10px] text-[var(--text-tertiary)]">Key Interval</div>
              <div className="mt-0.5 font-mono text-sm font-semibold text-[var(--text-primary)]">
                {lastEvent?.intervalMs != null ? `${lastEvent.intervalMs}ms` : "—"}
              </div>
            </div>
          </div>

          <div className="mt-2 truncate text-[11px] text-[var(--text-secondary)]">
            {chatterLog.length === 0 ? (
              "Zero double-click chatter (<55ms)"
            ) : (
              <span className="text-red-600 dark:text-red-400">
                Latest: {chatterLog[0].label} ({chatterLog[0].deltaMs}ms bounce)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Keystroke History Ribbon (lightweight transform+opacity pop-in) */}
      <div className="glass-panel flex flex-col gap-2 rounded-[18px] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
          <span className="shrink-0 text-[11px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
            History
          </span>
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
            {history.length === 0 ? (
              <span className="text-xs text-[var(--text-tertiary)]">
                Start typing on your physical, laptop, Bluetooth, or mobile keyboard…
              </span>
            ) : (
              history.map((item) => (
                <motion.span
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.78, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={POP_SPRING}
                  className={`shrink-0 rounded-lg border px-2 py-0.5 font-mono text-[11px] font-medium will-change-transform ${
                    item.chatter
                      ? "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-300"
                      : "border-black/[0.07] bg-white/75 text-[var(--text-primary)] dark:border-white/[0.1] dark:bg-white/[0.08]"
                  }`}
                >
                  {item.label}
                </motion.span>
              ))
            )}
          </div>
        </div>

        {extraDetectedKeys.length > 0 && (
          <div className="flex shrink-0 items-center gap-1.5 border-t border-black/[0.06] pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3 dark:border-white/[0.08]">
            <span className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
              Extra Keys
            </span>
            <div className="flex flex-wrap gap-1">
              {extraDetectedKeys.slice(0, 4).map((code) => (
                <span
                  key={code}
                  className="rounded-md border border-emerald-500/35 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                >
                  {code}
                </span>
              ))}
              {extraDetectedKeys.length > 4 && (
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  +{extraDetectedKeys.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
