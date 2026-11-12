"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";
import {
  BgStage,
  BgBase,
  COVER_SWAY,
  SwayLayer,
} from "@/components/invitation/BgScene";

/* Palet warna revisi (kartu capsule krem + outline gold muda #F7D794) */
const CARD_OUTLINE = "#F7D794";
const MAROON = "#7b1e1e";
const BROWN = "#5a4a3a";

const COUPLE_PHOTO =
  "https://imglinkv-3.vercel.app/api/images/cmwdb82qqqrqizphy/file";

/**
 * Rapikan nama tamu dari parameter URL (?to=budi-santoso) supaya tetap tampil
 * sopan saat lookup database tidak tersedia (mis. tanpa DATABASE_URL):
 * "budi-santoso" → "Budi Santoso".
 */
function prettifyGuestParam(raw: string): string {
  const spaced = raw.replace(/[-_+]+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced) return raw;
  if (spaced === spaced.toLowerCase()) {
    return spaced.replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());
  }
  return spaced;
}

// Staggered entrance animation — konten kartu muncul berurutan.
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.55,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide1Cover() {
  const openInvitation = useInvitation((s) => s.openInvitation);

  // Guest name — di-resolve dari URL ?to=<code|name>.
  //   • ?to=budi      → lookup ke DB /api/guests/lookup → "Budi Santoso" (jika terdaftar)
  //   • ?to=Budi+Sapo → tidak terdaftar → tampil "Budi Sapo" literal
  //   • (tanpa ?to=)  → fallback "Tamu Undangan"
  const [guestName, setGuestName] = useState("Tamu Undangan");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (!raw) return;
    const decoded = decodeURIComponent(raw.replace(/\+/g, " ")).trim();
    if (!decoded) return;

    // Cek di database dulu — kalau code terdaftar, pakai nama lengkapnya.
    // Kalau API tidak tersedia (static hosting), tampilkan param yang sudah
    // dirapikan: "budi-santoso" → "Budi Santoso".
    fetch(`/api/guests/lookup?code=${encodeURIComponent(decoded)}`)
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        setGuestName(data?.name ?? prettifyGuestParam(decoded));
      })
      .catch(() => {
        setGuestName(prettifyGuestParam(decoded));
      });
  }, []);

  return (
    <main className="relative flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-[#f3e9de]">
      {/* ── Stage wallpaper Montion-7 (aspek tetap, cover align-top) ── */}
      <BgStage mode="cover">
        {/* Gambar dasar utuh */}
        <BgBase />

        {/* Overlay goyangan angin tipis:
            4 pohon (2 kiri 2 kanan) + bunga bawah kiri & kanan. */}
        {COVER_SWAY.map((spec) => (
          <SwayLayer key={spec.piece} spec={spec} />
        ))}
      </BgStage>

      {/* ── Kartu capsule (diperbesar, #FFF3E3 / 85% + outline #F7D794) ── */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-[9%]">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-[500px] flex-col items-center rounded-full border-2 bg-[#FFF3E3]/85 px-5 pb-9 pt-12 shadow-[0_28px_60px_-20px_rgba(90,60,30,0.45)] backdrop-blur-[2px] sm:px-6"
          style={{ borderColor: CARD_OUTLINE }}
        >
          {/* Konten dalam kartu */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex w-full flex-col items-center"
          >
            {/* The Wedding Of — hitam, ukuran lebih kecil (revisi user) */}
            <motion.p
              variants={item}
              className="font-wedding text-center text-[1.7rem] leading-none text-black sm:text-[2rem]"
            >
              The Wedding Of
            </motion.p>

            {/* Foto mempelai — capsule memenuhi lebar kartu, tanpa sisa space */}
            <motion.div
              variants={item}
              className="relative mt-4 h-[34dvh] max-h-[330px] min-h-[220px] w-full overflow-hidden rounded-full border-2 border-white bg-white/40 shadow-[0_18px_45px_-12px_rgba(76,58,40,0.5)]"
            >
              <img
                src={COUPLE_PHOTO}
                alt="Foto mempelai Yayak & Eci"
                className="h-full w-full select-none object-cover"
                style={{ objectPosition: "50% 38%" }}
                loading="eager"
                decoding="async"
              />
            </motion.div>

            {/* Nama mempelai — lebih kecil, digeser ke bawah (revisi user) */}
            <motion.h1
              variants={item}
              className="font-serif-display mt-5 whitespace-nowrap text-center text-[1.3rem] font-semibold uppercase tracking-[0.05em] sm:text-[1.55rem]"
              style={{ color: MAROON }}
            >
              Yayak{" "}
              <span className="font-wedding text-[1.3em] font-normal normal-case italic">
                &amp;
              </span>{" "}
              Eci
            </motion.h1>

            {/* Kepada Yth. — blok penerima undangan (ditarik lebih dekat ke nama) */}
            <motion.div
              variants={item}
              className="mt-1.5 flex w-full flex-col items-center"
            >
              <p
                className="font-script text-center text-[0.85rem] sm:text-[0.95rem]"
                style={{ color: BROWN }}
              >
                Kepada Yth.
              </p>
              <p
                className="font-script mt-0.5 text-center text-[0.85rem] sm:text-[0.95rem]"
                style={{ color: BROWN }}
              >
                Bapak/ Ibu/ Saudara/i
              </p>
              <p
                className="font-script mt-1.5 text-center text-[1rem] font-medium italic sm:text-[1.1rem]"
                style={{ color: MAROON }}
              >
                {guestName}
              </p>
            </motion.div>

            {/* Tombol buka undangan — kecil */}
            <motion.div variants={item} className="mt-5 w-full">
              <motion.button
                type="button"
                onClick={openInvitation}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group mx-auto flex h-8 w-full max-w-[9.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#7b1e1e]/40 bg-[#7b1e1e] px-3.5 text-[0.5rem] uppercase tracking-[0.24em] text-white shadow-[0_10px_22px_-10px_rgba(123,30,30,0.65)] transition-colors hover:border-[#7b1e1e] hover:bg-[#671717] hover:text-white sm:text-[0.55rem]"
              >
                <Mail className="size-3 transition-transform group-hover:-rotate-6" />
                <span>Buka Undangan</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
