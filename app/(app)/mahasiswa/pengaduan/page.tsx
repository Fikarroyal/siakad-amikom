"use client";

import { MessageSquareWarning } from "lucide-react";
import { PengajuanLayananManager } from "@/components/academic/pengajuan-layanan";

export default function PengaduanPage() {
  return (
    <PengajuanLayananManager
      storageKey="pengaduan"
      pageTitle="Pengaduan & Saran"
      pageDescription="Sampaikan keluhan, kritik, atau saran Anda kepada kampus"
      icon={MessageSquareWarning}
      jenisLabel="Kategori"
      jenisOptions={["Akademik", "Fasilitas Kampus", "Layanan Administrasi", "Lainnya"]}
      jenisPlaceholder="Pilih kategori pengaduan"
      catatanLabel="Isi Pengaduan/Saran"
      catatanPlaceholder="Tuliskan pengaduan atau saran Anda secara jelas..."
      addLabel="Kirim Pengaduan"
      logLabel="Mengirim pengaduan/saran"
    />
  );
}
