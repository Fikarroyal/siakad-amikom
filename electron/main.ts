import { app, BrowserWindow, Menu, ipcMain, shell } from "electron";
import path from "node:path";
import http from "node:http";
import fs from "node:fs";

// Electron menolak berjalan sebagai user root/administrator tanpa flag
// --no-sandbox (umum terjadi di container, WSL, atau mesin CI yang berjalan
// sebagai root). Deteksi otomatis agar aplikasi tetap bisa dijalankan di
// lingkungan tersebut, tanpa memengaruhi keamanan pada instalasi normal
// (non-root) di komputer pengguna akhir.
if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0) {
  app.commandLine.appendSwitch("no-sandbox");
}

const isDev = !app.isPackaged;
const DEV_URL = "http://localhost:3000";

let mainWindow: BrowserWindow | null = null;

const MIME_TYPES: Record<string, string> = {
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
function startStaticServer(rootDir: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const requestPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
        let filePath = path.normalize(path.join(rootDir, requestPath));

        // Cegah path traversal keluar dari direktori hasil build.
        if (!filePath.startsWith(rootDir)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
        if (!fs.existsSync(filePath)) {
          const notFoundPage = path.join(rootDir, "404.html");
          const indexPage = path.join(rootDir, "index.html");
          filePath = fs.existsSync(notFoundPage) ? notFoundPage : indexPage;
        }

        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
      } catch {
        res.writeHead(500);
        res.end("Internal Server Error");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(new Error("Gagal menjalankan server statis lokal."));
      }
    });
  });
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    show: false, // ditampilkan setelah konten siap, menghindari kedipan layar putih
    backgroundColor: "#ffffff",
    title: "SIAKAD Universitas, Sistem Informasi Akademik",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Tautan yang dibuka dengan target baru (mis. window.open) diarahkan ke
  // browser eksternal, bukan membuka jendela Electron baru tanpa kontrol.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    await mainWindow.loadURL(DEV_URL);
  } else {
    // process.resourcesPath tersedia pada build hasil electron-builder
    // (lihat "extraResources" pada electron-builder.yml).
    const outDir = app.isPackaged
      ? path.join(process.resourcesPath, "out")
      : path.join(__dirname, "..", "out");
    const port = await startStaticServer(outDir);
    await mainWindow.loadURL(`http://127.0.0.1:${port}/`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.handle("app:get-version", () => app.getVersion());

ipcMain.handle("app:check-for-updates", async () => {
  // Placeholder: struktur pemeriksaan update sudah tersedia, namun belum
  // dihubungkan ke server rilis sungguhan (lihat catatan di README).
  return { hasUpdate: false, latestVersion: app.getVersion() };
});

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
