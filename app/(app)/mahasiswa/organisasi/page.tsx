"use client";

import { KatalogGabungManager, type KatalogItem } from "@/components/academic/katalog-gabung";

const DAFTAR_UKM: KatalogItem[] = [
  { id: "ukm-1", judul: "Himpunan Mahasiswa Informatika", subjudul: "Organisasi Prodi", deskripsi: "Wadah aspirasi dan pengembangan minat bakat mahasiswa Teknik Informatika.", badge: "Populer" },
  { id: "ukm-2", judul: "UKM Bola Basket", subjudul: "Olahraga", deskripsi: "Latihan rutin dua kali seminggu dan mengikuti kejuaraan antar universitas." },
  { id: "ukm-3", judul: "UKM Paduan Suara", subjudul: "Seni & Budaya", deskripsi: "Mengisi acara resmi kampus dan mengikuti kompetisi paduan suara nasional." },
  { id: "ukm-4", judul: "UKM Pecinta Alam", subjudul: "Petualangan", deskripsi: "Kegiatan pendakian, konservasi lingkungan, dan pelatihan survival." },
  { id: "ukm-5", judul: "UKM Robotika", subjudul: "Sains & Teknologi", deskripsi: "Riset dan kompetisi robotika tingkat nasional dan internasional.", badge: "Prestasi" },
  { id: "ukm-6", judul: "UKM Kewirausahaan", subjudul: "Bisnis", deskripsi: "Inkubasi bisnis mahasiswa dan pelatihan kewirausahaan rutin." },
  { id: "ukm-7", judul: "UKM Fotografi & Videografi", subjudul: "Seni & Media", deskripsi: "Dokumentasi kegiatan kampus dan pelatihan fotografi/videografi." },
  { id: "ukm-8", judul: "UKM Bahasa Asing", subjudul: "Akademik", deskripsi: "Klub percakapan dan persiapan sertifikasi bahasa Inggris, Jepang, dan Mandarin." },
];

export default function OrganisasiPage() {
  return (
    <KatalogGabungManager
      storageKey="organisasi"
      pageTitle="Organisasi & UKM"
      pageDescription="Jelajahi dan bergabung dengan unit kegiatan mahasiswa"
      items={DAFTAR_UKM}
      aksiLabel="Gabung"
      aksiBatalLabel="Keluar"
      logLabel="Bergabung dengan organisasi/UKM"
    />
  );
}
