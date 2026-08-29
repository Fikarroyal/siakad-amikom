import { makeRng } from "./seed";
import {
  prodiList,
  fakultasList,
  dosenList,
  mataKuliahList,
  kelasKuliahList,
  mahasiswaList,
  semesterList,
  semesterAktif,
  getMataKuliahById,
} from "./generate";
import type {
  User,
  KrsItem,
  Nilai,
  Presensi,
  Tagihan,
  Pengumuman,
  Notifikasi,
  Tugas,
  Materi,
  Mahasiswa,
  Dosen,
} from "@/lib/types";

const rng = makeRng(778899);

// ---------------------------------------------------------------------------
// PRODI DEMO — Teknik Informatika dipakai sebagai "rumah" akun demo
// ---------------------------------------------------------------------------
const prodiDemo = prodiList.find((p) => p.nama === "Teknik Informatika")!;
const fakultasDemo = fakultasList.find((f) => f.id === prodiDemo.fakultasId)!;

// ---------------------------------------------------------------------------
// MAHASISWA DEMO
// ---------------------------------------------------------------------------
export const demoMahasiswa: Mahasiswa = {
  id: "mhs-demo",
  nim: "TI21230045",
  nama: "Raka Aditya Pratama",
  email: "student@university.ac.id",
  prodiId: prodiDemo.id,
  fakultasId: fakultasDemo.id,
  angkatan: 2023,
  semesterAktif: 6,
  ipk: 3.62,
  ips: 3.71,
  totalSks: 144,
  sksDitempuh: 96,
  status: "aktif",
  noTelepon: "081234567890",
  alamat: "Jl. Diponegoro No. 45, Bandung",
  dosenWaliId: "dsn-demo",
};
mahasiswaList.unshift(demoMahasiswa);

// ---------------------------------------------------------------------------
// DOSEN DEMO
// ---------------------------------------------------------------------------
export const demoDosen: Dosen = {
  id: "dsn-demo",
  nidn: "0012038501",
  nama: "Dr. Siti Nurhaliza Rahman, M.Kom.",
  email: "lecturer@university.ac.id",
  jabatanAkademik: "Lektor Kepala",
  fakultasId: fakultasDemo.id,
  prodiId: prodiDemo.id,
  status: "aktif",
};
dosenList.unshift(demoDosen);

// Alihkan beberapa kelas TI ke dosen demo supaya dashboard dosen terisi wajar
const kelasProdiDemo = kelasKuliahList.filter((k) => {
  const mk = getMataKuliahById(k.mataKuliahId);
  return mk?.prodiId === prodiDemo.id;
});
const kelasUntukDosenDemo = kelasProdiDemo.slice(0, 4);
kelasUntukDosenDemo.forEach((k) => (k.dosenId = demoDosen.id));

// ---------------------------------------------------------------------------
// USERS (akun login mock)
// ---------------------------------------------------------------------------
export const DEMO_PASSWORD = "demo1234";

export const users: User[] = [
  {
    id: "user-mhs",
    nama: demoMahasiswa.nama,
    email: "student@university.ac.id",
    role: "mahasiswa",
    mahasiswaId: demoMahasiswa.id,
    fakultasId: demoMahasiswa.fakultasId,
    prodiId: demoMahasiswa.prodiId,
  },
  {
    id: "user-dsn",
    nama: demoDosen.nama,
    email: "lecturer@university.ac.id",
    role: "dosen",
    dosenId: demoDosen.id,
    fakultasId: demoDosen.fakultasId,
    prodiId: demoDosen.prodiId,
  },
  {
    id: "user-admin",
    nama: "Andi Wijayanto",
    email: "admin@university.ac.id",
    role: "admin_akademik",
  },
  {
    id: "user-admin-fakultas",
    nama: "Dewi Anggraini",
    email: "adminfakultas@university.ac.id",
    role: "admin_fakultas",
    fakultasId: fakultasDemo.id,
  },
  {
    id: "user-kaprodi",
    nama: prodiDemo.kaprodi,
    email: "kaprodi@university.ac.id",
    role: "kaprodi",
    fakultasId: fakultasDemo.id,
    prodiId: prodiDemo.id,
  },
  {
    id: "user-pimpinan",
    nama: "Prof. Dr. Bambang Sutrisno, M.Sc.",
    email: "leader@university.ac.id",
    role: "pimpinan",
  },
];

export function getUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// ---------------------------------------------------------------------------
// KRS SEMESTER AKTIF (mahasiswa demo)
// ---------------------------------------------------------------------------
const matkulSemester6 = mataKuliahList.filter(
  (m) => m.prodiId === prodiDemo.id && m.semester === 6
);
const kelasSemester6 = kelasKuliahList.filter((k) =>
  matkulSemester6.some((m) => m.id === k.mataKuliahId)
);

export const krsAktif: KrsItem[] = kelasSemester6.slice(0, 6).map((k, i) => ({
  id: `krs-${i + 1}`,
  mahasiswaId: demoMahasiswa.id,
  kelasId: k.id,
  semesterAkademikId: semesterAktif.id,
  status: i === 5 ? "diajukan" : "disetujui",
}));

// ---------------------------------------------------------------------------
// RIWAYAT NILAI (5 semester sebelumnya, untuk grafik IPK/IPS)
// ---------------------------------------------------------------------------
const HURUF_DARI_ANGKA = (angka: number): { huruf: Nilai["nilaiHuruf"]; bobot: number } => {
  if (angka >= 85) return { huruf: "A", bobot: 4 };
  if (angka >= 80) return { huruf: "AB", bobot: 3.5 };
  if (angka >= 75) return { huruf: "B", bobot: 3 };
  if (angka >= 70) return { huruf: "BC", bobot: 2.5 };
  if (angka >= 65) return { huruf: "C", bobot: 2 };
  if (angka >= 50) return { huruf: "D", bobot: 1 };
  return { huruf: "E", bobot: 0 };
};

const semesterSebelumnya = semesterList.filter((s) => !s.isAktif).slice(-5);
export const riwayatNilai: Nilai[] = [];
let nilaiCounter = 1;

semesterSebelumnya.forEach((sem, semIdx) => {
  const semesterKe = semIdx + 1;
  const matkulSemesterIni = mataKuliahList.filter(
    (m) => m.prodiId === prodiDemo.id && m.semester === semesterKe
  );
  const kelasSemesterIni = kelasKuliahList.filter((k) =>
    matkulSemesterIni.some((m) => m.id === k.mataKuliahId)
  );

  kelasSemesterIni.slice(0, 6).forEach((k) => {
    const mk = getMataKuliahById(k.mataKuliahId)!;
    const angka = rng.int(68, 96);
    const { huruf, bobot } = HURUF_DARI_ANGKA(angka);
    riwayatNilai.push({
      id: `nilai-${nilaiCounter++}`,
      mahasiswaId: demoMahasiswa.id,
      kelasId: k.id,
      mataKuliahId: mk.id,
      semesterAkademikId: sem.id,
      nilaiAngka: angka,
      nilaiHuruf: huruf,
      bobot,
      komponen: {
        tugas: rng.int(75, 95),
        uts: rng.int(65, 95),
        uas: rng.int(65, 95),
        kehadiran: rng.int(80, 100),
      },
    });
  });
});

export function hitungIpsPerSemester() {
  return semesterSebelumnya.map((sem) => {
    const nilaiSem = riwayatNilai.filter((n) => n.semesterAkademikId === sem.id);
    const totalSks = nilaiSem.reduce((acc, n) => {
      const mk = getMataKuliahById(n.mataKuliahId);
      return acc + (mk?.sks ?? 0);
    }, 0);
    const totalBobot = nilaiSem.reduce((acc, n) => {
      const mk = getMataKuliahById(n.mataKuliahId);
      return acc + n.bobot * (mk?.sks ?? 0);
    }, 0);
    return {
      semester: sem.nama,
      ips: totalSks > 0 ? Number((totalBobot / totalSks).toFixed(2)) : 0,
      sks: totalSks,
    };
  });
}

// ---------------------------------------------------------------------------
// PRESENSI (untuk kelas yang KRS-nya disetujui)
// ---------------------------------------------------------------------------
export const presensiList: Presensi[] = [];
let presensiCounter = 1;
krsAktif
  .filter((k) => k.status === "disetujui")
  .forEach((krs) => {
    for (let pertemuan = 1; pertemuan <= 12; pertemuan++) {
      const roll = rng.rand();
      let status: Presensi["status"] = "hadir";
      if (roll > 0.97) status = "alpha";
      else if (roll > 0.93) status = "sakit";
      else if (roll > 0.88) status = "izin";
      presensiList.push({
        id: `presensi-${presensiCounter++}`,
        mahasiswaId: demoMahasiswa.id,
        kelasId: krs.kelasId,
        tanggal: new Date(2026, 8, pertemuan * 7).toISOString().slice(0, 10),
        pertemuanKe: pertemuan,
        status,
      });
    }
  });

// ---------------------------------------------------------------------------
// TAGIHAN
// ---------------------------------------------------------------------------
export const tagihanList: Tagihan[] = [
  {
    id: "tgh-1",
    mahasiswaId: demoMahasiswa.id,
    semesterAkademikId: semesterAktif.id,
    jenis: "SPP Semester Ganjil 2026/2027",
    jumlah: 6500000,
    jatuhTempo: "2026-09-15",
    status: "pending",
    nomorInvoice: "INV/2026/09/00045",
  },
  {
    id: "tgh-2",
    mahasiswaId: demoMahasiswa.id,
    semesterAkademikId: "sem-2025-genap",
    jenis: "SPP Semester Genap 2025/2026",
    jumlah: 6500000,
    jatuhTempo: "2026-02-15",
    status: "paid",
    tanggalBayar: "2026-02-10",
    metodePembayaran: "Virtual Account BCA",
    nomorInvoice: "INV/2026/02/00045",
  },
  {
    id: "tgh-3",
    mahasiswaId: demoMahasiswa.id,
    semesterAkademikId: "sem-2025-ganjil",
    jenis: "SPP Semester Ganjil 2025/2026",
    jumlah: 6500000,
    jatuhTempo: "2025-09-15",
    status: "paid",
    tanggalBayar: "2025-09-08",
    metodePembayaran: "Transfer Bank Mandiri",
    nomorInvoice: "INV/2025/09/00045",
  },
  {
    id: "tgh-4",
    mahasiswaId: demoMahasiswa.id,
    semesterAkademikId: semesterAktif.id,
    jenis: "Dana Praktikum Rekayasa Perangkat Lunak",
    jumlah: 350000,
    jatuhTempo: "2026-09-20",
    status: "unpaid",
    nomorInvoice: "INV/2026/09/00088",
  },
];

// ---------------------------------------------------------------------------
// PENGUMUMAN
// ---------------------------------------------------------------------------
export const pengumumanList: Pengumuman[] = [
  {
    id: "pgm-1",
    judul: "Jadwal Pengisian KRS Semester Ganjil 2026/2027",
    isi: "Pengisian KRS dibuka mulai 25 Agustus hingga 5 September 2026. Mahasiswa wajib berkonsultasi dengan dosen wali sebelum melakukan pengajuan KRS.",
    kategori: "akademik",
    target: "semua",
    tanggalPublish: "2026-08-18",
    penulis: "Admin Akademik",
    isPinned: true,
  },
  {
    id: "pgm-2",
    judul: "Batas Akhir Pembayaran SPP Semester Ganjil",
    isi: "Pembayaran SPP semester ganjil 2026/2027 paling lambat tanggal 15 September 2026. Keterlambatan akan dikenakan denda administrasi.",
    kategori: "keuangan",
    target: "semua",
    tanggalPublish: "2026-08-15",
    penulis: "Bagian Keuangan",
    isPinned: true,
  },
  {
    id: "pgm-3",
    judul: "Jadwal Ujian Tengah Semester Ganjil 2026/2027",
    isi: "UTS akan dilaksanakan pada 20-31 Oktober 2026 sesuai jadwal kelas masing-masing. Informasi ruang ujian akan diumumkan menyusul.",
    kategori: "ujian",
    target: "semua",
    tanggalPublish: "2026-08-10",
    penulis: "Admin Akademik",
  },
  {
    id: "pgm-4",
    judul: "Pendaftaran Wisuda Periode November 2026",
    isi: "Mahasiswa yang telah menyelesaikan seluruh syarat kelulusan dapat mendaftar wisuda melalui portal SIAKAD mulai 1 September 2026.",
    kategori: "umum",
    target: "semua",
    tanggalPublish: "2026-08-05",
    penulis: "Biro Akademik",
  },
  {
    id: "pgm-5",
    judul: "Workshop Rekayasa Perangkat Lunak Modern",
    isi: "Program Studi Teknik Informatika mengadakan workshop pengembangan perangkat lunak modern bekerja sama dengan praktisi industri.",
    kategori: "akademik",
    target: "prodi",
    targetDetail: prodiDemo.id,
    tanggalPublish: "2026-08-12",
    penulis: "Kaprodi Teknik Informatika",
  },
  {
    id: "pgm-6",
    judul: "Perubahan Ruang Kelas Algoritma dan Pemrograman",
    isi: "Terhitung mulai minggu depan, kelas Algoritma dan Pemrograman dipindahkan ke Gedung B lantai 2 karena renovasi.",
    kategori: "akademik",
    target: "prodi",
    targetDetail: prodiDemo.id,
    tanggalPublish: "2026-08-08",
    penulis: "Admin Akademik",
  },
  {
    id: "pgm-7",
    judul: "Libur Nasional dan Penyesuaian Jadwal Kuliah",
    isi: "Sehubungan dengan hari libur nasional, terdapat penyesuaian jadwal kuliah pada minggu tersebut.",
    kategori: "umum",
    target: "semua",
    tanggalPublish: "2026-08-01",
    penulis: "Biro Akademik",
  },
  {
    id: "pgm-8",
    judul: "Pengumpulan Proposal Tugas Akhir Angkatan 2022",
    isi: "Mahasiswa angkatan 2022 wajib mengumpulkan proposal tugas akhir paling lambat akhir bulan ini melalui dosen pembimbing.",
    kategori: "akademik",
    target: "angkatan",
    targetDetail: "2022",
    tanggalPublish: "2026-07-28",
    penulis: "Kaprodi",
  },
];

// ---------------------------------------------------------------------------
// NOTIFIKASI
// ---------------------------------------------------------------------------
export const notifikasiList: Notifikasi[] = [
  {
    id: "ntf-1",
    userId: "user-mhs",
    jenis: "krs_disetujui",
    judul: "KRS Disetujui",
    pesan: "Dosen wali telah menyetujui 5 mata kuliah pada KRS semester ini.",
    waktu: "2026-08-20T09:12:00",
    isRead: false,
    link: "/mahasiswa/krs",
  },
  {
    id: "ntf-2",
    userId: "user-mhs",
    jenis: "tagihan_baru",
    judul: "Tagihan Baru Diterbitkan",
    pesan: "SPP Semester Ganjil 2026/2027 sebesar Rp6.500.000 telah diterbitkan.",
    waktu: "2026-08-19T14:30:00",
    isRead: false,
    link: "/mahasiswa/pembayaran",
  },
  {
    id: "ntf-3",
    userId: "user-mhs",
    jenis: "pengumuman",
    judul: "Pengumuman Baru",
    pesan: "Jadwal pengisian KRS semester ganjil telah dipublikasikan.",
    waktu: "2026-08-18T08:00:00",
    isRead: true,
    link: "/mahasiswa/pengumuman",
  },
  {
    id: "ntf-4",
    userId: "user-mhs",
    jenis: "nilai_tersedia",
    judul: "Nilai Telah Terbit",
    pesan: "Nilai akhir mata kuliah Basis Data semester lalu telah dapat dilihat.",
    waktu: "2026-06-15T10:00:00",
    isRead: true,
    link: "/mahasiswa/nilai",
  },
  {
    id: "ntf-5",
    userId: "user-mhs",
    jenis: "presensi_rendah",
    judul: "Peringatan Kehadiran",
    pesan: "Kehadiran Anda pada kelas Jaringan Komputer mendekati batas minimum.",
    waktu: "2026-06-02T11:45:00",
    isRead: true,
    link: "/mahasiswa/presensi",
  },
  {
    id: "ntf-6",
    userId: "user-dsn",
    jenis: "pengumuman",
    judul: "Rapat Koordinasi Dosen",
    pesan: "Rapat koordinasi persiapan semester baru akan dilaksanakan Jumat ini.",
    waktu: "2026-08-19T09:00:00",
    isRead: false,
  },
  {
    id: "ntf-7",
    userId: "user-dsn",
    jenis: "krs_disetujui",
    judul: "Permintaan Persetujuan KRS",
    pesan: "Terdapat 8 mahasiswa bimbingan yang menunggu persetujuan KRS.",
    waktu: "2026-08-18T13:20:00",
    isRead: false,
    link: "/dosen/krs",
  },
];

// ---------------------------------------------------------------------------
// TUGAS & MATERI (kelas dosen demo)
// ---------------------------------------------------------------------------
export const tugasList: Tugas[] = kelasUntukDosenDemo.map((k, i) => ({
  id: `tugas-${i + 1}`,
  kelasId: k.id,
  judul: `Tugas ${i + 1}, ${getMataKuliahById(k.mataKuliahId)?.nama}`,
  deskripsi: "Kerjakan sesuai instruksi pada modul perkuliahan dan kumpulkan tepat waktu.",
  tanggalDibuat: "2026-08-10",
  tenggat: "2026-08-30",
  totalPengumpulan: rng.int(10, k.terisi),
  totalMahasiswa: k.terisi,
}));

export const materiList: Materi[] = kelasUntukDosenDemo.flatMap((k, i) => [
  {
    id: `materi-${i}-1`,
    kelasId: k.id,
    judul: `Slide Pertemuan 1, ${getMataKuliahById(k.mataKuliahId)?.nama}`,
    jenis: "presentasi" as const,
    tanggalUpload: "2026-08-05",
    ukuranFile: "3.2 MB",
  },
  {
    id: `materi-${i}-2`,
    kelasId: k.id,
    judul: "Modul Praktikum",
    jenis: "dokumen" as const,
    tanggalUpload: "2026-08-06",
    ukuranFile: "1.1 MB",
  },
]);
