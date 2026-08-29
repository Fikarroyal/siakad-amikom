import { makeRng, generateNamaLengkap, KOTA_ASAL } from "./seed";
import type {
  Fakultas,
  ProgramStudi,
  Dosen,
  MataKuliah,
  Ruangan,
  Mahasiswa,
  SemesterAkademik,
  KelasKuliah,
  HariKuliah,
  StatusAkademikMahasiswa,
} from "@/lib/types";

const rng = makeRng(20260821);

// ---------------------------------------------------------------------------
// 1. FAKULTAS
// ---------------------------------------------------------------------------
const NAMA_FAKULTAS = [
  "Fakultas Ilmu Komputer",
  "Fakultas Teknik",
  "Fakultas Ekonomi dan Bisnis",
  "Fakultas Kedokteran",
  "Fakultas Hukum",
  "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  "Fakultas Ilmu Sosial dan Ilmu Politik",
  "Fakultas Psikologi",
  "Fakultas Pertanian",
  "Fakultas Seni Rupa dan Desain",
];

export const fakultasList: Fakultas[] = NAMA_FAKULTAS.map((nama, i) => ({
  id: `fak-${i + 1}`,
  kode: nama
    .replace("Fakultas", "F")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase(),
  nama,
  dekan: `Prof. Dr. ${generateNamaLengkap(rng)}, M.T.`,
  jumlahProdi: 0, // dihitung ulang setelah prodi dibuat
}));

// ---------------------------------------------------------------------------
// 2. PROGRAM STUDI
// ---------------------------------------------------------------------------
const PRODI_PER_FAKULTAS: Record<string, { nama: string; jenjang: ProgramStudi["jenjang"] }[]> = {
  "fak-1": [
    { nama: "Teknik Informatika", jenjang: "S1" },
    { nama: "Sistem Informasi", jenjang: "S1" },
    { nama: "Ilmu Data", jenjang: "S1" },
  ],
  "fak-2": [
    { nama: "Teknik Sipil", jenjang: "S1" },
    { nama: "Teknik Elektro", jenjang: "S1" },
    { nama: "Teknik Mesin", jenjang: "S1" },
  ],
  "fak-3": [
    { nama: "Manajemen", jenjang: "S1" },
    { nama: "Akuntansi", jenjang: "S1" },
    { nama: "Ekonomi Pembangunan", jenjang: "S1" },
  ],
  "fak-4": [
    { nama: "Pendidikan Dokter", jenjang: "S1" },
    { nama: "Farmasi", jenjang: "S1" },
  ],
  "fak-5": [{ nama: "Ilmu Hukum", jenjang: "S1" }],
  "fak-6": [
    { nama: "Matematika", jenjang: "S1" },
    { nama: "Fisika", jenjang: "S1" },
    { nama: "Biologi", jenjang: "S1" },
  ],
  "fak-7": [
    { nama: "Ilmu Komunikasi", jenjang: "S1" },
    { nama: "Hubungan Internasional", jenjang: "S1" },
    { nama: "Sosiologi", jenjang: "S1" },
  ],
  "fak-8": [{ nama: "Psikologi", jenjang: "S1" }],
  "fak-9": [
    { nama: "Agroteknologi", jenjang: "S1" },
    { nama: "Peternakan", jenjang: "S1" },
  ],
  "fak-10": [
    { nama: "Desain Komunikasi Visual", jenjang: "S1" },
    { nama: "Desain Produk", jenjang: "S1" },
  ],
};

export const prodiList: ProgramStudi[] = [];
let prodiCounter = 1;
for (const [fakultasId, daftar] of Object.entries(PRODI_PER_FAKULTAS)) {
  for (const p of daftar) {
    prodiList.push({
      id: `prodi-${prodiCounter}`,
      kode: p.nama
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      nama: p.nama,
      jenjang: p.jenjang,
      fakultasId,
      kaprodi: `Dr. ${generateNamaLengkap(rng)}, M.Kom.`,
      akreditasi: rng.pick(["Unggul", "Baik Sekali", "A", "B"] as const),
    });
    prodiCounter++;
  }
}

fakultasList.forEach((f) => {
  f.jumlahProdi = prodiList.filter((p) => p.fakultasId === f.id).length;
});

// ---------------------------------------------------------------------------
// 3. DOSEN (50)
// ---------------------------------------------------------------------------
const JABATAN_AKADEMIK = [
  "Tenaga Pengajar",
  "Asisten Ahli",
  "Lektor",
  "Lektor Kepala",
  "Guru Besar",
];

const JUMLAH_DOSEN = 247;
export const dosenList: Dosen[] = Array.from({ length: JUMLAH_DOSEN }).map((_, i) => {
  const prodi = rng.pick(prodiList);
  const gender = rng.pick(["L", "P"] as const);
  return {
    id: `dsn-${i + 1}`,
    nidn: `00${rng.int(10, 29)}${rng.int(1, 12).toString().padStart(2, "0")}${rng.int(70, 92)}`,
    nama: `${generateNamaLengkap(rng, gender)}${rng.bool(0.3) ? ", S.Kom., M.T." : ", M.Kom."}`,
    email: `dosen${i + 1}@university.ac.id`,
    jabatanAkademik: rng.pick(JABATAN_AKADEMIK),
    fakultasId: prodi.fakultasId,
    prodiId: prodi.id,
    status: rng.bool(0.95) ? "aktif" : "nonaktif",
  };
});

// ---------------------------------------------------------------------------
// 4. MATA KULIAH (150)
// ---------------------------------------------------------------------------
const TOPIK_MATKUL: Record<string, string[]> = {
  default: [
    "Pengantar", "Dasar-Dasar", "Metodologi Penelitian", "Statistika",
    "Manajemen Proyek", "Etika Profesi", "Kewirausahaan", "Praktik Kerja Lapangan",
    "Seminar", "Tugas Akhir I", "Tugas Akhir II", "Kapita Selekta",
  ],
  "Teknik Informatika": [
    "Algoritma dan Pemrograman", "Struktur Data", "Basis Data", "Jaringan Komputer",
    "Rekayasa Perangkat Lunak", "Kecerdasan Buatan", "Sistem Operasi", "Pemrograman Web",
    "Pemrograman Mobile", "Keamanan Siber", "Pembelajaran Mesin", "Komputasi Awan",
    "Interaksi Manusia dan Komputer", "Sistem Terdistribusi",
  ],
  "Sistem Informasi": [
    "Analisis dan Perancangan Sistem", "Manajemen Basis Data", "Sistem Enterprise",
    "Tata Kelola TI", "Manajemen Proyek TI", "Arsitektur Sistem Informasi",
    "E-Business", "Audit Sistem Informasi",
  ],
  "Ilmu Data": [
    "Dasar Sains Data", "Visualisasi Data", "Big Data", "Penambangan Data",
    "Statistika Komputasi", "Pembelajaran Mesin Lanjut", "Pemrosesan Bahasa Alami",
  ],
  Manajemen: [
    "Manajemen Pemasaran", "Manajemen Keuangan", "Manajemen SDM", "Manajemen Operasi",
    "Perilaku Organisasi", "Bisnis Internasional", "Manajemen Strategik",
  ],
  Akuntansi: [
    "Akuntansi Keuangan", "Akuntansi Biaya", "Akuntansi Manajemen", "Perpajakan",
    "Auditing", "Sistem Informasi Akuntansi", "Akuntansi Sektor Publik",
  ],
};

const JUMLAH_MATA_KULIAH = 247;
export const mataKuliahList: MataKuliah[] = [];
let matkulCounter = 1;
const targetPerProdi = Math.ceil(JUMLAH_MATA_KULIAH / prodiList.length);
for (const prodi of prodiList) {
  const topikKhusus = TOPIK_MATKUL[prodi.nama] ?? [];
  const topikGabungan = [...topikKhusus, ...TOPIK_MATKUL.default];
  for (let i = 0; i < targetPerProdi && matkulCounter <= JUMLAH_MATA_KULIAH; i++) {
    const semester = rng.int(1, 8);
    const namaTopik = topikGabungan[i % topikGabungan.length];
    mataKuliahList.push({
      id: `mk-${matkulCounter}`,
      kode: `${prodi.kode}${semester}${(i + 1).toString().padStart(2, "0")}`,
      nama: namaTopik,
      sks: rng.pick([2, 2, 3, 3, 3, 4]),
      semester,
      prodiId: prodi.id,
      deskripsi: `Mata kuliah ${namaTopik} pada program studi ${prodi.nama}.`,
    });
    matkulCounter++;
  }
}

// ---------------------------------------------------------------------------
// 5. RUANGAN (30)
// ---------------------------------------------------------------------------
const GEDUNG = ["A", "B", "C", "D", "E"];
const JUMLAH_RUANGAN = 247;
export const ruanganList: Ruangan[] = Array.from({ length: JUMLAH_RUANGAN }).map((_, i) => {
  const gedung = GEDUNG[i % GEDUNG.length];
  const lantai = rng.int(1, 4);
  const jenis = rng.pick(["kelas", "kelas", "kelas", "laboratorium", "aula"] as const);
  const nomor = (i + 1).toString().padStart(3, "0");
  return {
    id: `rg-${i + 1}`,
    kode: `${gedung}${lantai}-${nomor}`,
    nama: jenis === "laboratorium" ? `Laboratorium ${gedung}${lantai}-${nomor}` : `Ruang ${gedung}${lantai}-${nomor}`,
    gedung: `Gedung ${gedung}`,
    kapasitas: jenis === "aula" ? rng.int(80, 150) : rng.int(30, 45),
    jenis,
  };
});

// ---------------------------------------------------------------------------
// 6. SEMESTER AKADEMIK
// ---------------------------------------------------------------------------
export const semesterList: SemesterAkademik[] = [
  { id: "sem-2023-genap", nama: "Genap 2023/2024", tahunAkademik: "2023/2024", jenis: "Genap", tanggalMulai: "2024-02-01", tanggalSelesai: "2024-06-30", isAktif: false },
  { id: "sem-2024-ganjil", nama: "Ganjil 2024/2025", tahunAkademik: "2024/2025", jenis: "Ganjil", tanggalMulai: "2024-09-01", tanggalSelesai: "2025-01-31", isAktif: false },
  { id: "sem-2024-genap", nama: "Genap 2024/2025", tahunAkademik: "2024/2025", jenis: "Genap", tanggalMulai: "2025-02-01", tanggalSelesai: "2025-06-30", isAktif: false },
  { id: "sem-2025-ganjil", nama: "Ganjil 2025/2026", tahunAkademik: "2025/2026", jenis: "Ganjil", tanggalMulai: "2025-09-01", tanggalSelesai: "2026-01-31", isAktif: false },
  { id: "sem-2025-genap", nama: "Genap 2025/2026", tahunAkademik: "2025/2026", jenis: "Genap", tanggalMulai: "2026-02-01", tanggalSelesai: "2026-06-30", isAktif: false },
  { id: "sem-2026-ganjil", nama: "Ganjil 2026/2027", tahunAkademik: "2026/2027", jenis: "Ganjil", tanggalMulai: "2026-09-01", tanggalSelesai: "2027-01-31", isAktif: true },
];
export const semesterAktif = semesterList.find((s) => s.isAktif)!;

// ---------------------------------------------------------------------------
// 7. MAHASISWA (500)
// ---------------------------------------------------------------------------
function hitungSemester(angkatan: number) {
  const tahunSekarang = 2026;
  const bulanSekarang = 8;
  let semester = (tahunSekarang - angkatan) * 2 + (bulanSekarang >= 8 ? 1 : 0);
  return Math.min(Math.max(semester, 1), 14);
}

const JUMLAH_MAHASISWA = 247;
export const mahasiswaList: Mahasiswa[] = Array.from({ length: JUMLAH_MAHASISWA }).map((_, i) => {
  const prodi = rng.pick(prodiList);
  const angkatan = rng.pick([2021, 2022, 2023, 2024, 2025, 2026]);
  const semesterAktifMhs = hitungSemester(angkatan);
  const gender = rng.pick(["L", "P"] as const);
  const statusRoll = rng.rand();
  let status: StatusAkademikMahasiswa = "aktif";
  if (semesterAktifMhs > 8 && statusRoll < 0.12) status = "lulus";
  else if (statusRoll < 0.03) status = "cuti";
  else if (statusRoll < 0.05) status = "nonaktif";
  else if (statusRoll < 0.06 && semesterAktifMhs > 10) status = "drop_out";

  const ipk = rng.float(2.5, 3.95, 2);
  return {
    id: `mhs-${i + 1}`,
    nim: `${prodi.kode.slice(0, 2)}${angkatan.toString().slice(2)}${(i + 1).toString().padStart(4, "0")}`,
    nama: generateNamaLengkap(rng, gender),
    email: `mhs${i + 1}@student.university.ac.id`,
    prodiId: prodi.id,
    fakultasId: prodi.fakultasId,
    angkatan,
    semesterAktif: Math.min(semesterAktifMhs, 14),
    ipk,
    ips: rng.float(Math.max(2.3, ipk - 0.4), Math.min(4, ipk + 0.4), 2),
    totalSks: 144,
    sksDitempuh: Math.min(144, semesterAktifMhs * rng.int(18, 22)),
    status,
    noTelepon: `08${rng.int(11, 99)}${rng.int(1000, 9999)}${rng.int(1000, 9999)}`,
    alamat: `Jl. ${rng.pick(["Merdeka", "Sudirman", "Diponegoro", "Gatot Subroto", "Ahmad Yani"])} No. ${rng.int(1, 200)}, ${rng.pick(KOTA_ASAL)}`,
  };
});

// ---------------------------------------------------------------------------
// 8. KELAS KULIAH (untuk semester aktif)
// ---------------------------------------------------------------------------
const HARI: HariKuliah[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const SLOT_JAM = [
  ["07:30", "09:10"],
  ["09:10", "10:50"],
  ["10:50", "12:30"],
  ["13:00", "14:40"],
  ["14:40", "16:20"],
  ["16:20", "18:00"],
];

export const kelasKuliahList: KelasKuliah[] = [];
let kelasCounter = 1;
for (const mk of mataKuliahList) {
  const jumlahKelas = rng.pick([1, 1, 2]);
  const dosenKandidat = dosenList.filter((d) => d.prodiId === mk.prodiId);
  for (let k = 0; k < jumlahKelas; k++) {
    const dosen = dosenKandidat.length > 0 ? rng.pick(dosenKandidat) : rng.pick(dosenList);
    const slot = rng.pick(SLOT_JAM);
    const ruangan = rng.pick(ruanganList);
    const kuota = rng.pick([30, 35, 40]);
    kelasKuliahList.push({
      id: `kls-${kelasCounter}`,
      mataKuliahId: mk.id,
      kode: String.fromCharCode(65 + k),
      dosenId: dosen.id,
      hari: rng.pick(HARI),
      jamMulai: slot[0],
      jamSelesai: slot[1],
      ruangan: ruangan.kode,
      kuota,
      terisi: rng.int(Math.floor(kuota * 0.5), kuota),
      semesterAkademikId: semesterAktif.id,
    });
    kelasCounter++;
  }
}

export function getFakultasById(id: string) {
  return fakultasList.find((f) => f.id === id);
}
export function getProdiById(id: string) {
  return prodiList.find((p) => p.id === id);
}
export function getDosenById(id: string) {
  return dosenList.find((d) => d.id === id);
}
export function getMataKuliahById(id: string) {
  return mataKuliahList.find((m) => m.id === id);
}
export function getKelasById(id: string) {
  return kelasKuliahList.find((k) => k.id === id);
}
export function getMahasiswaById(id: string) {
  return mahasiswaList.find((m) => m.id === id);
}
