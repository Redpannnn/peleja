"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Gambar latar kartu acara — tema Montion-7.
const EVENT_CARD_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Target countdown: AKAD NIKAH — Minggu, 10 Januari 2027, 08.00 WIB (UTC+7).
// 08:00 WIB = 01:00 UTC → 2027-01-10T01:00:00Z. (Revisi user: countdown
// diarahkan ke acara akad.)
const AKAD_TARGET = new Date("2027-01-10T01:00:00Z").getTime();

const MAROON = "#740404";
const INK = "#3a3424";

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

/** Live countdown to AKAD_TARGET. Returns days/hours/minutes/seconds left. */
function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

/**
 * EventCardCapsule — cover card bentuk capsule dengan gambar tema sebagai
 * latar (dipotong mengikuti bentuk capsule). Inner card: bentuk sama persis
 * dengan capsule luar (rounded-full), ukuran 85% dari capsule luar,
 * berwarna putih 85% berisi detail acara.
 *
 * Desain bagian waktu (revisi user):
 *   hari acara → tanggal acara (angka besar maroon) → bulan & tahun acara.
 */
function EventCardCapsule({
  title,
  day,
  dateNum,
  monthYear,
  time,
  location,
}: {
  title: string;
  day: string;
  dateNum: string;
  monthYear: string;
  time: string;
  location: string;
}) {
  return (
    <motion.div
      variants={item}
      className="relative flex h-[480px] w-[min(78vw,286px)] flex-col items-center justify-center overflow-hidden rounded-full shadow-[0_24px_55px_-18px_rgba(60,45,25,0.55)] ring-1 ring-white/60 sm:h-[500px] sm:w-[300px]"
    >
      {/* Gambar tema — object-cover mengikuti bentuk capsule */}
      <img
        src={EVENT_CARD_IMAGE}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        loading="lazy"
        decoding="async"
      />

      {/* Inner capsule card — bentuk sama dengan capsule luar, ukuran 85% */}
      <div className="relative z-[2] flex h-[85%] w-[85%] flex-col items-center justify-center rounded-full bg-white/85 px-5 text-center shadow-[0_14px_34px_-14px_rgba(60,45,25,0.45)] backdrop-blur-[2px]">
        <h3
          className="font-wedding text-[2.1rem] leading-none sm:text-[2.4rem]"
          style={{ color: MAROON }}
        >
          {title}
        </h3>

        <span
          aria-hidden
          className="my-3 h-px w-20 bg-gradient-to-r from-transparent via-[#8c6d2f]/50 to-transparent"
        />

        {/* Hari acara */}
        <p className="font-script text-[0.92rem]" style={{ color: INK }}>
          {day}
        </p>

        {/* Tanggal acara — angka agak gede, warna merah maroon */}
        <p
          className="font-serif-display my-1 text-[2.8rem] font-semibold leading-none sm:text-[3.2rem]"
          style={{ color: MAROON }}
        >
          {dateNum}
        </p>

        {/* Bulan & tahun acara */}
        <p className="font-script text-[0.95rem]" style={{ color: INK }}>
          {monthYear}
        </p>

        <span
          aria-hidden
          className="my-3 h-px w-16 bg-gradient-to-r from-transparent via-[#8c6d2f]/40 to-transparent"
        />

        <p className="font-script text-[0.9rem]" style={{ color: INK }}>
          {time}
        </p>
        <p
          className="font-script mt-2 text-[0.82rem] leading-relaxed"
          style={{ color: INK }}
        >
          {location}
        </p>
      </div>
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f4ec] font-latin text-[1.4rem] font-medium text-[#3a3424] shadow-[0_8px_20px_-8px_rgba(60,45,25,0.4)] sm:h-16 sm:w-16 sm:text-[1.7rem]">
        {padded}
      </div>
      <span className="font-latin mt-2 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-white sm:text-[0.6rem]">
        {label}
      </span>
    </div>
  );
}

export default function Slide4() {
  const { days, hours, minutes, seconds } = useCountdown(AKAD_TARGET);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax) */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar slide acara"
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
      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full flex-col items-center px-6 py-20"
      >
        {/* ── Detail acara: 3 cover card capsule (gambar tema + inner card 85%) ── */}

        {/* Akad Nikah */}
        <div className="flex w-full justify-center">
          <EventCardCapsule
            title="Akad Nikah"
            day="Minggu"
            dateNum="10"
            monthYear="Januari 2027"
            time="Pukul 08.00 - 09.00"
            location="Lokasi Dusun 4 Desa Gajah Mati"
          />
        </div>

        {/* Resepsi */}
        <div className="mt-10 flex w-full justify-center">
          <EventCardCapsule
            title="Resepsi"
            day="Minggu"
            dateNum="10"
            monthYear="Januari 2027"
            time="Pukul 09.00 - Selesai"
            location="Lokasi Dusun 4 Desa Gajah Mati"
          />
        </div>

        {/* Ngunduh Mantu */}
        <div className="mt-10 flex w-full justify-center">
          <EventCardCapsule
            title="Ngunduh Mantu"
            day="Minggu"
            dateNum="17"
            monthYear="Januari 2027"
            time="Pukul 10.00 - Selesai"
            location="Lokasi C5 Rimba Ukur (Rumah Mempelai Pria)"
          />
        </div>

        {/* Countdown — diarahkan ke acara AKAD (revisi user) */}
        <motion.div
          variants={item}
          className="mt-16 flex w-full flex-col items-center"
        >
          <p className="font-latin text-[0.72rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.78rem]">
            Menuju Hari Bahagia
          </p>

          <div className="mt-6 flex items-start gap-3 sm:gap-4">
            <CountdownUnit value={days} label="Hari" />
            <span className="font-latin mt-5 text-[1.4rem] text-white sm:text-[1.7rem]">:</span>
            <CountdownUnit value={hours} label="Jam" />
            <span className="font-latin mt-5 text-[1.4rem] text-white sm:text-[1.7rem]">:</span>
            <CountdownUnit value={minutes} label="Menit" />
            <span className="font-latin mt-5 text-[1.4rem] text-white sm:text-[1.7rem]">:</span>
            <CountdownUnit value={seconds} label="Detik" />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
