import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "info";

const TONE_STYLES: Record<Tone, string> = {
  default: "bg-accent text-accent-foreground",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  destructive: "bg-destructive-bg text-destructive",
  info: "bg-info-bg text-info",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", TONE_STYLES[tone])}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
        <p className="mt-3 font-display text-2xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        {hint && <p className="mt-1.5 text-[11px] text-muted-foreground/80">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="h-9 w-9 rounded-lg bg-secondary animate-pulse" />
        <div className="mt-4 h-6 w-16 rounded bg-secondary animate-pulse" />
        <div className="mt-2 h-3 w-24 rounded bg-secondary animate-pulse" />
      </CardContent>
    </Card>
  );
}
