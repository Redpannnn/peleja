"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Music2 } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

/**
 * Lagu latar undangan — Asmaranala (revisi user), file lokal di
 * public/music/Asmaranala.mp3 (bukan host eksternal lagi supaya deploy
 * Vercel/GitHub langsung bawa lagunya).
 */
const MUSIC_URL = "/music/Asmaranala.mp3";

/**
 * MusicPlayer — invisible audio controller + floating toggle button.
 *
 * Audio element-nya disembunyikan (tidak ada <audio controls>) karena kita
 * pakai custom floating button. Musik autoplay saat user klik "Buka Undangan"
 * (yang set `musicPlaying: true` di store) — ini memenuhi policy autoplay
 * browser karena dipicu oleh user gesture.
 *
 * Floating button muncul di semua slide setelah undangan dibuka, posisi
 * bottom-left. Klik untuk toggle play/pause.
 */
export default function MusicPlayer() {
  const musicPlaying = useInvitation((s) => s.musicPlaying);
  const toggleMusic = useInvitation((s) => s.toggleMusic);
  const setMusicPlaying = useInvitation((s) => s.setMusicPlaying);
  const opened = useInvitation((s) => s.opened);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync audio element with the store's musicPlaying state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      // play() returns a promise; it can reject if the browser blocks
      // autoplay (e.g. no prior user gesture). We catch silently and let
      // the user click the floating button to retry.
      audio.volume = 0;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {
          setMusicPlaying(false);
        });
      }
      // fade volume in gently so the song doesn't blast in
      let v = 0;
      const fade = setInterval(() => {
        v = Math.min(0.85, v + 0.08);
        audio.volume = v;
        if (v >= 0.85) clearInterval(fade);
      }, 80);
      return () => clearInterval(fade);
    } else {
      audio.pause();
    }
  }, [musicPlaying, setMusicPlaying]);

  // Don't render the floating button before the invitation is opened (cover
  // slide handles its own "Buka Undangan" button — no music there).
  // Catatan revisi user: elemen <audio> sendiri SELALU di-render sejak
  // slide 1, supaya tombol "Buka Undangan" bisa memanggil play() langsung
  // di dalam gesture klik (cara paling aman melawan autoplay policy —
  // terutama iOS Safari), dan musik langsung bunyi di slide 2 + terus
  // berlanjut di slide berikutnya.
  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      {opened && (
        <motion.button
          type="button"
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Matikan musik" : "Putar musik"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="group fixed bottom-5 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/70 text-[#544c39] shadow-[0_8px_20px_-8px_rgba(60,45,25,0.5)] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:right-8"
        >
          {musicPlaying ? (
            <Music className="size-4 animate-pulse" />
          ) : (
            <Music2 className="size-4" />
          )}
        </motion.button>
      )}
    </>
  );
}
