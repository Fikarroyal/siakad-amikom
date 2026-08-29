const STORAGE_KEY = "siakad_activity_log";
const MAX_ENTRIES = 50;

export interface ActivityEntry {
  id: string;
  userId: string;
  aksi: string;
  keterangan?: string;
  waktu: string;
}

function bacaSemua(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActivityEntry[]) : [];
  } catch {
    return [];
  }
}

function tulisSemua(list: ActivityEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage tidak tersedia — lewati penyimpanan
  }
}

export function catatAktivitas(userId: string, aksi: string, keterangan?: string) {
  const list = bacaSemua();
  list.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    aksi,
    keterangan,
    waktu: new Date().toISOString(),
  });
  tulisSemua(list.slice(0, MAX_ENTRIES));
}

export function ambilAktivitas(userId: string): ActivityEntry[] {
  return bacaSemua().filter((a) => a.userId === userId);
}
