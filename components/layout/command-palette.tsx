"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, UserRound, BookOpen } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/lib/hooks/use-auth";
import { NAV_BY_ROLE } from "@/lib/config/nav";
import { mahasiswaList, dosenList, mataKuliahList } from "@/lib/mock";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = React.useState("");

  const go = (href: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  };

  if (!user) return null;
  const groups = NAV_BY_ROLE[user.role];

  const canSearchData = ["admin_akademik", "admin_fakultas", "kaprodi", "pimpinan"].includes(user.role);
  const q = query.toLowerCase().trim();

  const mahasiswaHasil = canSearchData && q.length > 1
    ? mahasiswaList.filter((m) => m.nama.toLowerCase().includes(q) || m.nim.includes(q)).slice(0, 5)
    : [];
  const dosenHasil = canSearchData && q.length > 1
    ? dosenList.filter((d) => d.nama.toLowerCase().includes(q) || d.nidn.includes(q)).slice(0, 5)
    : [];
  const matkulHasil = q.length > 1
    ? mataKuliahList.filter((m) => m.nama.toLowerCase().includes(q) || m.kode.toLowerCase().includes(q)).slice(0, 5)
    : [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Cari menu, mahasiswa, dosen, atau mata kuliah..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>

        <CommandGroup heading="Menu Navigasi">
          {groups
            .flatMap((g) => g.items)
            .filter((item) => item.title.toLowerCase().includes(q))
            .map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon />
                {item.title}
              </CommandItem>
            ))}
        </CommandGroup>

        {mahasiswaHasil.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Mahasiswa">
              {mahasiswaHasil.map((m) => (
                <CommandItem key={m.id} onSelect={() => go(`/admin/mahasiswa/${m.id}`)}>
                  <GraduationCap />
                  <span>{m.nama}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{m.nim}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {dosenHasil.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Dosen">
              {dosenHasil.map((d) => (
                <CommandItem key={d.id} onSelect={() => go(`/admin/dosen/${d.id}`)}>
                  <UserRound />
                  <span>{d.nama}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{d.nidn}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {matkulHasil.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Mata Kuliah">
              {matkulHasil.map((m) => (
                <CommandItem key={m.id} onSelect={() => go(`/admin/mata-kuliah`)}>
                  <BookOpen />
                  <span>{m.nama}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{m.kode}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
