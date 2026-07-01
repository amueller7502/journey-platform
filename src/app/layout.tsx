import type { Metadata } from "next";
import { activeSkin } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Journey | Celebration Cinema North",
  description:
    "Internal employee recognition platform for Celebration Cinema North.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`skin-${activeSkin.id}`}>{children}</body>
    </html>
  );
}
