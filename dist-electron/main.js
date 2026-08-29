"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const node_http_1 = __importDefault(require("node:http"));
const node_fs_1 = __importDefault(require("node:fs"));
// Electron menolak berjalan sebagai user root/administrator tanpa flag
// --no-sandbox (umum terjadi di container, WSL, atau mesin CI yang berjalan
// sebagai root). Deteksi otomatis agar aplikasi tetap bisa dijalankan di
// lingkungan tersebut, tanpa memengaruhi keamanan pada instalasi normal
// (non-root) di komputer pengguna akhir.
if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0) {
    electron_1.app.commandLine.appendSwitch("no-sandbox");
}
const isDev = !electron_1.app.isPackaged;
const DEV_URL = "http://localhost:3000";
let mainWindow = null;
const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".txt": "text/plain; charset=utf-8",
};
/**
 * Server HTTP statis minimal untuk menyajikan hasil `next build` (mode
 * export) di dalam Electron. Dipakai alih-alih file:// karena Chromium
 * tidak otomatis me-resolve index.html pada path direktori lewat file://,
 * yang akan merusak navigasi antar halaman Next.js.
 */
function startStaticServer(rootDir) {
    return new Promise((resolve, reject) => {
        const server = node_http_1.default.createServer((req, res) => {
            try {
                const requestPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
                let filePath = node_path_1.default.normalize(node_path_1.default.join(rootDir, requestPath));
                // Cegah path traversal keluar dari direktori hasil build.
                if (!filePath.startsWith(rootDir)) {
                    res.writeHead(403);
                    res.end("Forbidden");
                    return;
                }
                if (node_fs_1.default.existsSync(filePath) && node_fs_1.default.statSync(filePath).isDirectory()) {
                    filePath = node_path_1.default.join(filePath, "index.html");
                }
                if (!node_fs_1.default.existsSync(filePath)) {
                    const notFoundPage = node_path_1.default.join(rootDir, "404.html");
                    const indexPage = node_path_1.default.join(rootDir, "index.html");
                    filePath = node_fs_1.default.existsSync(notFoundPage) ? notFoundPage : indexPage;
                }
                const ext = node_path_1.default.extname(filePath);
                const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
                res.writeHead(200, { "Content-Type": contentType });
                node_fs_1.default.createReadStream(filePath).pipe(res);
            }
            catch {
                res.writeHead(500);
                res.end("Internal Server Error");
            }
        });
        server.listen(0, "127.0.0.1", () => {
            const address = server.address();
            if (address && typeof address === "object") {
                resolve(address.port);
            }
            else {
                reject(new Error("Gagal menjalankan server statis lokal."));
            }
        });
    });
}
async function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1360,
        height: 860,
        minWidth: 1024,
        minHeight: 680,
        show: false, // ditampilkan setelah konten siap, menghindari kedipan layar putih
        backgroundColor: "#ffffff",
        title: "SIAKAD Universitas, Sistem Informasi Akademik",
        icon: node_path_1.default.join(__dirname, "..", "build", "icon.png"),
        autoHideMenuBar: true,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });
    electron_1.Menu.setApplicationMenu(null);
    mainWindow.once("ready-to-show", () => {
        mainWindow?.show();
    });
    // Tautan yang dibuka dengan target baru (mis. window.open) diarahkan ke
    // browser eksternal, bukan membuka jendela Electron baru tanpa kontrol.
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url);
        return { action: "deny" };
    });
    if (isDev) {
        await mainWindow.loadURL(DEV_URL);
    }
    else {
        // process.resourcesPath tersedia pada build hasil electron-builder
        // (lihat "extraResources" pada electron-builder.yml).
        const outDir = electron_1.app.isPackaged
            ? node_path_1.default.join(process.resourcesPath, "out")
            : node_path_1.default.join(__dirname, "..", "out");
        const port = await startStaticServer(outDir);
        await mainWindow.loadURL(`http://127.0.0.1:${port}/`);
    }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
electron_1.ipcMain.handle("app:get-version", () => electron_1.app.getVersion());
electron_1.ipcMain.handle("app:check-for-updates", async () => {
    // Placeholder: struktur pemeriksaan update sudah tersedia, namun belum
    // dihubungkan ke server rilis sungguhan (lihat catatan di README).
    return { hasUpdate: false, latestVersion: electron_1.app.getVersion() };
});
electron_1.app.whenReady().then(createMainWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createMainWindow();
});
