"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  ClipboardCheck,
  CreditCard,
  Megaphone,
  BadgeCheck,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { cn, formatTanggal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";
import { NotificationService } from "@/lib/services/notification-service";
import type { Notifikasi } from "@/lib/types";

const ICON_MAP: Record<Notifikasi["jenis"], React.ElementType> = {
  krs_disetujui: ClipboardCheck,
  krs_ditolak: ClipboardCheck,
  nilai_tersedia: BadgeCheck,
  tagihan_baru: CreditCard,
  jadwal_berubah: CalendarClock,
  pengingat_ujian: CalendarClock,
  presensi_rendah: AlertTriangle,
  pengumuman: Megaphone,
};

export function NotificationDropdown() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<Notifikasi[] | null>(null);
  const [open, setOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!user) return;
    const data = await NotificationService.getByUser(user.id);
    setItems(data);
  }, [user]);

  React.useEffect(() => {
    if (open) load();
  }, [open, load]);

  const unreadCount = items?.filter((n) => !n.isRead).length ?? 0;

  const handleMarkAllRead = async () => {
    if (!user) return;
    await NotificationService.markAllAsRead(user.id);
    load();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
          )}
          <span className="sr-only">Notifikasi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-border">
          <p className="font-display text-sm font-semibold">Notifikasi</p>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tandai semua dibaca
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[360px]">
          {items === null ? (
            <div className="space-y-3 p-3.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
            </div>
          ) : (
            <ul>
              {items.map((n) => {
                const Icon = ICON_MAP[n.jenis];
                const content = (
                  <div
                    className={cn(
                      "flex gap-3 px-3.5 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors",
                      !n.isRead && "bg-accent/40"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{n.judul}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.pesan}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {formatTanggal(n.waktu, true)}
                      </p>
                    </div>
                    {!n.isRead && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <Link href={n.link} onClick={() => setOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
