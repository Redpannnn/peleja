#!/usr/bin/env node
/**
 * Build static export untuk deploy tanpa backend (drag-and-drop zip).
 *
 * Yang dilakukan:
 * 1. Memindahkan src/app/api → .api-backup-static (route handler dinamis
 *    tidak bisa di-export statis).
 * 2. Menjalankan `next build` dengan BUILD_STATIC=1 → hasil di `out/`.
 * 3. Mengembalikan src/app/api ke tempatnya, apa pun hasilnya.
 *
 * Jalankan dengan: bun run build:static
 */
import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const backupDir = path.join(root, ".api-backup-static");

const moved = existsSync(apiDir);
if (moved) {
  if (existsSync(backupDir)) {
    console.error("[build-static] .api-backup-static masih ada — build sebelumnya gagal bersih. Hapus dulu.");
    process.exit(1);
  }
  renameSync(apiDir, backupDir);
  console.log("[build-static] src/app/api dipindah sementara → .api-backup-static");
}

try {
  const res = spawnSync("bun", ["x", "next", "build"], {
    stdio: "inherit",
    env: { ...process.env, BUILD_STATIC: "1" },
    cwd: root,
  });
  if (res.status !== 0 || res.error) {
    console.error("[build-static] next build GAGAL.");
    process.exitCode = 1;
  }
} finally {
  if (moved && existsSync(backupDir)) {
    renameSync(backupDir, apiDir);
    console.log("[build-static] src/app/api dikembalikan.");
  }
}
