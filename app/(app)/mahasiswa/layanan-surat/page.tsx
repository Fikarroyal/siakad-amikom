"use client";

import { FileSignature } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function LayananSuratPage() {
  return (
    <PengajuanLayananManager
      storageKey="layanan-surat"
      pageTitle="Layanan Surat"
      pageDescription="Ajukan surat keterangan akademik secara daring"
      icon={FileSignature}
      jenisLabel="Jenis Surat"
      jenisOptions={[
        "Surat Keterangan Aktif Kuliah",
        "Surat Keterangan Lulus",
        "Surat Rekomendasi Beasiswa",
        "Surat Keterangan Cuti",
        "Surat Pengantar Magang",
      ]}
      jenisPlaceholder="Pilih jenis surat"
      catatanLabel="Keperluan"
      catatanPlaceholder="Jelaskan untuk keperluan apa surat ini dibutuhkan..."
      addLabel="Ajukan Surat"
      logLabel="Mengajukan layanan surat"
    />
  );
}
