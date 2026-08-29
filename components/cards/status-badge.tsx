import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "info";

const STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  // Status akademik mahasiswa
  aktif: { label: "Aktif", variant: "success" },
  cuti: { label: "Cuti", variant: "warning" },
  lulus: { label: "Lulus", variant: "info" },
  nonaktif: { label: "Nonaktif", variant: "secondary" },
  drop_out: { label: "Drop Out", variant: "destructive" },

  // Status KRS
  draft: { label: "Draf", variant: "secondary" },
  diajukan: { label: "Diajukan", variant: "warning" },
  disetujui: { label: "Disetujui", variant: "success" },
  ditolak: { label: "Ditolak", variant: "destructive" },

  // Status tagihan
  paid: { label: "Lunas", variant: "success" },
  pending: { label: "Menunggu", variant: "warning" },
  unpaid: { label: "Belum Bayar", variant: "secondary" },
  overdue: { label: "Terlambat", variant: "destructive" },

  // Presensi
  hadir: { label: "Hadir", variant: "success" },
  izin: { label: "Izin", variant: "info" },
  sakit: { label: "Sakit", variant: "warning" },
  alpha: { label: "Alpha", variant: "destructive" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
