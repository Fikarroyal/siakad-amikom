"use client";

import { UserCog } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function DosenWaliPage() {
  return (
    <PengajuanLayananManager
      storageKey="dosen-wali"
      pageTitle="Dosen Wali & Konsultasi"
      pageDescription="Ajukan sesi bimbingan akademik dengan dosen wali Anda"
      icon={UserCog}
      jenisLabel="Topik Bimbingan"
      jenisOptions={["Konsultasi KRS", "Konsultasi Akademik", "Konsultasi Tugas Akhir", "Lainnya"]}
      jenisPlaceholder="Pilih topik bimbingan"
      catatanLabel="Catatan untuk Dosen Wali"
      catatanPlaceholder="Jelaskan hal yang ingin Anda konsultasikan..."
      addLabel="Ajukan Bimbingan"
      logLabel="Mengajukan bimbingan dosen wali"
    />
  );
}
