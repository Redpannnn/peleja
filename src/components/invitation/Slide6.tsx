"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Gem } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

const MAROON = "#740404";
const GOLD = "#8c6d2f";
const INK = "#3a3424";

/**
 * Our Story — section baru (revisi user). Section lama (gift, rsvp, penutup)
 * bergeser satu ke bawah: gift jadi section 7, rsvp section 8, penutup 9.
 *
 * Cerita (dari user): berawal dari Juni 2023 — pertemuan tanpa sengaja,
 * tukeran nomor WA dari perjodohan teman — dan berakhir 3 Juli pacaran,
 * lalu kami tunangan.
 */
const STORY = [
  {
    icon: MessageCircle,
    when: "Juni 2023",
    title: "Pertemuan Tanpa Sengaja",
    desc: "Berawal dari pertemuan tanpa sengaja — tukeran nomor WA dari perjodohan teman.",
  },
  {
    icon: Heart,
    when: "3 Juli",
    title: "Mulai Pacaran",
    desc: "Berakhir jadian — kami mulai menjalani hubungan bersama.",
  },
  {
    icon: Gem,
    when: "Kini",
    title: "Tunangan",
    desc: "Dan sekarang, kami bertunangan melangkah menuju hari bahagia.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide6() {
  const goTo = useInvitation((s) => s.goTo);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax) */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar our story"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        loading="eager"
      />
      {/* Bg solid overlay #4B352A (80% opacity) — revisi user */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[#4B352A]/80"
      />
      {/* Back button */}
      <button
        type="button"
        onClick={() => goTo("cover")}
        aria-label="Kembali ke cover"
        className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
      >
        <svg className="size-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-[26rem] flex-col items-center px-6 py-20"
      >
        <motion.h2
          variants={item}
          className="font-wedding text-[2.6rem] leading-none text-white sm:text-[3.2rem]"
        >
          Our Story
        </motion.h2>

        <span
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Timeline cerita */}
        <div className="relative flex w-full flex-col gap-5">
          {/* garis vertikal penghubung */}
          <span
            aria-hidden
            className="absolute left-[1.4rem] top-6 bottom-6 w-px bg-gradient-to-b from-white/50 via-white/30 to-white/50"
          />

          {STORY.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} variants={item} className="relative flex items-start gap-4">
                {/* bulatan ikon di atas garis */}
                <div
                  className="relative z-[2] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4f4ec] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]"
                  style={{ color: MAROON }}
                >
                  <Icon className="size-5" />
                </div>

                {/* kartu capsule isi cerita */}
                <div className="flex-1 rounded-[1.6rem] bg-[#f4f4ec] px-5 py-4 text-left shadow-[0_14px_34px_-14px_rgba(0,0,0,0.5)]">
                  <p
                    className="font-latin text-[0.6rem] font-medium uppercase tracking-[0.22em]"
                    style={{ color: GOLD }}
                  >
                    {s.when}
                  </p>
                  <p
                    className="font-wedding mt-0.5 text-[1.55rem] leading-tight"
                    style={{ color: MAROON }}
                  >
                    {s.title}
                  </p>
                  <p
                    className="font-script mt-1 text-[0.82rem] leading-relaxed"
                    style={{ color: INK }}
                  >
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
