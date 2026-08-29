"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "siakad_session";

export default function RootPage() {
  const router = useRouter();

  React.useEffect(() => {
    let tujuan = "/login";
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) tujuan = "/dashboard";
    } catch {
      // localStorage tidak tersedia — tetap arahkan ke halaman login
    }
    router.replace(tujuan);

    // Jaring pengaman: jika navigasi client-side gagal karena alasan apa pun,
    // paksa pindah halaman penuh agar tidak macet di halaman kosong.
    const timeout = setTimeout(() => {
      if (window.location.pathname === "/") {
        window.location.href = tujuan;
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [router]);

  return null;
}
