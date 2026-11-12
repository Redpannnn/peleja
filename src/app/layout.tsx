import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Cinzel,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yayak & Eci — The Wedding",
  description:
    "Undangan pernikahan digital Yayak & Eci. Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri resepsi pernikahan kami.",
  keywords: ["undangan digital", "wedding invitation", "Yayak", "Eci", "pernikahan"],
  authors: [{ name: "Yayak & Eci" }],
  openGraph: {
    title: "Yayak & Eci — The Wedding",
    description:
      "Minggu, 10 Januari 2027 — Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu kepada kami.",
    type: "website",
    images: [
      {
        url: "https://the.gandilova.com/wp-content/uploads/2026/06/BG-Montion-7-C.webp",
        width: 846,
        height: 1688,
        alt: "Yayak & Eci — The Wedding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yayak & Eci — The Wedding",
    description: "Minggu, 10 Januari 2027 — Undangan pernikahan Yayak & Eci",
    images: ["https://the.gandilova.com/wp-content/uploads/2026/06/BG-Montion-7-C.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f3e9de",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${cinzel.variable} ${greatVibes.variable} antialiased bg-white text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
