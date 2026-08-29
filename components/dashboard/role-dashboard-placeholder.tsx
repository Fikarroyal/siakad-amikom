import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE_LABEL } from "@/lib/config/nav";
import type { Role } from "@/lib/types";

export function RoleDashboardPlaceholder({ role }: { role: Role }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Construction className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <p className="font-display text-base font-semibold text-foreground">
            Dashboard {ROLE_LABEL[role]} Segera Hadir
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Modul untuk role ini sedang dalam tahap pengembangan bertahap.
            Dashboard Mahasiswa sudah dapat dicoba sepenuhnya melalui akun demo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
