"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// contextIsolation aktif & nodeIntegration nonaktif (lihat main.ts), sehingga
// renderer TIDAK memiliki akses langsung ke Node.js/Electron API. Satu-satunya
// jalur komunikasi adalah lewat contextBridge di file ini, dengan permukaan
// API yang sangat terbatas dan eksplisit.
const electronAPI = {
    isElectron: true,
    platform: process.platform,
    getAppVersion: () => electron_1.ipcRenderer.invoke("app:get-version"),
    checkForUpdates: () => electron_1.ipcRenderer.invoke("app:check-for-updates"),
};
electron_1.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
