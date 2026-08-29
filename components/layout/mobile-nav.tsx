"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { cn, getInisial } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoFull } from "./logo";
import { NAV_BY_ROLE, BOTTOM_NAV_MOBILE, ROLE_LABEL } from "@/lib/config/nav";
import { useAuth } from "@/lib/hooks/use-auth";

export function MobileDrawerTrigger() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  React.useEffect(() => setOpen(false), [pathname]);

  if (!user) return null;
  const groups = NAV_BY_ROLE[user.role];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar text-sidebar-foreground border-sidebar-border">
        <SheetHeader className="px-4 py-4 border-b border-sidebar-border">
          <SheetTitle asChild>
            <LogoFull className="[&_span]:text-sidebar-foreground [&_span:last-child]:text-sidebar-foreground/60" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInisial(user.nama)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.nama}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          {groups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-2.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-sidebar-accent" onClick={logout}>
            <LogOut /> Keluar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function BottomNavMobile() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;
  const items = BOTTOM_NAV_MOBILE[user.role];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch justify-between">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate max-w-[60px]">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
