import { create } from "zustand";

export type SlideId = "cover" | "slide-2" | "slide-3" | "slide-4" | "slide-5";

interface InvitationState {
  /** slide yang sedang aktif / tampil */
  current: SlideId;
  /** apakah undangan sudah dibuka (lewat tombol "Buka Undangan") */
  opened: boolean;
  /** apakah music sedang play */
  musicPlaying: boolean;
  /** true saat cover card slide 2 sudah tampil (video slide 2 kelar /
      fallback habis). Dipakai slide 3 untuk menyinkronkan animasi bunga
      pembatas slide 2↔3 supaya muncul bareng cover card. */
  coverCardShown: boolean;
  /** pindah ke slide tertentu */
  goTo: (slide: SlideId) => void;
  /** buka undangan — menandai opened, pindah ke slide berikutnya, start music */
  openInvitation: () => void;
  /** toggle music play/pause */
  toggleMusic: () => void;
  /** set music playing state (dipanggil dari audio element onPlay/onPause) */
  setMusicPlaying: (v: boolean) => void;
  /** tandai cover card slide 2 sudah muncul (dipanggil dari Slide2) */
  setCoverCardShown: (v: boolean) => void;
}

export const useInvitation = create<InvitationState>((set) => ({
  current: "cover",
  opened: false,
  musicPlaying: false,
  coverCardShown: false,
  goTo: (slide) => set({ current: slide }),
  openInvitation: () =>
    set((state) => ({
      opened: true,
      current: state.current === "cover" ? "slide-2" : state.current,
      // start music when the invitation is opened (autoplay on user gesture)
      musicPlaying: true,
      // reset — bunga pembatas slide 2↔3 harus sinkron ulang dengan
      // cover card yang muncul setelah video diputar ulang
      coverCardShown: false,
    })),
  toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
  setMusicPlaying: (v) => set({ musicPlaying: v }),
  setCoverCardShown: (v) => set({ coverCardShown: v }),
}));
