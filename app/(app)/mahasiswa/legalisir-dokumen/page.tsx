"use client";

import { Stamp } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function LegalisirDokumenPage() {
  return (
    <PengajuanLayananManager
      storageKey="legalisir-dokumen"
      pageTitle="Legalisir Dokumen"
      pageDescription="Ajukan legalisir ijazah, transkrip, atau dokumen akademik lainnya"
      icon={Stamp}
      jenisLabel="Jenis Dokumen"
      jenisOptions={["Ijazah", "Transkrip Nilai", "Sertifikat Akreditasi Prodi", "Dokumen Lainnya"]}
      jenisPlaceholder="Pilih jenis dokumen"
      catatanLabel="Jumlah Salinan & Keperluan"
      catatanPlaceholder="Sebutkan jumlah salinan yang dibutuhkan dan untuk keperluan apa..."
      addLabel="Ajukan Legalisir"
      logLabel="Mengajukan legalisir dokumen"
    />
  );
}
