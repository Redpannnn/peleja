"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Aset tema "Montion-7" (Gandilova) + warna dasar wallpaper.
   ───────────────────────────────────────────────────────────────────────────── */
export const BG_IMAGE =
  "https://the.gandilova.com/wp-content/uploads/2026/06/BG-Montion-7-C.webp";
// (Mahkota dihapus per revisi user — tidak dipakai lagi.)

/** Warna krem dasar wallpaper — dipakai sebagai letterbox / fallback. */
export const CREAM = "#f3e9de";

/** Rasio asli wallpaper (846 x 1688). */
export const BG_ASPECT_W = 846;
export const BG_ASPECT_H = 1688;
/** 846 / 1688 ≈ 0.5012 — dipakai di rumus stage cover: width = 50.12dvh. */
export const BG_AR = BG_ASPECT_W / BG_ASPECT_H; // 0.50118...

/* ─────────────────────────────────────────────────────────────────────────────
   ENGINE SLICE MASK

   Wallpaper-nya satu gambar utuh (flatten), jadi pohon / rumah / bunga
   "dipotong" memakai CSS mask ellipse yang di-feather di tepinya.
   Setiap piece = satu <img> full-image yang di-mask ke satu region —
   konten yang tampil 100% identik dengan gambar dasar, sehingga:
     • kalau dua piece saling overlap → pikselnya sama persis, jahitannya
       tidak mungkin terlihat;
     • union dari semua mask mencakup seluruh konten gambar, jadi saat
       semua piece tampil, hasil akhir = gambar utuh.
   Ukuran/posisi diukur dalam % terhadap gambar (ruang stage).
   ───────────────────────────────────────────────────────────────────────────── */

export type Ellipse = {
  /** pusat mask, % lebar gambar */
  cx: number;
  /** pusat mask, % tinggi gambar */
  cy: number;
  /** ukuran mask, % lebar gambar */
  w: number;
  /** ukuran mask, % tinggi gambar */
  h: number;
  /** stop hitam solid (sebelum feather), % radius */
  solid: number;
};

export type PieceId =
  | "backdrop"
  | "house"
  | "flower-bl"
  | "flower-br"
  | "tree-gl"
  | "tree-gr"
  | "tree-pl"
  | "tree-pr"
  | "corner-tl"
  | "corner-tr"
  | "orn-left"
  | "orn-right";

/**
 * Region tiap bentuk pada wallpaper Montion-7 (diukur dari gambar asli):
 *  • backdrop  — sketsa gunung/jembatan/menara samar di tengah
 *  • house     — rumah kayu joglo di bawah (strip tengah, tanpa bunga pojok)
 *  • flower-bl — bunga maroon + putih pojok kiri bawah
 *  • flower-br — bunga maroon + putih + ginkgo pojok kanan bawah
 *  • tree-gl/gr — pohon emas atas kiri / kanan
 *  • tree-pl/pr — pohon pink/mauve tengah kiri / kanan
 *  • corner-tl/tr — bunga maroon pojok atas kiri / ginkgo+bunga kanan
 *  • orn-left/right — ornamen batik emas di bibir atas (dibagi dua)
 */
export const PIECES: Record<PieceId, Ellipse> = {
  backdrop: { cx: 50, cy: 50, w: 96, h: 66, solid: 72 },
  house: { cx: 50, cy: 87, w: 66, h: 40, solid: 78 },
  "flower-bl": { cx: 10, cy: 89, w: 52, h: 34, solid: 75 },
  "flower-br": { cx: 90, cy: 89, w: 52, h: 34, solid: 75 },
  "tree-gl": { cx: 11, cy: 31, w: 46, h: 42, solid: 72 },
  "tree-gr": { cx: 88, cy: 31, w: 46, h: 42, solid: 72 },
  "tree-pl": { cx: 8, cy: 61, w: 40, h: 44, solid: 72 },
  "tree-pr": { cx: 92, cy: 61, w: 40, h: 44, solid: 72 },
  "corner-tl": { cx: 7, cy: 7, w: 40, h: 30, solid: 75 },
  "corner-tr": { cx: 93, cy: 8, w: 40, h: 34, solid: 75 },
  "orn-left": { cx: 27, cy: 5, w: 58, h: 16, solid: 75 },
  "orn-right": { cx: 73, cy: 5, w: 58, h: 16, solid: 75 },
};

/**
 * Bangun style CSS mask ellipse untuk satu piece.
 *
 * mask-position dalam persen punya semantik "titik p% mask Disejajarkan dengan
 * titik p% container", jadi untuk menaruh pusat mask di (cx%, cy%) posisinya:
 *   p = (c - s/2) / (1 - s)   — valid selama ukuran mask < 100%.
 */
export function maskStyle(e: Ellipse): CSSProperties {
  const sw = e.w / 100;
  const sh = e.h / 100;
  const px = (e.cx / 100 - sw / 2) / (1 - sw);
  const py = (e.cy / 100 - sh / 2) / (1 - sh);
  const grad = `radial-gradient(closest-side, black ${e.solid}%, rgba(0,0,0,0) 100%)`;
  const pxStr = `${(px * 100).toFixed(3)}%`;
  const pyStr = `${(py * 100).toFixed(3)}%`;
  const sizeStr = `${e.w}% ${e.h}%`;
  return {
    maskImage: grad,
    WebkitMaskImage: grad,
    maskSize: sizeStr,
    WebkitMaskSize: sizeStr,
    maskPosition: `${pxStr} ${pyStr}`,
    WebkitMaskPosition: `${pxStr} ${pyStr}`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  } as CSSProperties;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAGE — wadah ber-aspek tetap (846:1688) supaya posisi mask selalu presisi
   relatif terhadap konten gambar di SEMUA ukuran layar.

   mode "cover"   : meniru object-fit: cover dengan align ATAS — stage lebar
                    = max(100%, 50.12dvh) → di HP portrait pas penuh, di
                    desktop melebar ke samping & ter-crop bawahnya.
   mode "contain" : seluruh gambar selalu terlihat (letterbox krem) —
                    dipakai di scene perakitan section 2.
   ───────────────────────────────────────────────────────────────────────────── */

export function BgStage({
  mode,
  children,
}: {
  mode: "cover" | "contain";
  children?: ReactNode;
}) {
  if (mode === "cover") {
    return (
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden"
        style={{
          width: `max(100%, ${(BG_AR * 100).toFixed(2)}dvh)`,
          aspectRatio: `${BG_ASPECT_W} / ${BG_ASPECT_H}`,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
      style={{
        width: `min(100%, ${(BG_AR * 100).toFixed(2)}dvh)`,
        aspectRatio: `${BG_ASPECT_W} / ${BG_ASPECT_H}`,
      }}
    >
      {children}
    </div>
  );
}

/** Layer gambar dasar (statik, tanpa mask) di dalam stage. */
export function BgBase() {
  return (
    <img
      src={BG_IMAGE}
      alt=""
      aria-hidden
      draggable={false}
      className="absolute inset-0 h-full w-full select-none object-cover"
      loading="eager"
      decoding="async"
      // @ts-expect-error -- fetchPriority valid di React 19
      fetchPriority="high"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LAYER GOYANG (section 1 / cover)

   Overlay berisi piksel yang SAMA dengan gambar dasar — saat diam tak
   terlihat; saat bergoyang, kontur pohon/bunga ikut bergerak halus seperti
   ketiup angin tipis. transform-origin = pangkal pohon / pangkal bunga.
   ───────────────────────────────────────────────────────────────────────────── */

export type SwaySpec = {
  piece: PieceId;
  /** class animasi CSS (breeze-a … breeze-flower) */
  anim: string;
  /** titik pivot goyangan, % (x y) terhadap gambar */
  originX: number;
  originY: number;
};

/** Pivot diukur dari pangkal batang tiap pohon / tangkai bunga. */
export const COVER_SWAY: SwaySpec[] = [
  { piece: "tree-gl", anim: "breeze-a", originX: 3, originY: 47 },
  { piece: "tree-gr", anim: "breeze-b", originX: 97, originY: 47 },
  { piece: "tree-pl", anim: "breeze-c", originX: 2, originY: 81 },
  { piece: "tree-pr", anim: "breeze-d", originX: 98, originY: 81 },
  { piece: "flower-bl", anim: "breeze-flower", originX: 1, originY: 99 },
  { piece: "flower-br", anim: "breeze-flower", originX: 99, originY: 99 },
];

export function SwayLayer({ spec }: { spec: SwaySpec }) {
  return (
    <img
      src={BG_IMAGE}
      alt=""
      aria-hidden
      draggable={false}
      loading="eager"
      decoding="async"
      className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover ${spec.anim}`}
      style={{
        ...maskStyle(PIECES[spec.piece]),
        transformOrigin: `${spec.originX}% ${spec.originY}%`,
        willChange: "transform",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LAYER PERAKITAN (section 2)

   Setiap piece fade-in + naik sedikit ke posisinya, satu per satu.
   Setelah semua terkumpul → DIEM (tanpa animasi loop), lalu kartu capsule
   muncul (dirender oleh Slide2 sendiri).
   ───────────────────────────────────────────────────────────────────────────── */

export type AssembleStep = {
  piece: PieceId;
  /** detik — jeda mulai animasi piece ini */
  delay: number;
  /** arah datang: "up" | "down" | "left" | "right" | "fade" */
  from?: "up" | "down" | "left" | "right" | "fade";
  /** jarak geser saat masuk (px) */
  dist?: number;
  /** durasi animasi (detik) */
  duration?: number;
};

/**
 * Urutan kemunculan — RUMAH PALING PERTAMA (request user), lalu bunga bawah,
 * pohon, bunga pojok atas, ornamen batik atas (kiri → kanan), dan terakhir
 * sketsa gunung samar fade-in menutup scene. Setelah semua terkumpul → DIEM.
 */
export const ASSEMBLE_ORDER: AssembleStep[] = [
  { piece: "house", delay: 0.35, from: "up", dist: 46, duration: 1.1 },
  { piece: "flower-bl", delay: 1.2, from: "up", dist: 34, duration: 1.0 },
  { piece: "flower-br", delay: 1.55, from: "up", dist: 34, duration: 1.0 },
  { piece: "tree-gl", delay: 2.1, from: "up", dist: 30, duration: 1.0 },
  { piece: "tree-gr", delay: 2.45, from: "up", dist: 30, duration: 1.0 },
  { piece: "tree-pl", delay: 3.0, from: "up", dist: 30, duration: 1.0 },
  { piece: "tree-pr", delay: 3.35, from: "up", dist: 30, duration: 1.0 },
  { piece: "corner-tl", delay: 3.9, from: "down", dist: 26, duration: 0.9 },
  { piece: "corner-tr", delay: 4.2, from: "down", dist: 26, duration: 0.9 },
  { piece: "orn-left", delay: 4.7, from: "down", dist: 22, duration: 0.9 },
  { piece: "orn-right", delay: 5.0, from: "down", dist: 22, duration: 0.9 },
  { piece: "backdrop", delay: 5.35, from: "fade", duration: 1.3 },
];

const offsetFor = (step: AssembleStep): { x?: number; y?: number } => {
  const d = step.dist ?? 30;
  switch (step.from) {
    case "up":
      return { y: d };
    case "down":
      return { y: -d };
    case "left":
      return { x: d };
    case "right":
      return { x: -d };
    default:
      return {};
  }
};

export function AssembleLayer({ step }: { step: AssembleStep }) {
  const off = offsetFor(step);
  return (
    <motion.img
      src={BG_IMAGE}
      alt=""
      aria-hidden
      draggable={false}
      loading="eager"
      decoding="async"
      initial={{ opacity: 0, x: off.x ?? 0, y: off.y ?? 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        delay: step.delay,
        duration: step.duration ?? 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      style={maskStyle(PIECES[step.piece])}
    />
  );
}
