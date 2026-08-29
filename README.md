# SIAKAD Universitas AMIKOM Yogyakarta

Sistem Informasi Akademik, "Satu Platform untuk Seluruh Kebutuhan Akademik". Aplikasi ini berfokus pada **dashboard dan layanan mahasiswa**, dan dapat dijalankan sebagai web maupun aplikasi desktop Windows.

Dibangun dengan Next.js 16 (App Router), TypeScript, Tailwind CSS v4, komponen bergaya shadcn/ui, Lucide Icons, React Hook Form + Zod, Recharts, dan Electron untuk versi desktop.

## Menjalankan Sebagai Web

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Build produksi: `npm run build && npm run start`.

## Menjalankan Sebagai Aplikasi Desktop (Electron)

```bash
npm install
npm run electron:dev
```

Perintah ini menjalankan Next.js dev server dan membuka jendela Electron yang memuatnya. Build installer Windows:

```bash
npm run electron:build            # NSIS installer + portable
npm run electron:build:installer  # hanya NSIS installer (.exe)
npm run electron:build:portable   # hanya versi portable (.exe)
```

Hasil build ada di folder `dist/`: `SIAKAD-Universitas-Setup.exe` (installer) dan `SIAKAD-Universitas-Portable.exe`. Build Windows (NSIS) sebaiknya dijalankan di mesin Windows atau lewat CI Windows; `electron-builder` dari Linux/macOS bisa menghasilkan target `portable` tetapi target `nsis` paling andal dibangun di Windows.

Aplikasi ini 100% client-side (tanpa API routes atau fitur server-only), sehingga versi desktop memakai `next build` mode **export statis** (folder `out/`) yang disajikan oleh server HTTP lokal minimal di dalam proses utama Electron (`electron/main.ts`), bukan membuka browser eksternal. Konfigurasi Electron mengikuti praktik aman: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, dengan jembatan `contextBridge` terbatas di `electron/preload.ts` (hanya mengekspos info versi & placeholder cek pembaruan, terlihat di Pengaturan → tab Tentang).
