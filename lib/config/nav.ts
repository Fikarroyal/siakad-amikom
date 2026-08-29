import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  FileText,
  BadgeCheck,
  CalendarDays,
  CalendarCheck,
  CreditCard,
  Megaphone,
  UserRound,
  Users,
  Building2,
  BookOpen,
  Layers,
  DoorOpen,
  ChartNoAxesCombined,
  Settings,
  ClipboardCheck,
  FileStack,
  UploadCloud,
  ListChecks,
  ScrollText,
  Landmark,
  Building,
  CalendarRange,
  UserCog,
  HeartHandshake,
  FileSignature,
  CalendarOff,
  Award,
  Users2,
  PartyPopper,
  Library,
  MessageSquareWarning,
  FolderOpen,
  NotebookPen,
  ListTodo,
  Star,
  History,
  Briefcase,
  FileCheck2,
  CalendarClock,
  Stamp,
  Stethoscope,
  Car,
  PackageSearch,
  Medal,
} from "lucide-react";
import type { Role } from "@/lib/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  mahasiswa: [
    {
      label: "Utama",
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Akademik",
      items: [
        { title: "Kartu Rencana Studi", href: "/mahasiswa/krs", icon: ClipboardList },
        { title: "Kartu Hasil Studi", href: "/mahasiswa/khs", icon: FileText },
        { title: "Transkrip Nilai", href: "/mahasiswa/transkrip", icon: ScrollText },
        { title: "Nilai Akademik", href: "/mahasiswa/nilai", icon: BadgeCheck },
        { title: "Jadwal Kuliah", href: "/mahasiswa/jadwal", icon: CalendarDays },
        { title: "Presensi", href: "/mahasiswa/presensi", icon: CalendarCheck },
      ],
    },
    {
      label: "Keuangan",
      items: [{ title: "Pembayaran", href: "/mahasiswa/pembayaran", icon: CreditCard }],
    },
    {
      label: "Akademik Lanjutan",
      items: [
        { title: "Kerja Praktik & Magang", href: "/mahasiswa/kerja-praktik", icon: Briefcase },
        { title: "Tugas Akhir / Skripsi", href: "/mahasiswa/tugas-akhir", icon: FileCheck2 },
        { title: "Ujian Susulan", href: "/mahasiswa/ujian-susulan", icon: CalendarClock },
        { title: "Legalisir Dokumen", href: "/mahasiswa/legalisir-dokumen", icon: Stamp },
        { title: "Pendaftaran Wisuda", href: "/mahasiswa/wisuda", icon: GraduationCap },
      ],
    },
    {
      label: "Fasilitas Kampus",
      items: [
        { title: "Klinik Kampus", href: "/mahasiswa/klinik-kampus", icon: Stethoscope },
        { title: "Parkir Kampus", href: "/mahasiswa/parkir-kampus", icon: Car },
        { title: "Reservasi Ruang Belajar", href: "/mahasiswa/ruang-belajar", icon: DoorOpen },
        { title: "Barang Hilang & Ditemukan", href: "/mahasiswa/barang-hilang", icon: PackageSearch },
      ],
    },
    {
      label: "Layanan Kemahasiswaan",
      items: [
        { title: "Dosen Wali & Konsultasi", href: "/mahasiswa/dosen-wali", icon: UserCog },
        { title: "Bimbingan Konseling", href: "/mahasiswa/bimbingan-konseling", icon: HeartHandshake },
        { title: "Layanan Surat", href: "/mahasiswa/layanan-surat", icon: FileSignature },
        { title: "Cuti Akademik", href: "/mahasiswa/cuti-akademik", icon: CalendarOff },
        { title: "Beasiswa", href: "/mahasiswa/beasiswa", icon: Award },
        { title: "Organisasi & UKM", href: "/mahasiswa/organisasi", icon: Users2 },
        { title: "Kegiatan Kampus", href: "/mahasiswa/kegiatan-kampus", icon: PartyPopper },
        { title: "Perpustakaan", href: "/mahasiswa/perpustakaan", icon: Library },
        { title: "Pengaduan & Saran", href: "/mahasiswa/pengaduan", icon: MessageSquareWarning },
      ],
    },
    {
      label: "Ruang Pribadi",
      items: [
        { title: "Dokumen Saya", href: "/mahasiswa/dokumen", icon: FolderOpen },
        { title: "Catatan Kuliah", href: "/mahasiswa/catatan-kuliah", icon: NotebookPen },
        { title: "Agenda Pribadi", href: "/mahasiswa/agenda", icon: ListTodo },
        { title: "Sertifikat & Prestasi", href: "/mahasiswa/sertifikat", icon: Medal },
        { title: "Ulasan Dosen", href: "/mahasiswa/ulasan-dosen", icon: Star },
        { title: "Kalender Akademik", href: "/mahasiswa/kalender-akademik", icon: CalendarRange },
        { title: "Riwayat Aktivitas", href: "/mahasiswa/riwayat-aktivitas", icon: History },
      ],
    },
    {
      label: "Informasi",
      items: [
        { title: "Pengumuman", href: "/mahasiswa/pengumuman", icon: Megaphone },
        { title: "Profil Saya", href: "/mahasiswa/profil", icon: UserRound },
      ],
    },
  ],
  dosen: [
    {
      label: "Utama",
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Perkuliahan",
      items: [
        { title: "Jadwal Mengajar", href: "/dosen/jadwal", icon: CalendarDays },
        { title: "Daftar Kelas", href: "/dosen/kelas", icon: Layers },
        { title: "Presensi Mahasiswa", href: "/dosen/presensi", icon: CalendarCheck },
        { title: "Input Nilai", href: "/dosen/nilai", icon: BadgeCheck },
        { title: "Tugas & Materi", href: "/dosen/tugas", icon: FileStack },
      ],
    },
    {
      label: "Lainnya",
      items: [
        { title: "Monitoring KRS", href: "/dosen/krs", icon: ClipboardCheck },
        { title: "Profil Saya", href: "/dosen/profil", icon: UserRound },
      ],
    },
  ],
  admin_akademik: [
    {
      label: "Utama",
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Data Akademik",
      items: [
        { title: "Data Mahasiswa", href: "/admin/mahasiswa", icon: GraduationCap },
        { title: "Data Dosen", href: "/admin/dosen", icon: UserRound },
        { title: "Fakultas", href: "/admin/fakultas", icon: Building2 },
        { title: "Program Studi", href: "/admin/prodi", icon: Landmark },
        { title: "Mata Kuliah", href: "/admin/mata-kuliah", icon: BookOpen },
        { title: "Ruangan", href: "/admin/ruangan", icon: DoorOpen },
      ],
    },
    {
      label: "Akademik",
      items: [
        { title: "Jadwal Kuliah", href: "/admin/jadwal", icon: CalendarDays },
        { title: "Tahun Akademik", href: "/admin/semester", icon: CalendarRange },
        { title: "Monitoring Nilai", href: "/admin/monitoring-nilai", icon: ListChecks },
      ],
    },
    {
      label: "Lainnya",
      items: [
        { title: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone },
        { title: "Laporan", href: "/admin/laporan", icon: ChartNoAxesCombined },
      ],
    },
  ],
  admin_fakultas: [
    {
      label: "Utama",
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Fakultas",
      items: [
        { title: "Data Mahasiswa", href: "/admin/mahasiswa", icon: GraduationCap },
        { title: "Data Dosen", href: "/admin/dosen", icon: UserRound },
        { title: "Program Studi", href: "/admin/prodi", icon: Landmark },
        { title: "Laporan Fakultas", href: "/admin/laporan", icon: ChartNoAxesCombined },
      ],
    },
  ],
  kaprodi: [
    {
      label: "Utama",
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Program Studi",
      items: [
        { title: "Data Mahasiswa", href: "/admin/mahasiswa", icon: GraduationCap },
        { title: "Data Dosen", href: "/admin/dosen", icon: UserRound },
        { title: "Kurikulum", href: "/admin/mata-kuliah", icon: BookOpen },
        { title: "Monitoring KRS", href: "/dosen/krs", icon: ClipboardCheck },
      ],
    },
  ],
  pimpinan: [
    {
      label: "Utama",
      items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Analitik",
      items: [
        { title: "Analitik Universitas", href: "/pimpinan/analytics", icon: ChartNoAxesCombined },
        { title: "Data Fakultas", href: "/admin/fakultas", icon: Building },
        { title: "Laporan", href: "/admin/laporan", icon: FileText },
      ],
    },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  mahasiswa: "Mahasiswa",
  dosen: "Dosen",
  admin_akademik: "Admin Akademik",
  admin_fakultas: "Admin Fakultas",
  kaprodi: "Kepala Program Studi",
  pimpinan: "Pimpinan Universitas",
};

export const BOTTOM_NAV_MOBILE: Record<Role, NavItem[]> = {
  mahasiswa: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "KRS", href: "/mahasiswa/krs", icon: ClipboardList },
    { title: "Jadwal", href: "/mahasiswa/jadwal", icon: CalendarDays },
    { title: "Nilai", href: "/mahasiswa/nilai", icon: BadgeCheck },
    { title: "Profil", href: "/mahasiswa/profil", icon: UserRound },
  ],
  dosen: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Kelas", href: "/dosen/kelas", icon: Layers },
    { title: "Presensi", href: "/dosen/presensi", icon: CalendarCheck },
    { title: "Nilai", href: "/dosen/nilai", icon: BadgeCheck },
    { title: "Profil", href: "/dosen/profil", icon: UserRound },
  ],
  admin_akademik: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Mahasiswa", href: "/admin/mahasiswa", icon: GraduationCap },
    { title: "Jadwal", href: "/admin/jadwal", icon: CalendarDays },
    { title: "Laporan", href: "/admin/laporan", icon: ChartNoAxesCombined },
  ],
  admin_fakultas: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Mahasiswa", href: "/admin/mahasiswa", icon: GraduationCap },
    { title: "Dosen", href: "/admin/dosen", icon: UserRound },
    { title: "Laporan", href: "/admin/laporan", icon: ChartNoAxesCombined },
  ],
  kaprodi: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Mahasiswa", href: "/admin/mahasiswa", icon: GraduationCap },
    { title: "Dosen", href: "/admin/dosen", icon: UserRound },
    { title: "KRS", href: "/dosen/krs", icon: ClipboardCheck },
  ],
  pimpinan: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Analitik", href: "/pimpinan/analytics", icon: ChartNoAxesCombined },
    { title: "Fakultas", href: "/admin/fakultas", icon: Building },
    { title: "Laporan", href: "/admin/laporan", icon: FileText },
  ],
};
