import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mareatravel.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marea Travel — Joyería marina en acero inoxidable 316L | Colombia",
    template: "%s | Marea Travel",
  },
  description:
    "Accesorios minimalistas en acero quirúrgico 316L resistentes al agua de mar, piscina y uso diario. Envíos a toda Colombia.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Marea Travel",
    title: "Marea Travel — Joyería marina en acero 316L",
    description:
      "Piezas minimalistas en acero inoxidable 316L diseñadas para acompañarte bajo el sol y el agua salada. Envíos en Colombia.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">{children}</body>
    </html>
  );
}
