import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "./electron";

// contextIsolation aktif & nodeIntegration nonaktif (lihat main.ts), sehingga
// renderer TIDAK memiliki akses langsung ke Node.js/Electron API. Satu-satunya
// jalur komunikasi adalah lewat contextBridge di file ini, dengan permukaan
// API yang sangat terbatas dan eksplisit.
const electronAPI: ElectronAPI = {
  isElectron: true,
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  checkForUpdates: () => ipcRenderer.invoke("app:check-for-updates"),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
