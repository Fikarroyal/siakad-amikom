import {
  krsAktif,
  riwayatNilai,
  presensiList,
  tagihanList,
  pengumumanList,
  getMataKuliahById,
  getKelasById,
  getDosenById,
  getProdiById,
  getFakultasById,
  semesterAktif,
  semesterList,
} from "@/lib/mock";
import { getMahasiswaProfil } from "./mahasiswa-profile-store";
import { delay } from "./utils";
import type { User } from "@/lib/types";

export const StudentService = {
  async getProfil(user: User) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    const prodi = getProdiById(mhs.prodiId);
    const fakultas = getFakultasById(mhs.fakultasId);
    return { ...mhs, prodi, fakultas };
  },

  async getRingkasanAkademik(user: User) {
    await delay(null, 350);
    const mhs = getMahasiswaProfil(user);
    const sksTersisa = mhs.totalSks - mhs.sksDitempuh;
    return {
      ipk: mhs.ipk,
      ips: mhs.ips,
      totalSks: mhs.totalSks,
      sksDitempuh: mhs.sksDitempuh,
      sksTersisa: sksTersisa < 0 ? 0 : sksTersisa,
      semesterAktif: mhs.semesterAktif,
      status: mhs.status,
    };
  },

  async getJadwalHariIni(user: User, hari: string) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    return krsAktif
      .filter((k) => k.mahasiswaId === mhs.id && k.status === "disetujui")
      .map((k) => {
        const kelas = getKelasById(k.kelasId)!;
        const mk = getMataKuliahById(kelas.mataKuliahId)!;
        const dosen = getDosenById(kelas.dosenId);
        return { krs: k, kelas, mataKuliah: mk, dosen };
      })
      .filter((item) => item.kelas.hari === hari)
      .sort((a, b) => a.kelas.jamMulai.localeCompare(b.kelas.jamMulai));
  },

  async getKrsAktif(user: User) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    return krsAktif
      .filter((k) => k.mahasiswaId === mhs.id)
      .map((k) => {
        const kelas = getKelasById(k.kelasId)!;
        const mk = getMataKuliahById(kelas.mataKuliahId)!;
        const dosen = getDosenById(kelas.dosenId);
        return { krs: k, kelas, mataKuliah: mk, dosen };
      });
  },

  async getKelasTersediaUntukKrs(prodiId: string) {
    await delay(null, 350);
    const { kelasKuliahList } = await import("@/lib/mock");
    return kelasKuliahList
      .map((kelas) => {
        const mk = getMataKuliahById(kelas.mataKuliahId)!;
        const dosen = getDosenById(kelas.dosenId);
        return { kelas, mataKuliah: mk, dosen };
      })
      .filter((item) => item.mataKuliah.prodiId === prodiId)
      .sort((a, b) => a.mataKuliah.semester - b.mataKuliah.semester);
  },

  async getJadwalLengkap(user: User) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    return krsAktif
      .filter((k) => k.mahasiswaId === mhs.id && k.status === "disetujui")
      .map((k) => {
        const kelas = getKelasById(k.kelasId)!;
        const mk = getMataKuliahById(kelas.mataKuliahId)!;
        const dosen = getDosenById(kelas.dosenId);
        return { krs: k, kelas, mataKuliah: mk, dosen };
      });
  },

  async getRiwayatNilai(user: User) {
    await delay(null, 350);
    const mhs = getMahasiswaProfil(user);
    return riwayatNilai
      .filter((n) => n.mahasiswaId === mhs.id)
      .map((n) => ({ ...n, mataKuliah: getMataKuliahById(n.mataKuliahId) }))
      .sort((a, b) => b.semesterAkademikId.localeCompare(a.semesterAkademikId));
  },

  async getTrenIpk(user: User) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    const semesterSebelumnya = semesterList.filter((s) => !s.isAktif).slice(-5);
    const perSemester = semesterSebelumnya.map((sem) => {
      const nilaiSem = riwayatNilai.filter((n) => n.mahasiswaId === mhs.id && n.semesterAkademikId === sem.id);
      const totalSks = nilaiSem.reduce((acc, n) => acc + (getMataKuliahById(n.mataKuliahId)?.sks ?? 0), 0);
      const totalBobot = nilaiSem.reduce((acc, n) => acc + n.bobot * (getMataKuliahById(n.mataKuliahId)?.sks ?? 0), 0);
      return {
        semester: sem.nama.replace(/^\D+\s/, ""),
        ips: totalSks > 0 ? Number((totalBobot / totalSks).toFixed(2)) : 0,
        sks: totalSks,
      };
    });

    let kumulatifBobot = 0;
    let kumulatifSks = 0;
    return perSemester.map((s) => {
      kumulatifBobot += s.ips * s.sks;
      kumulatifSks += s.sks;
      const ipk = kumulatifSks > 0 ? Number((kumulatifBobot / kumulatifSks).toFixed(2)) : 0;
      return { semester: s.semester, ips: s.ips, ipk, sks: s.sks };
    });
  },

  async getPresensiPerKelas(user: User) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    const milikSaya = presensiList.filter((p) => p.mahasiswaId === mhs.id);
    const kelasIds = [...new Set(milikSaya.map((p) => p.kelasId))];
    return kelasIds.map((kelasId) => {
      const kelas = getKelasById(kelasId)!;
      const mk = getMataKuliahById(kelas.mataKuliahId)!;
      const records = milikSaya.filter((p) => p.kelasId === kelasId);
      const hadir = records.filter((r) => r.status === "hadir").length;
      const izin = records.filter((r) => r.status === "izin").length;
      const sakit = records.filter((r) => r.status === "sakit").length;
      const alpha = records.filter((r) => r.status === "alpha").length;
      const total = records.length;
      const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;
      return { kelas, mataKuliah: mk, hadir, izin, sakit, alpha, total, persentase };
    });
  },

  async getTagihan(user: User) {
    await delay(null, 300);
    const mhs = getMahasiswaProfil(user);
    return tagihanList.filter((t) => t.mahasiswaId === mhs.id).sort((a, b) => (a.jatuhTempo < b.jatuhTempo ? 1 : -1));
  },

  async getPengumuman(limit?: number) {
    await delay(null, 300);
    const sorted = [...pengumumanList].sort((a, b) =>
      a.isPinned === b.isPinned ? (a.tanggalPublish < b.tanggalPublish ? 1 : -1) : a.isPinned ? -1 : 1
    );
    return limit ? sorted.slice(0, limit) : sorted;
  },

  async getSemesterAktif() {
    await delay(null, 100);
    return semesterAktif;
  },
};
