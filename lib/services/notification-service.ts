import { notifikasiList } from "@/lib/mock";
import { delay } from "./utils";

// Menyimpan status baca di memori proses (mock). Pada implementasi nyata,
// ini akan menjadi PATCH/POST ke REST API.
const state = [...notifikasiList];

export const NotificationService = {
  async getByUser(userId: string) {
    await delay(null, 250);
    return state
      .filter((n) => n.userId === userId)
      .sort((a, b) => (a.waktu < b.waktu ? 1 : -1));
  },

  async markAsRead(id: string) {
    await delay(null, 150);
    const item = state.find((n) => n.id === id);
    if (item) item.isRead = true;
    return item;
  },

  async markAllAsRead(userId: string) {
    await delay(null, 200);
    state.filter((n) => n.userId === userId).forEach((n) => (n.isRead = true));
    return true;
  },

  async remove(id: string) {
    await delay(null, 150);
    const idx = state.findIndex((n) => n.id === id);
    if (idx >= 0) state.splice(idx, 1);
    return true;
  },
};
