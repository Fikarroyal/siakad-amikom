"use client";

import { KatalogGabungManager, type KatalogItem } from "@/components/academic/katalog-gabung";

const DAFTAR_KEGIATAN: KatalogItem[] = [
  { id: "keg-1", judul: "Seminar Nasional Teknologi AI", subjudul: "15 September 2026 · Aula Utama", deskripsi: "Seminar menghadirkan praktisi industri membahas tren kecerdasan buatan terkini.", badge: "Akademik" },
  { id: "keg-2", judul: "Pekan Olahraga Mahasiswa", subjudul: "20-25 September 2026 · GOR Kampus", deskripsi: "Kompetisi olahraga antar fakultas dalam rangka Dies Natalis universitas." },
  { id: "keg-3", judul: "Job Fair & Career Expo", subjudul: "3 Oktober 2026 · Gedung Serbaguna", deskripsi: "Bursa kerja tahunan menghadirkan puluhan perusahaan mitra kampus.", badge: "Karier" },
  { id: "keg-4", judul: "Pelatihan Public Speaking", subjudul: "10 Oktober 2026 · Ruang B301", deskripsi: "Workshop pengembangan soft skill komunikasi dan presentasi." },
  { id: "keg-5", judul: "Bakti Sosial Mahasiswa", subjudul: "18 Oktober 2026 · Desa Binaan", deskripsi: "Kegiatan pengabdian masyarakat bersama himpunan mahasiswa." },
  { id: "keg-6", judul: "Kompetisi Startup Kampus", subjudul: "1 November 2026 · Innovation Hub", deskripsi: "Ajang kompetisi ide bisnis mahasiswa dengan hadiah pendanaan awal.", badge: "Kompetisi" },
];

export default function KegiatanKampusPage() {
  return (
    <KatalogGabungManager
      storageKey="kegiatan-kampus"
      pageTitle="Kegiatan Kampus"
      pageDescription="Daftar dan ikuti berbagai kegiatan kampus terkini"
      items={DAFTAR_KEGIATAN}
      aksiLabel="Daftar"
      aksiBatalLabel="Batalkan"
      logLabel="Mendaftar kegiatan kampus"
    />
  );
}
