"use client";

import { Briefcase } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function KerjaPraktikPage() {
  return (
    <PengajuanLayananManager
      storageKey="kerja-praktik"
      pageTitle="Kerja Praktik & Magang"
      pageDescription="Ajukan proposal kerja praktik atau magang di perusahaan mitra"
      icon={Briefcase}
      jenisLabel="Jenis Pengajuan"
      jenisOptions={["Kerja Praktik", "Magang Mandiri", "Magang MBKM", "Perpanjangan Magang"]}
      jenisPlaceholder="Pilih jenis pengajuan"
      catatanLabel="Nama Perusahaan & Rencana Kegiatan"
      catatanPlaceholder="Sebutkan nama perusahaan/instansi tujuan dan rencana kegiatan..."
      addLabel="Ajukan Kerja Praktik"
      logLabel="Mengajukan kerja praktik/magang"
    />
  );
}
