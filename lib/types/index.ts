// Tipe data inti untuk SIAKAD Universitas.
// Struktur ini dirancang agar mudah dipetakan ke REST API / database nyata nanti.

export type Role =
  | "mahasiswa"
  | "dosen"
  | "admin_akademik"
  | "admin_fakultas"
  | "kaprodi"
  | "pimpinan";

export interface User {
  id: string;
  nama: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  noTelepon?: string;
  // Relasi opsional tergantung role
  mahasiswaId?: string;
  dosenId?: string;
  fakultasId?: string;
  prodiId?: string;
}

export interface Fakultas {
  id: string;
  kode: string;
  nama: string;
  dekan: string;
  jumlahProdi: number;
}

export interface ProgramStudi {
  id: string;
  kode: string;
  nama: string;
  jenjang: "D3" | "D4" | "S1" | "S2" | "S3";
  fakultasId: string;
  kaprodi: string;
  akreditasi: "Unggul" | "Baik Sekali" | "Baik" | "A" | "B";
}

export type StatusAkademikMahasiswa =
  | "aktif"
  | "cuti"
  | "lulus"
  | "nonaktif"
  | "drop_out";

export interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  email: string;
  fotoUrl?: string;
  prodiId: string;
  fakultasId: string;
  angkatan: number;
  semesterAktif: number;
  ipk: number;
  ips: number;
  totalSks: number;
  sksDitempuh: number;
  status: StatusAkademikMahasiswa;
  nik?: string;
  noTelepon?: string;
  alamat?: string;
  dosenWaliId?: string;
}

export interface Dosen {
  id: string;
  nidn: string;
  nama: string;
  email: string;
  fotoUrl?: string;
  jabatanAkademik: string;
  fakultasId: string;
  prodiId: string;
  status: "aktif" | "nonaktif";
}

export interface MataKuliah {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  prodiId: string;
  prasyarat?: string[];
  deskripsi?: string;
}

export type HariKuliah =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu";

export interface KelasKuliah {
  id: string;
  mataKuliahId: string;
  kode: string; // kelas A, B, C
  dosenId: string;
  hari: HariKuliah;
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
  kuota: number;
  terisi: number;
  semesterAkademikId: string;
}

export type StatusKrs = "draft" | "diajukan" | "disetujui" | "ditolak";

export interface KrsItem {
  id: string;
  mahasiswaId: string;
  kelasId: string;
  semesterAkademikId: string;
  status: StatusKrs;
}

export interface Nilai {
  id: string;
  mahasiswaId: string;
  kelasId: string;
  mataKuliahId: string;
  semesterAkademikId: string;
  nilaiAngka: number; // 0-100
  nilaiHuruf: "A" | "AB" | "B" | "BC" | "C" | "D" | "E";
  bobot: number; // 4, 3.5, 3, dst
  komponen?: {
    tugas: number;
    uts: number;
    uas: number;
    kehadiran: number;
  };
}

export type StatusKehadiran = "hadir" | "izin" | "sakit" | "alpha";

export interface Presensi {
  id: string;
  mahasiswaId: string;
  kelasId: string;
  tanggal: string;
  pertemuanKe: number;
  status: StatusKehadiran;
}

export interface SemesterAkademik {
  id: string;
  nama: string; // "Ganjil 2025/2026"
  tahunAkademik: string;
  jenis: "Ganjil" | "Genap" | "Pendek";
  tanggalMulai: string;
  tanggalSelesai: string;
  isAktif: boolean;
}

export type StatusTagihan = "paid" | "pending" | "unpaid" | "overdue";

export interface Tagihan {
  id: string;
  mahasiswaId: string;
  semesterAkademikId: string;
  jenis: string;
  jumlah: number;
  jatuhTempo: string;
  status: StatusTagihan;
  tanggalBayar?: string;
  metodePembayaran?: string;
  nomorInvoice: string;
}

export type TargetPengumuman =
  | "semua"
  | "fakultas"
  | "prodi"
  | "angkatan"
  | "dosen";

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori: "akademik" | "keuangan" | "umum" | "ujian";
  target: TargetPengumuman;
  targetDetail?: string;
  tanggalPublish: string;
  penulis: string;
  isPinned?: boolean;
}

export type JenisNotifikasi =
  | "krs_disetujui"
  | "krs_ditolak"
  | "nilai_tersedia"
  | "tagihan_baru"
  | "jadwal_berubah"
  | "pengingat_ujian"
  | "presensi_rendah"
  | "pengumuman";

export interface Notifikasi {
  id: string;
  userId: string;
  jenis: JenisNotifikasi;
  judul: string;
  pesan: string;
  waktu: string;
  isRead: boolean;
  link?: string;
}

export interface Ruangan {
  id: string;
  kode: string;
  nama: string;
  gedung: string;
  kapasitas: number;
  jenis: "kelas" | "laboratorium" | "aula";
}

export interface Tugas {
  id: string;
  kelasId: string;
  judul: string;
  deskripsi: string;
  tanggalDibuat: string;
  tenggat: string;
  totalPengumpulan: number;
  totalMahasiswa: number;
}

export interface Materi {
  id: string;
  kelasId: string;
  judul: string;
  jenis: "dokumen" | "video" | "tautan" | "presentasi";
  tanggalUpload: string;
  ukuranFile?: string;
}

export interface AktivitasLog {
  id: string;
  userId: string;
  aksi: string;
  waktu: string;
  ipAddress?: string;
  perangkat?: string;
}

export interface JadwalUjian {
  id: string;
  mataKuliahId: string;
  kelasId: string;
  jenis: "UTS" | "UAS";
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
  pengawas: string;
}
