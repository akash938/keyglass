"use client";

import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Cpu,
  Laptop,
  Lock,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { DEVICE_SUPPORT_CARDS, FAQ_ITEMS } from "@/infrastructure/seo/seo-metadata";

const CARD_ICONS = [Laptop, Zap, Cpu, Smartphone];

const HOW_TO_STEPS = [
  {
    step: "01",
    title: "Select Your Layout & OS",
    desc: "Switch between 100% Full Size, 80% TKL, 75% MacBook/Laptop, or 60% Compact with native macOS or Windows legends.",
  },
  {
    step: "02",
    title: "Press Every Physical Key",
    desc: "Press switches directly on your keyboard. Active switches glow Apple Blue, verified switches lock Emerald Green, and press counts increment live.",
  },
  {
    step: "03",
    title: "Test NKRO, Chatter & Mouse",
    desc: "Hold multiple keys simultaneously to check anti-ghosting rollover, detect switch chatter below 55ms, and verify trackpad & mouse buttons below.",
  },
  {
    step: "04",
    title: "Inspect & Export Report",
    desc: "Verify exact event.code, event.key, hold latency, and modifier LEDs, then copy a clean diagnostic summary with one click.",
  },
];

export const SeoContentSection = memo(function SeoContentSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[1280px] space-y-16 px-3 pt-8 pb-20 sm:px-6 sm:space-y-24">
      <section id="devices" aria-labelledby="devices-heading" className="scroll-mt-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider text-[var(--accent)] uppercase">
            <Sparkles className="h-3 w-3" /> Universal Compatibility
          </span>
          <h2
            id="devices-heading"
            className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl"
          >
            Built for Every Keyboard &amp; Every Device
          </h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Whether you are diagnosing a MacBook scissor switch, tuning a custom hot-swap mechanical
            board, or checking a mouse, trackpad, or Bluetooth keyboard, KeyGlass adapts instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEVICE_SUPPORT_CARDS.map((card, idx) => {
            const Icon = CARD_ICONS[idx % CARD_ICONS.length];
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                className="glass-panel flex flex-col justify-between rounded-[24px] p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-black/[0.045] px-2.5 py-0.5 text-[10.5px] font-semibold text-[var(--text-secondary)] dark:bg-white/[0.07]">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                    {card.description}
                  </p>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-black/[0.06] pt-3.5 dark:border-white/[0.07]">
                  {card.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[12px] font-medium text-[var(--text-secondary)]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="how-to-test" aria-labelledby="howto-heading" className="scroll-mt-24">
        <div className="glass-panel rounded-[30px] p-6 sm:p-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold tracking-wider text-[var(--accent)] uppercase">
              Diagnostic Workflow
            </span>
            <h2
              id="howto-heading"
              className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl"
            >
              How to Test Your Keyboard for Dead Keys, Ghosting &amp; Chatter
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
              Follow these four precision checks before buying a used laptop, building a custom
              mechanical keyboard, or troubleshooting unresponsive keys and mouse clicks.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_STEPS.map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-[20px] border border-black/[0.06] bg-white/55 p-5 dark:border-white/[0.08] dark:bg-white/[0.03]"
              >
                <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                  STEP {s.step}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-4xl scroll-mt-24">
        <div className="mb-8 text-center">
          <span className="text-[11px] font-semibold tracking-wider text-[var(--accent)] uppercase">
            Frequently Asked Questions
          </span>
          <h2
            id="faq-heading"
            className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl"
          >
            Keyboard Testing Questions, Answered
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.question}
                className="glass-panel overflow-hidden rounded-[20px] transition-shadow"
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none sm:px-6"
                >
                  <h3 className="text-[14.5px] font-semibold tracking-[-0.015em] text-[var(--text-primary)] sm:text-[15.5px]">
                    {item.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/[0.045] text-[var(--text-secondary)] dark:bg-white/[0.08]"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={!isOpen}
                  className="overflow-hidden"
                >
                  <p className="border-t border-black/[0.05] px-5 pt-3.5 pb-5 text-[14px] leading-relaxed text-[var(--text-secondary)] sm:px-6 dark:border-white/[0.06]">
                    {item.answer}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="glass-panel rounded-[26px] px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-emerald-500" />
            <p className="text-[13px] text-[var(--text-secondary)]">
              <strong className="font-semibold text-[var(--text-primary)]">
                KeyGlass Privacy Guarantee:
              </strong>{" "}
              All keyboard, touchpad, and mouse diagnostics run locally in your browser with zero
              tracking or server uploads.
            </p>
          </div>
          <p className="shrink-0 font-mono text-[11.5px] text-[var(--text-tertiary)]">
            KeyGlass • Universal Online Keyboard Tester
          </p>
        </div>
      </footer>
    </div>
  );
});
