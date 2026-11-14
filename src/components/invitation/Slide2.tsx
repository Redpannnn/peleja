"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

// Video section 2 — mp4 self-hosted (revisi user, file dari imglink).
// Menggantikan YouTube embed: lebih cepat, tanpa dependensi API eksternal.
const VIDEO_SRC =
  "https://imglinkv-3.vercel.app/api/images/cmwfqh2c0jgbrwjub/file";

// Wallpaper yang tampil setelah video kelar / durasi habis (revisi user).
const AFTER_VIDEO_WALLPAPER =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Cover card putih setelah video (revisi user) — isinya 2 foto mempelai
// yang muncul bergantian setiap 2 detik.
const CARD_PHOTOS = [
  "https://imglinkv-3.vercel.app/api/images/cmwdb8ashjtaehyzw/file",
  "https://imglinkv-3.vercel.app/api/images/cmwdb88at0dzea3y0/file",
];
const CARD_PHOTO_INTERVAL_MS = 2000;

// Posisi crop tiap foto (semua 1080x2400 dengan bar hitam atas & bawah —
// konten asli di 16.25%-83.71% tinggi gambar, hasil ukur presisi).
const CARD_PHOTO_POSITIONS = ["50% 50%", "50% 45%"];

// Ayat Al-Qur'an pada kartu persegi yang menggabung dengan cover card
// capsule di atasnya (revisi user).
const QURAN_VERSE =
  "Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
const QURAN_LABEL = "QS. Ar-Rum : 21";

// Fallback durasi (ms) — dipakai kalau metadata durasi video tidak terbaca
// (jaringan lambat), wallpaper tetap muncul otomatis.
const FALLBACK_DURATION_MS = 95_000;

/**
 * Slide 2 — full screen video (mp4 native, autoplay muted).
 * Saat video kelar (event ended / fallback timer / error), otomatis
 * crossfade ke wallpaper AFTER_VIDEO_WALLPAPER, lalu langsung muncul
 * cover card putih setengah capsule (90% opacity) berisi foto mempelai
 * bergantian + kartu persegi berisi QS. Ar-Rum : 21.
 */
export default function Slide2() {
  const goTo = useInvitation((s) => s.goTo);
  const setCoverCardShown = useInvitation((s) => s.setCoverCardShown);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDone, setVideoDone] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleFallback = (ms: number) => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(() => setVideoDone(true), Math.max(1000, ms));
    };

    // Safety timer pertama — kalau metadata lama keluar, wallpaper tetap
    // muncul otomatis berdasarkan estimasi durasi.
    scheduleFallback(FALLBACK_DURATION_MS);

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  // Preload kedua foto cover card selama video diputar supaya saat
  // wallpaper muncul foto langsung tampil tanpa loading.
  useEffect(() => {
    CARD_PHOTOS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 2 foto bergantian setiap 2 detik setelah wallpaper + cover card muncul.
  useEffect(() => {
    if (!videoDone) return;
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % CARD_PHOTOS.length);
    }, CARD_PHOTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [videoDone]);

  // Revisi user: bunga pembatas slide 2↔3 (di Slide3) harus muncul BARENG
  // cover card di slide ini. Slide3 tidak bisa tahu kapan video kelar,
  // jadi lewat flag global di store — di-set tepat saat videoDone (kartu
  // sendiri punya delay 0.25s + durasi 1s, sama seperti animasi bunga).
  useEffect(() => {
    if (videoDone) setCoverCardShown(true);
  }, [videoDone, setCoverCardShown]);

  return (
    <main
      className="relative isolate z-10 flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-[#f3e9de]"
    >
      {/* ── Video full screen (cover-fit) ── */}
      <video
        ref={(v) => {
          videoRef.current = v;
          // React kadang tidak menerapkan atribut muted ke DOM — set langsung
          // supaya autoplay tanpa suara selalu diizinkan browser.
          if (v) {
            v.muted = true;
            v.play().catch(() => {});
          }
        }}
        src={VIDEO_SRC}
        aria-label="Video pernikahan Yayak & Eci"
        className="absolute inset-0 z-[1] h-full w-full select-none object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onLoadedMetadata={(e) => {
          const dur = e.currentTarget.duration;
          if (Number.isFinite(dur) && dur > 0) {
            // Reschedule fallback dengan durasi asli video (+buffer 1.5s).
            setTimeout(() => setVideoDone(true), dur * 1000 + 1500);
          }
        }}
        onEnded={() => setVideoDone(true)}
        onError={() => setVideoDone(true)}
      />

      {/* Overlay penahan klik — video tidak interaktif */}
      <div aria-hidden className="absolute inset-0 z-[2]" />

      {/* ── Wallpaper pengganti setelah video selesai + cover card ── */}
      <AnimatePresence>
        {videoDone && (
          <motion.div
            key="after-video-wallpaper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 z-[3] flex items-center justify-center overflow-hidden"
          >
            <img
              src={AFTER_VIDEO_WALLPAPER}
              alt="Latar setelah video"
              className="absolute inset-0 h-full w-full select-none object-cover"
              loading="eager"
              decoding="async"
            />

            {/* ── Cover card putih 90% — setengah capsule memanjang ke atas
                (revisi user), digabung dengan kartu persegi di bawahnya ── */}
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25,
              }}
              className="relative z-10 w-[min(19rem,88vw)]"
            >
              <div className="overflow-hidden rounded-t-full rounded-b-[2rem] border-2 border-[#F7D794]/70 bg-white/90 shadow-[0_28px_60px_-20px_rgba(60,45,25,0.45)] backdrop-blur-[2px]">
                {/* Kartu capsule atas — setengah capsule memanjang ke atas,
                    isi foto mempelai bergantian setiap 2 detik. Tinggi foto
                    adaptif viewport supaya kartu + ayat selalu muat di layar
                    pendek (desktop kecil / ponsel). */}
                <div className="px-4 pb-5 pt-4">
                  <div className="relative h-[min(18rem,38dvh)] w-full overflow-hidden rounded-t-full rounded-b-[1.25rem] bg-[#f3e9de]">
                    {CARD_PHOTOS.map((src, i) => (
                      <motion.img
                        key={src}
                        src={src}
                        alt={`Foto mempelai ${i + 1}`}
                        initial={false}
                        animate={{ opacity: photoIndex === i ? 1 : 0 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="absolute inset-0 h-full w-full select-none object-cover"
                        style={{ objectPosition: CARD_PHOTO_POSITIONS[i] }}
                        loading="eager"
                        decoding="async"
                      />
                    ))}
                  </div>
                </div>

                {/* Kartu persegi bawah — gabung dengan cover card capsule */}
                <div className="px-6 pb-6 pt-1 text-center">
                  <p className="font-script text-[0.82rem] leading-relaxed text-[#3a3424] sm:text-[0.9rem]">
                    {QURAN_VERSE}
                  </p>
                  <p className="font-latin mt-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#7b1e1e]">
                    {QURAN_LABEL}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button — kembali ke cover */}
      <button
        type="button"
        onClick={() => goTo("cover")}
        aria-label="Kembali ke cover"
        className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      </button>
    </main>
  );
}
