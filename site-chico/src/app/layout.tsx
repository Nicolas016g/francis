import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/Common";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://franciscreativekitchen.com.br"),
  title: {
    template: "%s — Franci's Creative Kitchen",
    default: "Franci's Creative Kitchen — Pimentas Artesanais e Molhos",
  },
  description: "Pimentas artesanais e molhos autorais. Sabor e ardência de verdade.",
  openGraph: {
    siteName: "Franci's Creative Kitchen",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} antialiased bg-brand text-pitch`}>
        <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <SiteChrome>{children}</SiteChrome>
          </ToastProvider>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
