// PRNG seeded (mulberry32) — memastikan data dummy konsisten setiap render
// (menghindari hydration mismatch antara server & client).

export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed: number) {
  const rand = mulberry32(seed);

  function int(min: number, max: number) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function pick<T>(arr: readonly T[]): T {
    return arr[int(0, arr.length - 1)];
  }

  function pickMany<T>(arr: readonly T[], n: number): T[] {
    const copy = [...arr];
    const result: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = int(0, copy.length - 1);
      result.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return result;
  }

  function float(min: number, max: number, decimals = 2) {
    const val = rand() * (max - min) + min;
    return Number(val.toFixed(decimals));
  }

  function bool(probabilityTrue = 0.5) {
    return rand() < probabilityTrue;
  }

  return { rand, int, pick, pickMany, float, bool };
}

export const NAMA_DEPAN_L = [
  "Ahmad", "Muhammad", "Bagus", "Bayu", "Dimas", "Eko", "Fajar", "Galih",
  "Hendra", "Irfan", "Joko", "Krisna", "Lukman", "Miftah", "Nanda", "Oki",
  "Panji", "Rizky", "Satria", "Taufik", "Umar", "Vino", "Wahyu", "Yusuf",
  "Zaki", "Aditya", "Bima", "Candra", "Dedi", "Erlangga", "Fauzan", "Gilang",
  "Hafiz", "Iqbal", "Jodi", "Kevin", "Ludwig", "Maulana", "Naufal", "Oscar",
  "Prasetyo", "Rendra", "Surya", "Tegar", "Utama", "Viko", "Wisnu", "Yoga",
];

export const NAMA_DEPAN_P = [
  "Ayu", "Bunga", "Citra", "Dewi", "Endah", "Fitri", "Gita", "Hana",
  "Indah", "Jasmine", "Kirana", "Larasati", "Mega", "Nadia", "Olivia", "Putri",
  "Qonita", "Ratna", "Sari", "Tiara", "Utami", "Vina", "Wulan", "Yulia",
  "Zahra", "Amanda", "Bella", "Clara", "Diana", "Erika", "Fara", "Gina",
  "Hesti", "Intan", "Jihan", "Kayla", "Lestari", "Melati", "Nabila", "Oktavia",
  "Puspa", "Raisa", "Salsabila", "Tata", "Ulfa", "Vania", "Winda", "Yasmin",
];

export const NAMA_BELAKANG = [
  "Pratama", "Wijaya", "Santoso", "Kusuma", "Saputra", "Permana", "Setiawan",
  "Wibowo", "Firmansyah", "Nugraha", "Hidayat", "Ramadhan", "Kurniawan",
  "Gunawan", "Susanto", "Herlambang", "Suryadi", "Prabowo", "Wardhana",
  "Handoko", "Rahmawati", "Puspitasari", "Anggraini", "Maharani", "Safitri",
  "Lestari", "Handayani", "Kusumawati", "Utami", "Yuniarti", "Cahyani",
  "Sembiring", "Simatupang", "Nasution", "Siregar", "Panggabean", "Simbolon",
];

export const NAMA_UNIVERSITAS = "Universitas AMIKOM Yogyakarta";
export const SINGKATAN_UNIVERSITAS = "UAY";

export function generateNamaLengkap(rng: ReturnType<typeof makeRng>, gender?: "L" | "P") {
  const g = gender ?? rng.pick(["L", "P"] as const);
  const depan = g === "L" ? rng.pick(NAMA_DEPAN_L) : rng.pick(NAMA_DEPAN_P);
  const jumlahBelakang = rng.bool(0.6) ? 1 : 2;
  const belakang = rng.pickMany(NAMA_BELAKANG, jumlahBelakang).join(" ");
  return `${depan} ${belakang}`;
}

export const KOTA_ASAL = [
  "Bandung", "Jakarta", "Surabaya", "Semarang", "Yogyakarta", "Malang",
  "Medan", "Makassar", "Palembang", "Denpasar", "Solo", "Bogor", "Bekasi",
  "Cirebon", "Padang", "Balikpapan", "Pekanbaru", "Manado", "Banjarmasin",
];
