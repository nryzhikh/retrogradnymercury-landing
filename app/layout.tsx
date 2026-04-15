import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ретроградный Меркурий — Персональный астрологический прогноз на 2026 год",
  description:
    "Recovered Next.js scaffold for the Retrogradny Mercury landing page.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
