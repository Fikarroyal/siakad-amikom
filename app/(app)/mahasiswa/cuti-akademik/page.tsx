"use client";

import { CalendarOff } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function CutiAkademikPage() {
  return (
    <PengajuanLayananManager
      storageKey="cuti-akademik"
      pageTitle="Cuti Akademik"
      pageDescription="Ajukan permohonan cuti akademik untuk semester berjalan"
      icon={CalendarOff}
      jenisLabel="Jenis Cuti"
      jenisOptions={["Cuti Sakit", "Cuti Alasan Keluarga", "Cuti Alasan Ekonomi", "Cuti Lainnya"]}
      jenisPlaceholder="Pilih jenis cuti"
      catatanLabel="Alasan Pengajuan"
      catatanPlaceholder="Jelaskan alasan pengajuan cuti akademik..."
      addLabel="Ajukan Cuti"
      logLabel="Mengajukan cuti akademik"
    />
  );
}
