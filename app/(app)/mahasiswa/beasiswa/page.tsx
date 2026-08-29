"use client";

import { Award } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function BeasiswaPage() {
  return (
    <PengajuanLayananManager
      storageKey="beasiswa"
      pageTitle="Beasiswa"
      pageDescription="Ajukan pendaftaran beasiswa yang tersedia untuk mahasiswa"
      icon={Award}
      jenisLabel="Program Beasiswa"
      jenisOptions={[
        "Beasiswa Prestasi Akademik",
        "Beasiswa Kartu Indonesia Pintar Kuliah",
        "Beasiswa Bantuan Ekonomi",
        "Beasiswa Mitra Industri",
      ]}
      jenisPlaceholder="Pilih program beasiswa"
      catatanLabel="Motivasi Pengajuan"
      catatanPlaceholder="Jelaskan alasan dan kelayakan Anda mengajukan beasiswa ini..."
      addLabel="Ajukan Beasiswa"
      logLabel="Mengajukan beasiswa"
    />
  );
}
