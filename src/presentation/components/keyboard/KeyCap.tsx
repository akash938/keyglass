"use client";

import React, { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyDef, OsMode } from "@/domain/entities/keyboard";
import { getDisplayLabel } from "@/domain/layouts/keyboard-layouts";

interface KeyCapProps {
  keyDef: KeyDef;
  os: OsMode;
  isActive: boolean;
  isTested: boolean;
  hasChatter: boolean;
  pressCount: number;
  isCapsLedOn?: boolean;
  flexGrow?: number;
  gridColStart?: number;
  gridColSpan?: number;
  gridRowStart?: number;
  gridRowSpan?: number;
  className?: string;
}

const KEY_SPRING = {
  type: "spring" as const,
  stiffness: 780,
  damping: 32,
  mass: 0.45,
};

/**
 * Pure physical-keyboard visual keycap — strictly non-clickable via mouse/pointer.
 * Accepts ONLY primitive layout props so React.memo prevents re-rendering untouched keys (100x faster).
 */
export const KeyCap = memo(function KeyCap({
  keyDef,
  os,
  isActive,
  isTested,
  hasChatter,
  pressCount,
  isCapsLedOn,
  flexGrow,
  gridColStart,
  gridColSpan,
  gridRowStart,
  gridRowSpan,
  className = "",
}: KeyCapProps) {
  const layoutStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (gridColStart !== undefined && gridRowStart !== undefined) {
      return {
        gridColumn: `${gridColStart} / span ${gridColSpan ?? 1}`,
        gridRow: `${gridRowStart} / span ${gridRowSpan ?? 1}`,
      };
    }
    if (flexGrow !== undefined) {
      return { flexGrow, flexBasis: 0 };
    }
    return undefined;
  }, [flexGrow, gridColStart, gridColSpan, gridRowStart, gridRowSpan]);

  if (keyDef.isSpacer) {
    return <div aria-hidden="true" className={className} style={layoutStyle} />;
  }

  const { main, sub, icon } = getDisplayLabel(keyDef, os);

  const stateClass = isActive
    ? "keycap-active"
    : hasChatter
      ? "keycap-chatter"
      : isTested
        ? "keycap-tested"
        : "keycap-base";

  const alignClass =
    keyDef.align === "left"
      ? "items-start justify-end pl-2 pb-1.5"
      : keyDef.align === "right"
        ? "items-end justify-end pr-2 pb-1.5"
        : "items-center justify-center";

  const isSpace = keyDef.code === "Space";

  return (
    <motion.div
      role="presentation"
      aria-label={`Key ${main || keyDef.code}${isTested ? " tested" : ""}${hasChatter ? " chatter detected" : ""}`}
      data-code={keyDef.code}
      animate={{
        y: isActive ? 2.5 : 0,
        scale: isActive ? 0.945 : 1,
      }}
      transition={KEY_SPRING}
      style={layoutStyle}
      className={`pointer-events-none relative flex cursor-default select-none flex-col overflow-hidden rounded-[9px] transition-colors duration-120 will-change-transform ${stateClass} ${alignClass} ${className}`}
    >
      {/* Active Press GPU Specular Ripple (transform + opacity only, zero blur cost) */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key="ripple"
            initial={{ opacity: 0.6, scale: 0.3 }}
            animate={{ opacity: 0, scale: 1.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 m-auto h-8 w-8 rounded-full bg-white/40"
          />
        )}
      </AnimatePresence>

      {/* Top Glass Gloss Highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 top-[1px] h-[1px] rounded-full bg-white/55 opacity-60 dark:opacity-25"
      />

      {/* Caps Lock Indicator LED */}
      {keyDef.code === "CapsLock" && (
        <span
          aria-hidden="true"
          className={`absolute top-1.5 left-2 h-1.5 w-1.5 rounded-full transition-colors duration-150 ${
            isCapsLedOn
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.95)]"
              : "bg-slate-400/35 dark:bg-white/15"
          }`}
        />
      )}

      {/* Tested / Chatter Micro-Indicator */}
      {!isActive && (hasChatter || isTested) && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 620, damping: 24 }}
          aria-hidden="true"
          className={`pointer-events-none absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full ${
            hasChatter
              ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
              : "bg-emerald-500/85 dark:bg-emerald-400/90"
          }`}
        />
      )}

      {/* Secondary character */}
      {sub && (
        <span
          className={`pointer-events-none absolute top-1 left-1.5 text-[9px] leading-none font-medium tracking-tight ${
            isActive ? "text-white/75" : "text-[var(--text-tertiary)]"
          }`}
        >
          {sub}
        </span>
      )}

      {/* macOS Icon */}
      {os === "mac" && icon && (
        <span
          className={`pointer-events-none absolute top-1 ${
            keyDef.align === "left" ? "left-2" : "right-2"
          } text-[10px] leading-none font-medium ${
            isActive ? "text-white/90" : "text-[var(--text-secondary)]"
          }`}
        >
          {icon}
        </span>
      )}

      {/* Primary Key Label */}
      {isSpace ? (
        <span
          className={`pointer-events-none h-[2.5px] w-10 rounded-full transition-colors ${
            isActive
              ? "bg-white/75"
              : isTested
                ? "bg-emerald-500/45"
                : "bg-slate-400/30 dark:bg-white/15"
          }`}
        />
      ) : (
        <span
          className={`pointer-events-none leading-none font-medium tracking-[-0.01em] ${
            keyDef.compactText
              ? "text-[10px] sm:text-[10.5px]"
              : main.length > 1
                ? "text-[11px]"
                : "text-[12.5px] sm:text-[13px]"
          } ${sub ? "mt-1.5" : ""} ${os === "mac" && icon ? "mt-2" : ""}`}
        >
          {main}
        </span>
      )}

      {/* Multi-press counter badge */}
      {pressCount > 1 && !isActive && (
        <span className="pointer-events-none absolute right-1 bottom-0.5 font-mono text-[8px] leading-none opacity-65">
          {pressCount > 99 ? "99+" : pressCount}
        </span>
      )}
    </motion.div>
  );
});
