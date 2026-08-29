export interface ElectronAppInfo {
  hasUpdate: boolean;
  latestVersion: string;
}

export interface ElectronAPI {
  /** Selalu true bila aplikasi berjalan di dalam Electron (desktop). */
  isElectron: true;
  platform: NodeJS.Platform;
  /** Ambil nomor versi aplikasi yang sedang berjalan. */
  getAppVersion: () => Promise<string>;
  /**
   * Placeholder pemeriksaan update. Belum melakukan auto-update sungguhan,
   * hanya menyiapkan struktur agar mudah dikembangkan nanti (lihat main.ts).
   */
  checkForUpdates: () => Promise<ElectronAppInfo>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
