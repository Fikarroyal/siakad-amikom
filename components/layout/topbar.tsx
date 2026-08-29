"use client";

import * as React from "react";
import Link from "next/link";
import { Search, HelpCircle, LogOut, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "./breadcrumb";
import { ThemeToggle } from "./theme-toggle";
import { MobileDrawerTrigger } from "./mobile-nav";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { CommandPalette } from "./command-palette";
import { useAuth } from "@/lib/hooks/use-auth";
import { getInisial } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/config/nav";

export function Topbar() {
  const { user, logout } = useAuth();
  const [commandOpen, setCommandOpen] = React.useState(false);

  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <MobileDrawerTrigger />
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={() => setCommandOpen(true)}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary transition-colors w-56"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Cari sesuatu...</span>
          <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setCommandOpen(true)}>
          <Search className="h-[18px] w-[18px]" />
        </Button>

        <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
          <Link href="/help">
            <HelpCircle className="h-[18px] w-[18px]" />
          </Link>
        </Button>

        <ThemeToggle />
        <NotificationDropdown />

        <div className="mx-1 hidden md:block h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.nama} />
                <AvatarFallback>{getInisial(user.nama)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-foreground">{user.nama}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <UserRound /> Profil Saya
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  );
}
