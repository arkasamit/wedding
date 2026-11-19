import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { wedding, weddingDates } from "./wedding";
import "./globals.css";
import "./ceremony.css";
import "./stage.css";
import "./portraits.css";
import "./ambience.css";

const bodyFont = localFont({
  src: "./fonts/noto-sans-bengali-bengali-wght-normal.woff2",
  variable: "--font-bengali-sans", weight: "100 900", display: "swap", adjustFontFallback: false,
});
const displayFont = localFont({
  src: "./fonts/tiro-bangla-bengali-400-normal.woff2",
  variable: "--font-bengali-serif", weight: "400", display: "swap", adjustFontFallback: false,
});
const title = `${wedding.title} | শুভ পরিণয়`;
const description = `শুভ পরিণয়ের আমন্ত্রণ: ${wedding.title}। ${weddingDates}, ${wedding.venue.name}, নওগাঁ।`;
const siteUrl = process.env.SITE_URL ?? "http://localhost:3100";
const cover = wedding.photos.cover;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title, description,
  openGraph: {
    title, description, type: "website", locale: "bn_BD",
    images: [{ url: cover.src.src, width: cover.src.width, height: cover.src.height, alt: cover.alt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [cover.src.src] },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="bn" className={`${bodyFont.variable} ${displayFont.variable}`}>
    <body>{children}</body>
  </html>;
}
