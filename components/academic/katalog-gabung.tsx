"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { catatAktivitas } from "@/lib/services/activity-log";
import { cn } from "@/lib/utils";

export interface KatalogItem {
  id: string;
  judul: string;
  subjudul?: string;
  deskripsi: string;
  badge?: string;
}

function bacaSemua(storageKey: string): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(storageKey: string, map: Record<string, string[]>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export function KatalogGabungManager({
  storageKey,
  pageTitle,
  pageDescription,
  items,
  aksiLabel = "Gabung",
  aksiBatalLabel = "Keluar",
  logLabel,
}: {
  storageKey: string;
  pageTitle: string;
  pageDescription: string;
  items: KatalogItem[];
  aksiLabel?: string;
  aksiBatalLabel?: string;
  logLabel: string;
}) {
  const { user } = useAuth();
  const [joined, setJoined] = React.useState<string[] | null>(null);
  const fullKey = `siakad_${storageKey}`;

  React.useEffect(() => {
    if (!user) return;
    const semua = bacaSemua(fullKey);
    setJoined(semua[user.id] ?? []);
  }, [user, fullKey]);

  const toggle = (item: KatalogItem) => {
    if (!user || joined === null) return;
    const sudah = joined.includes(item.id);
    const next = sudah ? joined.filter((id) => id !== item.id) : [...joined, item.id];
    const semua = bacaSemua(fullKey);
    semua[user.id] = next;
    tulisSemua(fullKey, semua);
    setJoined(next);
    if (!sudah) catatAktivitas(user.id, logLabel, item.judul);
    toast.success(sudah ? `Keluar dari ${item.judul}` : `Berhasil bergabung dengan ${item.judul}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{pageDescription}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const sudahGabung = joined?.includes(item.id) ?? false;
          return (
            <Card key={item.id} className={cn(sudahGabung && "border-primary/40")}>
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.judul}</p>
                  {item.badge && (
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {item.subjudul && <p className="text-xs text-muted-foreground">{item.subjudul}</p>}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.deskripsi}</p>
                <Button
                  size="sm"
                  variant={sudahGabung ? "outline" : "default"}
                  className="w-full"
                  onClick={() => toggle(item)}
                  disabled={joined === null}
                >
                  {sudahGabung ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      {aksiBatalLabel}
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      {aksiLabel}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
