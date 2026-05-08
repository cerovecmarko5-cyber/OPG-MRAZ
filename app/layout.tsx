import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerification from "../components/AgeVerification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPG Mraz - Domaći Likeri i Rakija | Destilerija Mraz",
  description: "OPG Mraz — domaći likeri, rakija i eko proizvodi iz obiteljske destilerije u Zagorju. Naručite online svježe domaće proizvode s tradicijom i kvalitetom.",
  keywords: [
    "OPG Mraz", "OPG Miro Mraz", "Destilerija Mraz", "domaći likeri", "domaća rakija",
    "eko proizvodi Zagorje", "kupiti liker online", "hrvatska destilerija", "voćna rakija",
    "liker od oraha", "liker od višnje", "domaće žestice", "OPG Hrvatska"
  ],
  metadataBase: new URL("https://opgmiromraz.vercel.app"),
  alternates: {
    canonical: "https://opgmiromraz.vercel.app",
  },
  openGraph: {
    title: "OPG Mraz - Domaći Likeri i Rakija",
    description: "Domaći likeri, rakija i eko proizvodi iz naše obiteljske destilerije u Zagorju. Naručite online!",
    url: "https://opgmiromraz.vercel.app",
    siteName: "OPG Mraz",
    locale: "hr_HR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OPG Mraz - Domaći Likeri i Rakija",
    description: "Domaći likeri, rakija i eko proizvodi iz naše obiteljske destilerije u Zagorju.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <CartProvider>
          <AgeVerification />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
