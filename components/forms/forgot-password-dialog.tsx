"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MailCheck, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/lib/services/auth-service";

const schema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
});
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const result = await AuthService.requestResetPassword(values.email);
    if (result.success) setSent(true);
  };

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setTimeout(() => {
        setSent(false);
        reset();
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {sent ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success">
              <MailCheck className="h-6 w-6" />
            </div>
            <DialogTitle>Tautan Terkirim</DialogTitle>
            <DialogDescription>
              Kami telah mengirimkan tautan reset kata sandi ke email Anda. Silakan periksa kotak masuk (mode demo, tidak ada email sungguhan yang dikirim).
            </DialogDescription>
            <Button className="w-full mt-2" onClick={() => handleOpenChange(false)}>
              Mengerti
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Lupa Kata Sandi</DialogTitle>
              <DialogDescription>
                Masukkan email akademik Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" type="email" placeholder="nama@university.ac.id" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                  Kirim Tautan Reset
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
