import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" className="fill-primary" />
      <path d="M20 11L30.5 15.5L20 20L9.5 15.5L20 11Z" className="fill-white" />
      <path
        d="M13.5 18.2V23.5C13.5 23.5 15.8 26.3 20 26.3C24.2 26.3 26.5 23.5 26.5 23.5V18.2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M30.5 15.5V21.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="30.5" cy="23" r="1.3" className="fill-white" />
    </svg>
  );
}

export function LogoFull({ className, collapsed }: { className?: string; collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 overflow-hidden", className)}>
      <LogoMark />
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-bold tracking-tight text-foreground whitespace-nowrap">
            SIAKAD
          </span>
          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            Universitas AMIKOM Yogyakarta
          </span>
        </div>
      )}
    </div>
  );
}
