"use client";

import { KatalogGabungManager, type KatalogItem } from "@/components/academic/katalog-gabung";

const DAFTAR_SLOT: KatalogItem[] = [
  { id: "slot-1", judul: "Ruang Diskusi A1", subjudul: "Senin, 09:00 - 11:00", deskripsi: "Kapasitas 6 orang, dilengkapi papan tulis dan proyektor kecil.", badge: "Gedung A" },
  { id: "slot-2", judul: "Ruang Diskusi A1", subjudul: "Senin, 13:00 - 15:00", deskripsi: "Kapasitas 6 orang, dilengkapi papan tulis dan proyektor kecil.", badge: "Gedung A" },
  { id: "slot-3", judul: "Ruang Diskusi B2", subjudul: "Selasa, 10:00 - 12:00", deskripsi: "Kapasitas 8 orang, cocok untuk diskusi kelompok tugas besar.", badge: "Gedung B" },
  { id: "slot-4", judul: "Ruang Diskusi B2", subjudul: "Rabu, 14:00 - 16:00", deskripsi: "Kapasitas 8 orang, cocok untuk diskusi kelompok tugas besar.", badge: "Gedung B" },
  { id: "slot-5", judul: "Ruang Belajar Perpustakaan", subjudul: "Kamis, 09:00 - 11:00", deskripsi: "Ruang tenang di lantai 2 perpustakaan, cocok untuk belajar mandiri.", badge: "Perpustakaan" },
  { id: "slot-6", judul: "Ruang Belajar Perpustakaan", subjudul: "Jumat, 13:00 - 15:00", deskripsi: "Ruang tenang di lantai 2 perpustakaan, cocok untuk belajar mandiri.", badge: "Perpustakaan" },
  { id: "slot-7", judul: "Ruang Diskusi C3", subjudul: "Jumat, 15:00 - 17:00", deskripsi: "Kapasitas 10 orang, dilengkapi layar TV untuk presentasi kelompok.", badge: "Gedung C" },
  { id: "slot-8", judul: "Ruang Kolaborasi Inovasi Hub", subjudul: "Sabtu, 09:00 - 12:00", deskripsi: "Ruang terbuka untuk kerja kelompok lintas prodi dan kegiatan komunitas.", badge: "Innovation Hub" },
];

export default function RuangBelajarPage() {
  return (
    <KatalogGabungManager
      storageKey="ruang-belajar"
      pageTitle="Reservasi Ruang Belajar"
      pageDescription="Pesan slot ruang diskusi atau ruang belajar sesuai jadwal luang Anda"
      items={DAFTAR_SLOT}
      aksiLabel="Pesan"
      aksiBatalLabel="Batalkan"
      logLabel="Memesan ruang belajar"
    />
  );
}
