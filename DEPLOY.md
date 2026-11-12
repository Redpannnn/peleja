# Panduan Deploy — Undangan Yayak & Eci

Ada 2 file zip yang disiapkan:

## 1. `yayak-eci-deploy.zip` — PALING MUDAH (tanpa setup)

Isi: hasil build statis (ada `index.html` di root zip). Undangan jalan 100%:
cover, video, mempelai, acara, galeri, story, gift, RSVP, penutup, musik.

Cara deploy — pilih salah satu:

- **Netlify Drop**: buka `app.netlify.com/drop` → tarik-taruh file zip ini
  → langsung jadi (gratis, dapat URL, bisa ganti nama situs).
- **Cloudflare Pages**: dash.cloudflare.com → Workers & Pages → Create →
  Pages → Upload assets → upload isi zip.
- **Vercel**: akun gratis → `vercel deploy` dari folder hasil ekstrak zip
  (butuh Node.js + `npm i -g vercel`), atau push ke GitHub lalu import.

Catatan mode statis: RSVP & daftar tamu disimpan di **localStorage browser**
(karena tidak ada server database). Ucapan tetap tampil di perangkat tamu yang
bersangkutan, dan halaman `?manage` tetap bisa dipakai untuk mengelola daftar
tamu + membuat link undangan `?to=nama-tamu` (nama otomatis dirapikan).

## 2. `yayak-eci-source.zip` — source code lengkap (ada backend)

Untuk deploy penuh dengan database (RSVP tersimpan server, semua tamu terlihat
di satu tempat):

1. Ekstrak → push ke repositori GitHub.
2. Import di Vercel (vercel.com/new) → Framework: Next.js → Deploy.
3. RSVP server membutuhkan database libSQL/Turso:
   - Buat database gratis di turso.tech, lalu di Vercel → Settings →
     Environment Variables tambahkan:
     - `DATABASE_URL` = `libsql://<nama-db>-<user>.turso.io`
     - `DATABASE_AUTH_TOKEN` = token dari Turso
   - Tanpa variabel ini, halaman undangan tetap jalan; RSVP otomatis
     fallback ke localStorage.

Menjalankan lokal: `bun install` → `bun run dev` → http://localhost:3000
Build statis lagi: `bun run build:static` → hasil di `.next-static/`
