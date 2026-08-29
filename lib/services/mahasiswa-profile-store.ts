import { demoMahasiswa } from "@/lib/mock";
import type { Mahasiswa, User } from "@/lib/types";

const STORAGE_KEY = "siakad_mahasiswa_profil";

function bacaSemua(): Record<string, Mahasiswa> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Mahasiswa>) : {};
  } catch {
    return {};
  }
}

function tulisSemua(map: Record<string, Mahasiswa>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia — lewati penyimpanan
  }
}

function buatProfilAwal(user: User): Mahasiswa {
  // Akun demo bawaan tetap memakai data akademik contoh yang lengkap
  if (user.id === "user-mhs") {
    return { ...demoMahasiswa };
  }

  // Akun baru BELUM memiliki program studi — dibiarkan kosong agar mahasiswa
  // memilih sendiri jurusannya di halaman Profil, bukan didefaultkan ke
  // program studi tertentu.
  return {
    id: `mhs-${user.id}`,
    nim: "",
    nama: user.nama,
    email: user.email,
    prodiId: "",
    fakultasId: "",
    angkatan: new Date().getFullYear(),
    semesterAktif: 1,
    ipk: 0,
    ips: 0,
    totalSks: 144,
    sksDitempuh: 0,
    status: "aktif",
    nik: "",
    noTelepon: user.noTelepon ?? "",
    alamat: "",
  };
}

/**
 * Ambil biodata mahasiswa milik user yang sedang login. Dibuat otomatis
 * (kosong/placeholder) saat pertama kali diakses jika belum ada.
 */
export function getMahasiswaProfil(user: User): Mahasiswa {
  const semua = bacaSemua();
  if (semua[user.id]) return semua[user.id];
  const baru = buatProfilAwal(user);
  semua[user.id] = baru;
  tulisSemua(semua);
  return baru;
}

/**
 * Perbarui sebagian/seluruh biodata mahasiswa milik user yang sedang login.
 */
export function updateMahasiswaProfil(user: User, data: Partial<Mahasiswa>): Mahasiswa {
  const semua = bacaSemua();
  const current = semua[user.id] ?? buatProfilAwal(user);
  const updated: Mahasiswa = { ...current, ...data, id: current.id };
  semua[user.id] = updated;
  tulisSemua(semua);
  return updated;
}
