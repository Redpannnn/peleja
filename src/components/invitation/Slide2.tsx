"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

// YouTube Shorts — video pengganti section 2 (revisi user).
const VIDEO_ID = "6mbMlJ2jb2I";

// Wallpaper yang tampil setelah video kelar / durasi habis (revisi user).
const AFTER_VIDEO_WALLPAPER =
  "https://imglinkv-3.vercel.app/api/images/cmwdiqs1x0u100zm6/file";

// Fallback durasi (ms) — dipakai kalau event ENDED dari YouTube API tidak
// terpicu (misal jaringan lambat), wallpaper tetap muncul otomatis.
const FALLBACK_DURATION_MS = 95_000;

/* ── Minimal typing untuk YouTube IFrame Player API ── */
type YTPlayer = {
  destroy: () => void;
  playVideo?: () => void;
  getDuration?: () => number;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement | string,
    opts: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// State player YouTube: 0 = ENDED (video selesai).
const YT_STATE_ENDED = 0;

/**
 * Muat (sekali) script YouTube IFrame API dan resolve begitu API siap.
 * Catatan: event `load` bootstrap script terpicu SEBELUM YT.Player tersedia —
 * yang benar adalah menunggu callback global `onYouTubeIframeAPIReady`.
 */
function loadYouTubeAPI(): Promise<YTNamespace> {
  return new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    // Chain callback kalau ada pihak lain yang juga menunggu API.
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube API tidak tersedia"));
    };

    if (!document.querySelector('script[data-yt-api="1"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.dataset.ytApi = "1";
      s.async = true;
      s.addEventListener("error", () =>
        reject(new Error("Gagal memuat YouTube API"))
      );
      document.head.appendChild(s);
    }

    // Safety timeout — kalau API tak kunjung siap, reject (→ wallpaper).
    setTimeout(() => {
      if (!window.YT?.Player) {
        reject(new Error("YouTube API timeout"));
      }
    }, 10_000);
  });
}

/**
 * Slide 2 — full screen video YouTube.
 * Saat video kelar (event ENDED / fallback timer), otomatis crossfade
 * ke wallpaper AFTER_VIDEO_WALLPAPER.
 */
export default function Slide2() {
  const goTo = useInvitation((s) => s.goTo);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [videoDone, setVideoDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleFallback = (seconds: number) => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(
        () => setVideoDone(true),
        Math.max(1, seconds) * 1000 + 1500
      );
    };

    // Host dibuat imperatively supaya replace node oleh YouTube API
    // tidak bentrok dengan reconciliasi React.
    const host = document.createElement("div");
    containerRef.current?.appendChild(host);

    loadYouTubeAPI()
      .then((YT) => {
        if (cancelled) return;
        const player = new YT.Player(host, {
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 1,
            mute: 1, // musik latar undangan sudah jalan — video tetap muted
            playsinline: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
          },
          events: {
            // Pastikan video mulai main begitu siap, lalu pasang fallback
            // timer berdasarkan durasi asli video (kalau event ENDED
            // tidak terpicu, wallpaper tetap muncul otomatis).
            onReady: () => {
              try {
                player.playVideo?.();
              } catch {
                /* autoplay mungkin diblokir — fallback timer tetap jalan */
              }
              const dur = (() => {
                try {
                  return player.getDuration?.() ?? 0;
                } catch {
                  return 0;
                }
              })();
              scheduleFallback(dur > 0 ? dur : FALLBACK_DURATION_MS / 1000);
            },
            onStateChange: (e) => {
              if (e.data === YT_STATE_ENDED) setVideoDone(true);
            },
            // Video gagal dimuat (dihapus, private, dsb.) → langsung wallpaper.
            onError: () => setVideoDone(true),
          },
        });
        playerRef.current = player;
      })
      .catch(() => {
        // API gagal dimuat (offline dsb.) — langsung tampilkan wallpaper.
        if (!cancelled) setVideoDone(true);
      });

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      try {
        playerRef.current?.destroy();
      } catch {
        /* player mungkin sudah hancur sendiri */
      }
      playerRef.current = null;
      host.remove();
    };
  }, []);

  return (
    <main
      className="relative isolate z-10 flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-[#f3e9de]"
    >
      {/* ── Video full screen (cover-fit) ── */}
      <div
        ref={containerRef}
        aria-label="Video pernikahan Yayak & Eci"
        className="absolute inset-0 z-[1] overflow-hidden [&_iframe]:absolute [&_iframe]:left-1/2 [&_iframe]:top-1/2 [&_iframe]:h-[max(100dvh,177.78vw)] [&_iframe]:w-[max(100vw,56.25dvh)] [&_iframe]:-translate-x-1/2 [&_iframe]:-translate-y-1/2 [&_iframe]:border-0"
      />

      {/* Overlay penahan klik — video tidak interaktif */}
      <div aria-hidden className="absolute inset-0 z-[2]" />

      {/* ── Wallpaper pengganti setelah video selesai ── */}
      <AnimatePresence>
        {videoDone && (
          <motion.div
            key="after-video-wallpaper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 z-[3]"
          >
            <img
              src={AFTER_VIDEO_WALLPAPER}
              alt="Latar setelah video"
              className="h-full w-full select-none object-cover"
              loading="eager"
              decoding="async"
            />
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
