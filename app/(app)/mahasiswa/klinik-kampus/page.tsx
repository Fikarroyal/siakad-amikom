"use client";

import { Stethoscope } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function KlinikKampusPage() {
  return (
    <PengajuanLayananManager
      storageKey="klinik-kampus"
      pageTitle="Klinik Kampus"
      pageDescription="Buat janji pemeriksaan kesehatan di klinik kampus"
      icon={Stethoscope}
      jenisLabel="Jenis Layanan"
      jenisOptions={["Pemeriksaan Umum", "Konsultasi Dokter", "Vaksinasi", "Surat Keterangan Sehat"]}
      jenisPlaceholder="Pilih jenis layanan"
      catatanLabel="Keluhan / Kebutuhan"
      catatanPlaceholder="Jelaskan keluhan atau kebutuhan pemeriksaan Anda..."
      addLabel="Buat Janji"
      logLabel="Membuat janji klinik kampus"
    />
  );
}
