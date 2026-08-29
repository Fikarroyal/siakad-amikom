/**
 * Mensimulasikan latensi jaringan agar loading state terasa nyata.
 * Saat backend sungguhan tersedia, seluruh fungsi service tinggal
 * diganti isinya dengan pemanggilan fetch()/axios ke REST API tanpa
 * mengubah signature-nya — komponen pemanggil tidak perlu berubah.
 */
export function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
