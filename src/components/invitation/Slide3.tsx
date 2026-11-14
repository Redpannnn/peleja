"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

// Wallpaper section 1 — VIDEO looping (revisi user, file mp4 dari imglink).
const BG_VIDEO =
  "https://imglinkv-3.vercel.app/api/images/cmwfqgyf99ytimxvm/file";

// Foto mempelai — revisi user: pria & wanita foto berbeda.
const GROOM_PHOTO =
  "https://imglinkv-3.vercel.app/api/images/cmwdi06x5229yeabb/file";
const BRIDE_PHOTO =
  "https://imglinkv-3.vercel.app/api/images/cmwdi05ceku7n8k3l/file";

// The "&" decorative separator between the bride and groom blocks.
const AMPERSAND_IMAGE =
  "https://the.invisimple.id/wp-content/uploads/2024/10/06.png";

/* Palet warna revisi — kartu capsule krem + outline maroon */
const CARD_OUTLINE = "#740404";
const MAROON = "#740404";
const INK = "#3a3424";

// Staggered entrance animation for the content cluster.
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

export default function Slide3() {
  const goTo = useInvitation((s) => s.goTo);
  // Sinkron dengan cover card slide 2 (revisi user): bunga pembatas baru
  // muncul setelah video slide 2 kelar + cover card tampil.
  const coverCardShown = useInvitation((s) => s.coverCardShown);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-clip bg-stone-100">
      {/* Background VIDEO — FIXED (parallax) so it stays put while the user
          scrolls through the long content. Muted + loop + playsinline supaya
          autoplay di semua browser (kebijakan autoplay Chrome/Safari). */}
      <motion.video
        src={BG_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        // React kadang tidak menerapkan atribut muted ke DOM — set langsung
        // lewat ref supaya autoplay-with-sound-block selalu terhindar.
        ref={(v) => {
          if (v) {
            v.muted = true;
            v.play().catch(() => {});
          }
        }}
      />

      {/* Subtle top darkening so the back button stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-black/15 to-transparent"
      />

      {/* Pembatas slide 2 ↔ slide 3 — bunga cascade PAS DI TENGAH garis
          batas kedua slide (revisi user): setengah di slide 2, setengah di
          slide 3. trik: main pakai overflow-x-clip (sumbu-Y bebas) supaya
          bunga bisa "keluar" ke atas main dan terlihat menumpuk di slide 2;
          z-30 (root context) menang atas slide 2 (z-10). Kanan: di-mirror
          (sisi rimbun nempel pojok kanan). Kiri: gambar normal (sisi rimbun
          nempel pojok kiri). MUNCUL BARENG cover card slide 2 (gate flag
          coverCardShown, delay 0.25s + durasi 1s — sama persis dengan animasi
          cover card). Ukuran digedein ~30%: min(46.8vw, 40.56rem) — nabrak
          elemen lain tidak masalah (revisi user). */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5%] top-0 z-30 h-[min(46.8vw,40.56rem)] -translate-y-1/2 -scale-x-100"
      >
        <motion.img
          src="/flowers/wedding-flower-2.png"
          alt=""
          initial={{ opacity: 0, y: -22 }}
          animate={
            coverCardShown ? { opacity: 1, y: 0 } : { opacity: 0, y: -22 }
          }
          transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-auto select-none"
          loading="eager"
          decoding="async"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-5%] top-0 z-30 h-[min(46.8vw,40.56rem)] -translate-y-1/2"
      >
        <motion.img
          src="/flowers/wedding-flower-2.png"
          alt=""
          initial={{ opacity: 0, y: -22 }}
          animate={
            coverCardShown ? { opacity: 1, y: 0 } : { opacity: 0, y: -22 }
          }
          transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-auto select-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Back button — top-left, scroll back to slide 2 */}
      <button
        type="button"
        onClick={() => goTo("cover")}
        aria-label="Kembali ke cover"
        className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      </button>

      {/* Content — capsule card krem (#FFF3E3) dengan outline tipis maroon.
          Semua teks gelap supaya terbaca di atas kartu terang. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 my-10 mx-4 flex w-[calc(100%-2rem)] max-w-[26rem] flex-col items-center rounded-b-full rounded-t-full border-[3px] bg-[#FFF3E3]/85 px-6 pb-16 pt-16 shadow-[0_28px_60px_-20px_rgba(60,45,25,0.45)] backdrop-blur-[2px]"
        style={{ borderColor: CARD_OUTLINE }}
      >
        {/* Doa pembuka — warna hitam (revisi user) */}
        <motion.div
          variants={item}
          className="flex w-full flex-col items-center text-center"
        >
          <p className="font-script text-center text-[0.75rem] leading-relaxed text-black sm:text-[0.8rem]">
            Maha Suci Allah yang telah menciptakan makhluk-Nya
            berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi
            pernikahan kami.
          </p>
        </motion.div>

        {/* ───── Groom block ───── */}
        <motion.div
          variants={item}
          className="mt-8 flex w-full flex-col items-center"
        >
          {/* Capsule photo — dikembalikan ke bentuk semula (revisi user):
              capsule tegak memanjang seperti desain awal. */}
          <div className="relative h-64 w-44 overflow-hidden rounded-full border border-white/80 shadow-[0_18px_45px_-12px_rgba(76,58,40,0.45)] ring-1 ring-stone-900/5 sm:h-72 sm:w-48">
            <img
              src={GROOM_PHOTO}
              alt="Foto mempelai pria"
              className="h-full w-full select-none object-cover"
              style={{ objectPosition: "50% 28%" }}
              loading="lazy"
            />
          </div>

          {/* Nama panggilan — font latin wedding (Great Vibes) */}
          <p
            className="font-wedding mt-4 text-[3rem] leading-none sm:text-[3.4rem]"
            style={{ color: MAROON }}
          >
            Hendra
          </p>

          {/* Nama lengkap — font-script */}
          <p
            className="font-script mt-1 text-[0.85rem] sm:text-[0.95rem]"
            style={{ color: INK }}
          >
            Hendra
          </p>

          {/* Putra dari — font-script */}
          <p
            className="font-script mt-3 text-[0.72rem] sm:text-[0.78rem]"
            style={{ color: INK }}
          >
            Putra dari
          </p>
          <p
            className="font-script mt-1 max-w-[17rem] text-center text-[0.85rem] leading-relaxed sm:text-[0.95rem]"
            style={{ color: INK }}
          >
            Harno bin Jiman (Alm) &amp; Narti binti Lani (Alm)
          </p>
        </motion.div>

        {/* ───── Ampersand separator ───── */}
        <motion.div variants={item} className="my-6 flex items-center justify-center">
          <img
            src={AMPERSAND_IMAGE}
            alt="Pernikahan"
            className="h-auto w-16 object-contain opacity-90 sm:w-20"
            loading="lazy"
          />
        </motion.div>

        {/* ───── Bride block ───── */}
        <motion.div
          variants={item}
          className="flex w-full flex-col items-center"
        >
          {/* Capsule photo — dikembalikan ke bentuk semula (revisi user):
              capsule tegak memanjang seperti desain awal. */}
          <div className="relative h-64 w-44 overflow-hidden rounded-full border border-white/80 shadow-[0_18px_45px_-12px_rgba(76,58,40,0.45)] ring-1 ring-stone-900/5 sm:h-72 sm:w-48">
            <img
              src={BRIDE_PHOTO}
              alt="Foto mempelai wanita"
              className="h-full w-full select-none object-cover"
              style={{ objectPosition: "50% 45%" }}
              loading="lazy"
            />
          </div>

          {/* Nama panggilan — font latin wedding (Great Vibes) */}
          <p
            className="font-wedding mt-4 text-[3rem] leading-none sm:text-[3.4rem]"
            style={{ color: MAROON }}
          >
            Eci
          </p>

          {/* Nama lengkap — font-script */}
          <p
            className="font-script mt-1 text-[0.85rem] sm:text-[0.95rem]"
            style={{ color: INK }}
          >
            Eci Kurnia
          </p>

          {/* Putri dari — font-script */}
          <p
            className="font-script mt-3 text-[0.72rem] sm:text-[0.78rem]"
            style={{ color: INK }}
          >
            Putri dari
          </p>
          <p
            className="font-script mt-1 max-w-[17rem] text-center text-[0.85rem] leading-relaxed sm:text-[0.95rem]"
            style={{ color: INK }}
          >
            Bapak Dadang bin Imran &amp; Ibu Lasmi Fitri Liana binti Ahyar
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
