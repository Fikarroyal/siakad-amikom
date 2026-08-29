"use client";

import { GraduationCap } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function WisudaPage() {
  return (
    <PengajuanLayananManager
      storageKey="wisuda"
      pageTitle="Pendaftaran Wisuda"
      pageDescription="Daftarkan diri Anda pada periode wisuda yang tersedia"
      icon={GraduationCap}
      jenisLabel="Periode Wisuda"
      jenisOptions={["Wisuda Periode November 2026", "Wisuda Periode Maret 2027", "Wisuda Periode Juli 2027"]}
      jenisPlaceholder="Pilih periode wisuda"
      catatanLabel="Catatan Tambahan"
      catatanPlaceholder="Contoh: jumlah undangan tamu, kebutuhan toga, atau catatan lainnya..."
      addLabel="Daftar Wisuda"
      logLabel="Mendaftar wisuda"
    />
  );
}
