"use client";

import * as React from "react";
import { Monitor, Bell, ShieldCheck, LogOut, Smartphone, Laptop, Info, RefreshCw, MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/lib/hooks/use-auth";
import { ROLE_LABEL } from "@/lib/config/nav";
import { LogoMark } from "@/components/layout/logo";

const APP_VERSION_WEB = "0.1.0";

const SESI_AKTIF = [
  { id: 1, perangkat: "Chrome di Windows", lokasi: "Bandung, Indonesia", terakhir: "Aktif sekarang", icon: Laptop, current: true },
  { id: 2, perangkat: "SIAKAD Mobile App", lokasi: "Bandung, Indonesia", terakhir: "2 hari lalu", icon: Smartphone, current: false },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [notif, setNotif] = React.useState({
    akademik: true,
    keuangan: true,
    pengumuman: true,
    email: false,
  });
  const [appVersion, setAppVersion] = React.useState(APP_VERSION_WEB);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [checkingUpdate, setCheckingUpdate] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
      setIsDesktop(true);
      window.electronAPI.getAppVersion().then(setAppVersion);
    }
  }, []);

  const handleCekUpdate = async () => {
    if (!window.electronAPI) return;
    setCheckingUpdate(true);
    const info = await window.electronAPI.checkForUpdates();
    setCheckingUpdate(false);
    toast.success(
      info.hasUpdate ? "Pembaruan tersedia" : "Aplikasi sudah versi terbaru",
      { description: `Versi terpasang: ${appVersion}` }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola akun, tampilan, dan preferensi notifikasi</p>
      </div>

      <Tabs defaultValue="akun">
        <TabsList>
          <TabsTrigger value="akun">Akun</TabsTrigger>
          <TabsTrigger value="tampilan">Tampilan</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
          <TabsTrigger value="sesi">Sesi</TabsTrigger>
          <TabsTrigger value="tentang">Tentang</TabsTrigger>
        </TabsList>

        <TabsContent value="akun">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
              <CardDescription>Detail akun yang digunakan untuk masuk ke SIAKAD</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Nama</span>
                <span className="text-sm font-medium text-foreground">{user?.nama}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-foreground">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Peran</span>
                <span className="text-sm font-medium text-foreground">{user ? ROLE_LABEL[user.role] : "-"}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tampilan">
          <Card>
            <CardHeader>
              <CardTitle>Tema Tampilan</CardTitle>
              <CardDescription>Sesuaikan tampilan SIAKAD dengan preferensi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Mode Tampilan</p>
                    <p className="text-xs text-muted-foreground">Terang, gelap, atau ikuti pengaturan sistem</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifikasi">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
              <CardDescription>Pilih jenis notifikasi yang ingin Anda terima</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "akademik" as const, label: "Notifikasi Akademik", desc: "KRS, nilai, dan jadwal" },
                { key: "keuangan" as const, label: "Notifikasi Keuangan", desc: "Tagihan dan pembayaran" },
                { key: "pengumuman" as const, label: "Pengumuman Kampus", desc: "Informasi umum dari kampus" },
                { key: "email" as const, label: "Notifikasi via Email", desc: "Kirim salinan notifikasi ke email" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notif[item.key]}
                    onCheckedChange={(v) => setNotif((prev) => ({ ...prev, [item.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sesi">
          <Card>
            <CardHeader>
              <CardTitle>Sesi Aktif</CardTitle>
              <CardDescription>Perangkat yang sedang masuk ke akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SESI_AKTIF.map((sesi) => (
                <div key={sesi.id} className="flex items-center justify-between rounded-lg border border-border p-3.5">
                  <div className="flex items-center gap-3">
                    <sesi.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {sesi.perangkat} {sesi.current && <span className="text-success text-xs font-normal">(perangkat ini)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{sesi.lokasi} &middot; {sesi.terakhir}</p>
                    </div>
                  </div>
                  {!sesi.current && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Akhiri
                    </Button>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" onClick={logout} className="text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Keluar dari Semua Perangkat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tentang">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <LogoMark className="h-12 w-12" />
                <div>
                  <p className="font-display text-base font-bold text-foreground">SIAKAD Universitas</p>
                  <p className="text-sm text-muted-foreground">Universitas AMIKOM Yogyakarta</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Versi Aplikasi</span>
                  <span className="text-sm font-medium text-foreground">{appVersion}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Mode Berjalan</span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <MonitorSmartphone className="h-3.5 w-3.5" />
                    {isDesktop ? "Aplikasi Desktop (Electron)" : "Browser Web"}
                  </span>
                </div>
              </div>

              {isDesktop ? (
                <Button variant="outline" className="mt-4" onClick={handleCekUpdate} disabled={checkingUpdate}>
                  <RefreshCw className={checkingUpdate ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
                  Cek Pembaruan
                </Button>
              ) : (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Pemeriksaan pembaruan hanya tersedia pada aplikasi desktop.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
