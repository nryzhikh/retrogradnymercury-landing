import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://retrogradnymercury-landing-ihif.vercel.app";

const title = "Ретроградный ритрит Биарриц 2026";
const description = "18 — 21 июня 2026 · Меркурий в Биаррице";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: title,
    title,
    description,
    images: [
      {
        url: "/images/retreat.jpg",
        width: 1921,
        height: 1274,
        alt: "Ретроградный ритрит · Меркурий в Биаррице · 18–21 июня 2026",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/retreat.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
