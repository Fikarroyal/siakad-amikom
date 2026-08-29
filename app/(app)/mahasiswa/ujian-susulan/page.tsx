"use client";

import { CalendarClock } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function UjianSusulanPage() {
  return (
    <PengajuanLayananManager
      storageKey="ujian-susulan"
      pageTitle="Ujian Susulan"
      pageDescription="Ajukan permohonan ujian susulan bila berhalangan hadir"
      icon={CalendarClock}
      jenisLabel="Jenis Ujian"
      jenisOptions={["UTS", "UAS", "Ujian Praktikum"]}
      jenisPlaceholder="Pilih jenis ujian"
      catatanLabel="Mata Kuliah & Alasan"
      catatanPlaceholder="Sebutkan mata kuliah dan alasan tidak dapat mengikuti ujian pada jadwal semula..."
      addLabel="Ajukan Ujian Susulan"
      logLabel="Mengajukan ujian susulan"
    />
  );
}
