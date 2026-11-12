"use client";

import { motion } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Couple photo for the closing capsule.
const COUPLE_PHOTO =
  "https://imglinkv-3.vercel.app/api/images/cmwdb82qqqrqizphy/file";

/* Sosial media Memoraa' (revisi user) — ukuran visual disamakan dengan
   icon Instagram (gambar sumber punya padding berbeda, jadi box render
   disesuaikan: WA lebih besar, TikTok lebih kecil). */
const SOCIALS = [
  {
    name: "WhatsApp",
    icon: "https://imglinkv-3.vercel.app/api/images/cmw79rb651wumgvv6/file",
    href: "https://wa.me/6285731219074",
    size: "h-6 w-6", // logo WA kecil di gambarnya — perlu box lebih besar
  },
  {
    name: "Instagram",
    icon: "https://imglinkv-3.vercel.app/api/images/cmw79repvzc30frlt/file",
    href: "https://www.instagram.com/memoraainvitation/",
    size: "h-5 w-5", // acuan ukuran
  },
  {
    name: "TikTok",
    icon: "https://imglinkv-3.vercel.app/api/images/cmw79rcxk1hanb2c0/file",
    href: "https://www.tiktok.com/@memoraainvtitation._",
    size: "h-4 w-4", // logo TikTok besar di gambarnya — box lebih kecil
  },
];

const CLOSING_DOA =
  "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do’a restu kepada kami.";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide9() {
  const goTo = useInvitation((s) => s.goTo);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      <motion.img
        src={BG_IMAGE}
        alt="Latar penutup"
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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-[24rem] flex-1 flex-col items-center px-6 pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center"
      >
        {/* Couple photo — capsule shape */}
        <motion.div
          variants={item}
          className="relative h-64 w-44 overflow-hidden rounded-full border border-white/70 shadow-[0_18px_45px_-12px_rgba(76,58,40,0.45)] ring-1 ring-stone-900/5 sm:h-72 sm:w-48"
        >
          <img
            src={COUPLE_PHOTO}
            alt="Foto pengantin Yayak & Eci"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Terima Kasih — font latin wedding (Great Vibes), terang di overlay gelap */}
        <motion.h2
          variants={item}
          className="font-wedding mt-6 text-[3rem] leading-none text-[#f4ede0] sm:text-[3.6rem]"
        >
          Terima Kasih
        </motion.h2>

        {/* Doa */}
        <motion.p
          variants={item}
          className="font-script mt-5 text-[0.82rem] leading-relaxed text-[#f4ede0] sm:text-[0.9rem]"
        >
          {CLOSING_DOA}
        </motion.p>

        {/* Wassalamu'alaikum */}
        <motion.p
          variants={item}
          className="font-script mt-5 text-[0.82rem] leading-relaxed text-[#f4ede0] sm:text-[0.9rem]"
        >
          Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh
        </motion.p>

        {/* thin ornamental divider */}
        <motion.span
          variants={item}
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        {/* Kami yang berbahagia */}
        <motion.p
          variants={item}
          className="font-latin text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#f4ede0] sm:text-[0.68rem]"
        >
          Kami yang berbahagia
        </motion.p>

        {/* Yayak & Eci — font latin wedding, aksen gold muda */}
        <motion.p
          variants={item}
          className="font-wedding mt-2 text-[2rem] leading-none text-[#F7D794] sm:text-[2.4rem]"
        >
          Yayak &amp; Eci
        </motion.p>

        {/* Celebrate with Memoraa' — branding dipatok di batas bawah page */}
        <motion.div
          variants={item}
          className="mt-auto flex w-full flex-col items-center pt-10"
        >
          <p
            className="font-script text-[0.95rem] italic text-[#f4ede0] sm:text-[1.05rem]"
          >
            celebrate with <span className="font-medium">Memoraa&rsquo;</span>
          </p>

          {/* 3 icon sosmed — bulatan terang supaya terbaca di overlay gelap,
              ukuran visual icon disamakan */}
          <div className="mt-3 flex items-center gap-3.5">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name} Memoraa'`}
                title={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4ede0] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 hover:scale-110"
              >
                <img
                  src={s.icon}
                  alt={`Icon ${s.name}`}
                  className={`${s.size} select-none object-contain`}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
