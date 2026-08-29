"use client";

import { HeartHandshake } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function BimbinganKonselingPage() {
  return (
    <PengajuanLayananManager
      storageKey="bimbingan-konseling"
      pageTitle="Bimbingan Konseling"
      pageDescription="Jadwalkan sesi konseling dengan konselor kampus secara rahasia"
      icon={HeartHandshake}
      jenisLabel="Jenis Konseling"
      jenisOptions={["Konseling Akademik", "Konseling Pribadi", "Konseling Karier"]}
      jenisPlaceholder="Pilih jenis konseling"
      catatanLabel="Ceritakan Secara Singkat"
      catatanPlaceholder="Tuliskan hal yang ingin dibicarakan (bersifat rahasia)..."
      addLabel="Jadwalkan Sesi"
      logLabel="Menjadwalkan sesi konseling"
    />
  );
}
