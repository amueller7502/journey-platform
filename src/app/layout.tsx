import type { Metadata } from "next";
import { activeSkin } from "@/lib/data";
import { productLanguage } from "@/lib/product-language";
import "./globals.css";

export const metadata: Metadata = {
  title: `${productLanguage.productName} | Celebration Cinema North`,
  description: productLanguage.mission,
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
