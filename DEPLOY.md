# Panduan Deploy — Undangan Yayak & Eci

## Deploy ke Vercel (cara yang kamu pakai sekarang)

Repo GitHub: github.com/Redpannnn/peleja → Vercel build otomatis.

**PENTING — supaya tidak error "Module not found" lagi:**

1. Hapus DULU semua isi repo lama di GitHub (biar tidak ada file sisa lama).
2. Ekstrak zip ini → upload SEMUA file & folder di dalamnya ke root repo.
   Root repo harus berisi: `package.json`, `next.config.ts`, `src/`,
   `prisma/`, `public/`, `bun.lock`, dst. (jangan sampai ada yang
   terlewat saat drag ke GitHub web).
3. Commit → Vercel otomatis rebuild → sukses.

Build di Vercel: `bun install` → `next build` (Next.js 16). Tidak perlu
setting apapun — framework otomatis terdeteksi.

## Soal RSVP & Daftar Tamu

Halaman undangan, link tamu (`?to=nama-tamu`), dan semua slide jalan 100%.

- **Tanpa database** (default): RSVP & daftar tamu otomatis disimpan di
  localStorage browser. Halaman `?manage` menampilkan banner "Mode Offline"
  — daftar tamu tersimpan per-browser, tapi link undangan & pesan WhatsApp
  tetap berfungsi normal untuk semua tamu.
- **Dengan database (opsional, RSVP tersimpan di server):** buat database
  gratis di turso.tech, lalu di Vercel → Project → Settings → Environment
  Variables tambahkan:
  - `DATABASE_URL` = `libsql://<nama-db>-<user>.turso.io`
  - `DATABASE_AUTH_TOKEN` = token dari Turso
  Setelah itu Redeploy. Tanpa dua variabel ini, semuanya tetap jalan
  (mode offline di atas).

## Plan B — kalau build di Vercel gagal (jarang terjadi)

Folder `static-version/` di dalam zip ini adalah website versi statis yang
sudah jadi. Isinya bisa langsung di-upload ke:

- Netlify Drop (`app.netlify.com/drop`) — tarik-taruh → langsung online
- Cloudflare Pages → Upload assets

(Workflow: jangan upload folder `static-version/` ke GitHub bareng source —
itu hanya cadangan. Boleh juga ikut ter-upload, Vercel mengabaikannya.)

## Jalan lokal (kalau perlu)

```
bun install
bun run dev      → http://localhost:3000
```

Build ulang versi statis: `bun run build:static` → hasil di `.next-static/`
