import type { NextConfig } from "next";

// Saat membangun untuk Electron (lihat script "build:electron" di
// package.json), Next.js diekspor menjadi berkas statis murni (folder
// "out") karena seluruh halaman aplikasi ini adalah client component tanpa
// API routes maupun fitur server-only, sehingga tidak memerlukan Node
// server saat berjalan sebagai aplikasi desktop.
const isElectronBuild = process.env.BUILD_TARGET === "electron";

const nextConfig: NextConfig = {
  ...(isElectronBuild
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
