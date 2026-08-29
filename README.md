# SIAKAD Universitas AMIKOM Yogyakarta

Sistem Informasi Akademik, "Satu Platform untuk Seluruh Kebutuhan Akademik". Aplikasi ini berfokus pada **dashboard dan layanan mahasiswa**, dan dapat dijalankan sebagai web maupun aplikasi desktop Windows.

Dibangun dengan Next.js 16 (App Router), TypeScript, Tailwind CSS v4, komponen bergaya shadcn/ui, Lucide Icons, React Hook Form + Zod, Recharts, dan Electron untuk versi desktop.

## Menjalankan Sebagai Web

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Build produksi: `npm run build && npm run start`.

## Menjalankan Sebagai Aplikasi Desktop (Electron)

```bash
npm install
npm run electron:dev
```

Perintah ini menjalankan Next.js dev server dan membuka jendela Electron yang memuatnya. Build installer Windows:

```bash
npm run electron:build            # NSIS installer + portable
npm run electron:build:installer  # hanya NSIS installer (.exe)
npm run electron:build:portable   # hanya versi portable (.exe)
```

Hasil build ada di folder `dist/`: `SIAKAD-Universitas-Setup.exe` (installer) dan `SIAKAD-Universitas-Portable.exe`. Build Windows (NSIS) sebaiknya dijalankan di mesin Windows atau lewat CI Windows; `electron-builder` dari Linux/macOS bisa menghasilkan target `portable` tetapi target `nsis` paling andal dibangun di Windows.

Aplikasi ini 100% client-side (tanpa API routes atau fitur server-only), sehingga versi desktop memakai `next build` mode **export statis** (folder `out/`) yang disajikan oleh server HTTP lokal minimal di dalam proses utama Electron (`electron/main.ts`), bukan membuka browser eksternal. Konfigurasi Electron mengikuti praktik aman: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, dengan jembatan `contextBridge` terbatas di `electron/preload.ts` (hanya mengekspos info versi & placeholder cek pembaruan, terlihat di Pengaturan → tab Tentang).

**Menjalankan sebagai root/administrator (container, WSL, CI):** Electron menolak start sebagai root tanpa flag `--no-sandbox`, gejalanya persis "tidak bisa jalan" tanpa pesan yang jelas di terminal. `electron/main.ts` sekarang mendeteksi ini secara otomatis (`process.getuid() === 0`) dan menambahkan flag tersebut sendiri, jadi tidak perlu penyesuaian manual. Sudah diverifikasi berjalan penuh (window benar-benar terbuka dan me-render halaman login) di lingkungan pengembangan sandbox ini yang berjalan sebagai root, memakai Xvfb sebagai display virtual.

Sudah diverifikasi: kompilasi TypeScript Electron (`npm run electron:compile`) bersih, `next build` mode export menghasilkan seluruh 49 halaman sebagai berkas statis tanpa error, dan `electron .` benar-benar membuka serta merender aplikasi dengan sukses. Proses `electron-builder --win` untuk menghasilkan `.exe` Windows sungguhan belum dijalankan end-to-end di sandbox ini (perlu lingkungan Windows), jadi build installer pertama tetap disarankan dicoba di mesin Anda sendiri.

## Akun

Tidak ada akun demo yang ditampilkan. Buat akun sendiri di `/register` (nama, nomor telepon, email, kata sandi, selalu terdaftar sebagai Mahasiswa). Setelah masuk, lengkapi biodata (NIM, NIK, program studi, angkatan, alamat) di menu **Profil Saya**. Setiap akun punya biodata dan datanya sendiri (tersimpan di localStorage), bukan data bersama, dan **tidak otomatis mendapat jurusan tertentu** — sebelum program studi dipilih, aplikasi menampilkan teks "Belum memilih jurusan" dan mengarahkan pengguna untuk melengkapi profil dulu sebelum mengisi KRS.

## Skema Warna

Ungu tua (primary `#5b21b6` terang / `#7c3aed` gelap), putih, dan hitam. Sidebar mengikuti tema (putih & teks hitam di mode terang, gelap & teks putih di mode gelap). Warna status (hijau/kuning/merah/cyan) tetap dipertahankan untuk badge dan tombol.

## Status Implementasi

**Modul Mahasiswa (fokus utama), lengkap & personal per akun:**
- Dashboard, KRS Online, KHS, Transkrip, Nilai, Jadwal (List & Kalender), Presensi, Pembayaran, Pengumuman, Profil (biodata dapat diedit penuh, termasuk NIK & NIM)
- **25 fitur tambahan** di sidebar, terbagi 4 grup:
  - **Akademik Lanjutan**: Kerja Praktik & Magang, Tugas Akhir/Skripsi (judul, pembimbing, log bimbingan), Ujian Susulan, Legalisir Dokumen, Pendaftaran Wisuda
  - **Fasilitas Kampus**: Klinik Kampus, Parkir Kampus, Reservasi Ruang Belajar, Barang Hilang & Ditemukan
  - **Layanan Kemahasiswaan**: Dosen Wali & Konsultasi, Bimbingan Konseling, Layanan Surat, Cuti Akademik, Beasiswa, Organisasi & UKM, Kegiatan Kampus, Perpustakaan, Pengaduan & Saran
  - **Ruang Pribadi**: Dokumen Saya, Catatan Kuliah, Agenda Pribadi, Sertifikat & Prestasi, Ulasan Dosen, Kalender Akademik, Riwayat Aktivitas

  Sebagian besar dibangun di atas dua komponen generik (`components/academic/pengajuan-layanan.tsx` untuk alur ajukan-lalu-pantau status, `components/academic/katalog-gabung.tsx` untuk alur jelajah-lalu-gabung/pesan), sisanya CRUD mandiri per fitur (Parkir Kampus, Sertifikat & Prestasi, Barang Hilang & Ditemukan, Tugas Akhir). Semua data tersimpan per akun di localStorage.

**CRUD Data Akademik (dapat diakses lewat sidebar Admin Akademik/Admin Fakultas/Kaprodi/Pimpinan bila login dengan role tersebut):**
Data Mahasiswa, Data Dosen, Fakultas, Program Studi, Mata Kuliah, Ruangan, tabel generik dengan pencarian, sort, pagination, hapus massal, ekspor CSV. Data dummy: 247 mahasiswa/dosen/mata kuliah/ruangan; Fakultas (10) & Program Studi (25) sengaja dipertahankan realistis.

**Belum dibangun penuh:**
- Dashboard ringkasan (KPI, grafik) untuk role Dosen, Admin, Kaprodi, Pimpinan, saat ini halaman "segera hadir"
- Fitur khusus Dosen (input nilai, presensi mengajar, tugas & materi)
- Modul Laporan lintas peran
- Auto-update Electron sungguhan (baru placeholder struktur, lihat `electron/main.ts`)

## Struktur Proyek

```
electron/
  main.ts, preload.ts, electron.d.ts   Proses utama & jembatan aman ke renderer
electron-builder.yml                    Konfigurasi build .exe (NSIS + portable)
tsconfig.electron.json                  Konfigurasi TypeScript khusus proses Electron
build/
  icon.png, icon.ico, installer-icon.ico
app/
  login/, register/                     Masuk & registrasi (selalu sebagai Mahasiswa)
  (app)/
    dashboard/                           Dashboard (routing per role)
    mahasiswa/*/                          Modul mahasiswa + 25 fitur tambahan
    admin/*/                              CRUD Data Akademik
    settings/, help/
components/
  ui/                                   Komponen dasar
  tables/                               DataTable generik & dialog konfirmasi
  academic/                             Form CRUD + 2 komponen generik (pengajuan-layanan, katalog-gabung)
  layout/, dashboard/, charts/, forms/, cards/, notifications/
lib/
  types/                                 Definisi tipe seluruh entitas
  mock/                                  Generator data dummy deterministik
  services/
    mahasiswa-profile-store.ts             Biodata mahasiswa per akun (localStorage)
    user-registry.ts                       Akun terdaftar (localStorage)
    activity-log.ts                        Log aktivitas akun
    student-service.ts, auth-service.ts, notification-service.ts
  hooks/                                 useAuth (login, registerAndLogin, logout)
  config/                                Konfigurasi menu navigasi per role
```

## Lanjutan yang Disarankan

1. Dashboard ringkasan untuk Dosen, Admin, Kaprodi, Pimpinan
2. Halaman khusus Dosen: input nilai, presensi mengajar, tugas & materi
3. Modul Laporan lintas peran
4. Uji coba build `.exe` end-to-end di mesin Windows dan hubungkan auto-update sungguhan
