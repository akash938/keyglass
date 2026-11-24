"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";

interface AdDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AdDialog = memo(function AdDialog({ open, onClose }: AdDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="ad-dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ad-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[8px]"
        >
          <motion.div
            key="ad-dialog-window"
            initial={{ opacity: 0, scale: 0.9, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 14 }}
            transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-strong relative w-full max-w-[540px] overflow-hidden rounded-[28px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/30"
            />

            {/* macOS Standard Title Bar — Red Circle + Circular Border + Black X on the LEFT */}
            <div className="flex items-center justify-between border-b border-black/[0.07] bg-white/35 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  tabIndex={-1}
                  onClick={onClose}
                  aria-label="Close advertisement"
                  title="Close ad and start testing keyboard"
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 600, damping: 24 }}
                  className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#b91c1c] bg-[#ff3b30] text-black shadow-[0_2px_10px_rgba(255,59,48,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] transition-colors hover:bg-[#ff2d20] focus:outline-none"
                >
                  <X className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                </motion.button>
              </div>

              <span
                id="ad-dialog-title"
                className="text-[12.5px] font-semibold tracking-[-0.01em] text-[var(--text-secondary)]"
              >
                Sponsored Spotlight
              </span>

              <span className="rounded-full border border-black/[0.08] bg-black/[0.04] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase dark:border-white/[0.1] dark:bg-white/[0.06]">
                AD
              </span>
            </div>

            {/* Ad Creative Container */}
            <div className="p-5 sm:p-6">
              <div className="relative overflow-hidden rounded-[20px] border border-black/[0.07] bg-gradient-to-br from-[#007aff]/12 via-violet-500/10 to-emerald-400/12 p-6 dark:border-white/[0.09] dark:from-[#0a84ff]/18 dark:via-violet-500/14 dark:to-emerald-500/12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#007aff]/20 blur-2xl"
                />

                <div className="relative z-10 flex flex-col items-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/25 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)] shadow-xs backdrop-blur-md dark:bg-white/[0.08]">
                    <Sparkles className="h-3 w-3" />
                    Featured Partner Ad Slot
                  </span>

                  <h2 className="mt-3.5 text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)] sm:text-2xl">
                    Your Premium Advertisement Runs Here
                  </h2>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                    Drop in your Google AdSense unit, affiliate hardware banner, mechanical keyboard
                    sponsor, or custom promo creative. Automatically displays on every new visit
                    with Apple-grade glassmorphism.
                  </p>

                  <div className="mt-4 flex w-full items-center justify-between rounded-[14px] border border-dashed border-black/[0.14] bg-white/55 px-4 py-3.5 backdrop-blur-sm dark:border-white/[0.16] dark:bg-black/25">
                    <div>
                      <div className="text-[12px] font-semibold text-[var(--text-primary)]">
                        Responsive Ad Placement
                      </div>
                      <div className="font-mono text-[11px] text-[var(--text-tertiary)]">
                        Supports AdSense • Banner • Video • Custom HTML
                      </div>
                    </div>
                    <span className="rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-[10.5px] font-semibold text-[var(--accent)]">
                      LIVE SLOT
                    </span>
                  </div>

                  <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-2.5">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      href="#tester"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-4 py-2 text-[13px] font-medium text-white shadow-[0_6px_18px_rgba(0,113,227,0.35)] transition-colors hover:bg-[#0077ed]"
                    >
                      <span>Explore Offer</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.a>

                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={onClose}
                      className="cursor-pointer rounded-full px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-black/[0.05] hover:text-[var(--text-primary)] dark:hover:bg-white/[0.08]"
                    >
                      Skip to Keyboard Tester
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
