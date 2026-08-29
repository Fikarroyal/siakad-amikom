import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: "SIAKAD Universitas, Sistem Informasi Akademik",
  description:
    "Satu Platform untuk Seluruh Kebutuhan Akademik, Universitas AMIKOM Yogyakarta",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className="h-full">
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
