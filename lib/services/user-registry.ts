import { getUserByEmail as getDemoUserByEmail } from "@/lib/mock";
import type { Role, User } from "@/lib/types";

const USERS_KEY = "siakad_registered_users";
const CREDS_KEY = "siakad_registered_credentials";

function bacaUserTerdaftar(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function tulisUserTerdaftar(list: User[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch {
    // localStorage tidak tersedia — lewati penyimpanan
  }
}

function bacaKredensial(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CREDS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function tulisKredensial(map: Record<string, string>) {
  try {
    window.localStorage.setItem(CREDS_KEY, JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia — lewati penyimpanan
  }
}

export function cariUserBerdasarkanEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  const terdaftar = bacaUserTerdaftar().find((u) => u.email.toLowerCase() === normalized);
  if (terdaftar) return terdaftar;
  return getDemoUserByEmail(normalized);
}

export function emailSudahDipakai(email: string) {
  return !!cariUserBerdasarkanEmail(email);
}

export function verifikasiPasswordTerdaftar(email: string, password: string) {
  const creds = bacaKredensial();
  return creds[email.trim().toLowerCase()] === password;
}

export function daftarkanUserBaru(data: {
  nama: string;
  email: string;
  password: string;
  role: Role;
  noTelepon?: string;
}): User {
  const newUser: User = {
    id: `user-reg-${Date.now()}`,
    nama: data.nama.trim(),
    email: data.email.trim(),
    role: data.role,
    noTelepon: data.noTelepon?.trim() || undefined,
  };

  const users = bacaUserTerdaftar();
  users.push(newUser);
  tulisUserTerdaftar(users);

  const creds = bacaKredensial();
  creds[newUser.email.toLowerCase()] = data.password;
  tulisKredensial(creds);

  return newUser;
}
