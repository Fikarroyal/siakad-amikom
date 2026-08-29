"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { AuthService } from "@/lib/services/auth-service";
import { catatAktivitas } from "@/lib/services/activity-log";

const STORAGE_KEY = "siakad_session";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerAndLogin: (data: {
    nama: string;
    email: string;
    password: string;
    role: User["role"];
    noTelepon?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // sessionStorage tidak tersedia — abaikan
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const result = await AuthService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
      catatAktivitas(result.user.id, "Masuk ke akun", "Berhasil masuk ke SIAKAD");
    }
    return { success: result.success, message: result.message };
  }, []);

  const registerAndLogin = React.useCallback(
    async (data: { nama: string; email: string; password: string; role: User["role"]; noTelepon?: string }) => {
      const result = await AuthService.register(data);
      if (result.success && result.user) {
        setUser(result.user);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        catatAktivitas(result.user.id, "Mendaftar akun baru", "Akun berhasil dibuat");
      }
      return { success: result.success, message: result.message };
    },
    []
  );

  const logout = React.useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, registerAndLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
