import { DEMO_PASSWORD } from "@/lib/mock";
import type { Role, User } from "@/lib/types";
import { delay } from "./utils";
import {
  cariUserBerdasarkanEmail,
  emailSudahDipakai,
  verifikasiPasswordTerdaftar,
  daftarkanUserBaru,
} from "./user-registry";

export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: User;
  message?: string;
}

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResult> {
    await delay(null, 600);
    const user = cariUserBerdasarkanEmail(email);
    if (!user) {
      return { success: false, message: "Email tidak terdaftar pada sistem SIAKAD." };
    }

    const isAkunDemo = user.id.startsWith("user-") && !user.id.startsWith("user-reg-");
    const passwordCocok = isAkunDemo
      ? password === DEMO_PASSWORD
      : verifikasiPasswordTerdaftar(email, password);

    if (!passwordCocok) {
      return { success: false, message: "Kata sandi yang Anda masukkan salah." };
    }
    return { success: true, user };
  },

  async register(data: {
    nama: string;
    email: string;
    password: string;
    role: Role;
    noTelepon?: string;
  }): Promise<RegisterResult> {
    await delay(null, 700);
    if (emailSudahDipakai(data.email)) {
      return { success: false, message: "Email sudah terdaftar. Gunakan email lain atau masuk." };
    }
    const user = daftarkanUserBaru(data);
    return { success: true, user };
  },

  async requestResetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(null, 500);
    const user = cariUserBerdasarkanEmail(email);
    if (!user) {
      return { success: false, message: "Email tidak ditemukan pada sistem." };
    }
    return {
      success: true,
      message: "Tautan reset kata sandi telah dikirim ke email Anda (mode demo).",
    };
  },
};
