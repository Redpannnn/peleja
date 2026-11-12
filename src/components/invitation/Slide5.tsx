"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// 5 foto Our Moment (revisi user) — preview besar + preview kecil.
// Klik preview kecil → fotonya tampil di preview besar.
const MOMENTS = [
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb8d7dmvk2g9xg/file",
    alt: "Momen 1",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb8ashjtaehyzw/file",
    alt: "Momen 2",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb88at0dzea3y0/file",
    alt: "Momen 3",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb85hpv14akk91/file",
    alt: "Momen 4",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb82qqqrqizphy/file",
    alt: "Momen 5",
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
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide5() {
  const goTo = useInvitation((s) => s.goTo);
  // index foto yang sedang tampil di preview besar (default: foto pertama)
  const [active, setActive] = useState(0);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax) */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar our moment"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        loading="eager"
      />
      {/* Overlay dihapus per revisi user — wallpaper tampil polos */}
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
          className="font-wedding text-[2.6rem] leading-none text-white drop-shadow-[0_2px_10px_rgba(60,40,20,0.55)] sm:text-[3.2rem]"
        >
          Our Moment
        </motion.h2>

        <span
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Preview besar — foto aktif dengan crossfade antar ganti */}
        <motion.div
          variants={item}
          className="relative h-[420px] w-full overflow-hidden rounded-[2.4rem] shadow-[0_18px_45px_-14px_rgba(0,0,0,0.55)] ring-1 ring-white/50 sm:h-[460px]"
        >
          <AnimatePresence mode="sync">
            <motion.img
              key={active}
              src={MOMENTS[active].src}
              alt={MOMENTS[active].alt}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full select-none object-cover"
              loading="eager"
              decoding="async"
            />
          </AnimatePresence>
        </motion.div>

        {/* Preview kecil — 5 thumbnail, klik untuk tampil di preview besar */}
        <motion.div
          variants={item}
          role="group"
          aria-label="Pilih foto untuk preview besar"
          className="mt-4 grid w-full grid-cols-5 gap-2.5"
        >
          {MOMENTS.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Tampilkan ${m.alt} di preview besar`}
              aria-pressed={i === active}
              className={`group relative aspect-[3/4] overflow-hidden rounded-xl transition-all duration-300 ${
                i === active
                  ? "ring-2 ring-white ring-offset-2 ring-offset-[#7c0000]"
                  : "opacity-70 ring-1 ring-white/40 hover:opacity-100"
              }`}
            >
              <img
                src={m.src}
                alt={m.alt}
                className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
