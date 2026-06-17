import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header, Footer, WhatsAppButton, LayoutWrapper } from "@/components/Common";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s — Franci's Creative Kitchen",
    default: "Franci's Creative Kitchen — Pimentas Artesanais e Molhos",
  },
  description: "Pimentas artesanais, molhos autorais e kits especiais. Sabor e ardência de verdade.",
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
            <LayoutWrapper>
              <Header />
              <main className="flex-1 min-h-screen">{children}</main>
              <Footer />
            </LayoutWrapper>
            <WhatsAppButton />
          </ToastProvider>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
