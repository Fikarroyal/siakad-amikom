import { CalendarRange, ClipboardList, GraduationCap, FileText, PartyPopper, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AGENDA_AKADEMIK = [
  { tanggal: "25 Agustus - 5 September 2026", judul: "Pengisian KRS Semester Ganjil 2026/2027", kategori: "KRS", icon: ClipboardList },
  { tanggal: "8 September 2026", judul: "Awal Perkuliahan Semester Ganjil", kategori: "Perkuliahan", icon: GraduationCap },
  { tanggal: "15 September 2026", judul: "Batas Akhir Pembayaran SPP", kategori: "Keuangan", icon: FileText },
  { tanggal: "20 - 31 Oktober 2026", judul: "Ujian Tengah Semester (UTS)", kategori: "Ujian", icon: CalendarClock },
  { tanggal: "1 November 2026", judul: "Kompetisi Startup Kampus", kategori: "Kegiatan", icon: PartyPopper },
  { tanggal: "15 - 26 Desember 2026", judul: "Ujian Akhir Semester (UAS)", kategori: "Ujian", icon: CalendarClock },
  { tanggal: "31 Januari 2027", judul: "Batas Akhir Input Nilai Dosen", kategori: "Akademik", icon: FileText },
  { tanggal: "1 Februari 2027", judul: "Awal Semester Genap 2026/2027", kategori: "Perkuliahan", icon: GraduationCap },
  { tanggal: "November 2026", judul: "Pendaftaran & Pelaksanaan Wisuda", kategori: "Kegiatan", icon: PartyPopper },
];

const KATEGORI_VARIANT: Record<string, "info" | "warning" | "destructive" | "secondary"> = {
  KRS: "info",
  Perkuliahan: "secondary",
  Keuangan: "warning",
  Ujian: "destructive",
  Kegiatan: "info",
  Akademik: "secondary",
};

export default function KalenderAkademikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Kalender Akademik</h1>
        <p className="text-sm text-muted-foreground">Tanggal-tanggal penting sepanjang tahun akademik berjalan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            Ganjil 2026/2027
          </CardTitle>
          <CardDescription>Diperbarui oleh Biro Akademik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-5 pl-6 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-border">
            {AGENDA_AKADEMIK.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{item.judul}</p>
                  <Badge variant={KATEGORI_VARIANT[item.kategori]} className="text-[10px]">
                    {item.kategori}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <item.icon className="h-3 w-3" />
                  {item.tanggal}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
