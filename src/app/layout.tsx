import type { Metadata } from "next";
import { activeSkin } from "@/lib/data";
import { productLanguage } from "@/lib/product-language";
import "./globals.css";

export const metadata: Metadata = {
  title: `${productLanguage.productName} | Celebration Cinema North`,
  description: productLanguage.mission,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
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
