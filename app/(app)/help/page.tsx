import { HelpCircle, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FAQ = [
  {
    q: "Bagaimana cara mengajukan KRS?",
    a: "Buka menu Kartu Rencana Studi, tambahkan mata kuliah yang diinginkan, lalu klik \"Ajukan KRS\" untuk mengirimkan ke dosen wali.",
  },
  {
    q: "Kenapa saya tidak bisa menambahkan mata kuliah tertentu?",
    a: "Pastikan total SKS tidak melebihi batas maksimal berdasarkan IPK Anda, dan jadwal tidak bentrok dengan mata kuliah lain.",
  },
  {
    q: "Bagaimana cara melihat riwayat pembayaran?",
    a: "Buka menu Pembayaran untuk melihat seluruh tagihan beserta status dan riwayat pembayarannya.",
  },
  {
    q: "Apa yang harus dilakukan jika lupa kata sandi?",
    a: "Gunakan tautan \"Lupa kata sandi?\" pada halaman masuk untuk menerima tautan reset melalui email akademik Anda.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Pusat Bantuan</h1>
        <p className="text-sm text-muted-foreground">Pertanyaan umum seputar penggunaan SIAKAD Universitas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {FAQ.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex gap-3">
                  <HelpCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.q}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Hubungi Kami</CardTitle>
            <CardDescription>Tim layanan akademik siap membantu Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">bantuan@university.ac.id</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">(022) 123-4567</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
