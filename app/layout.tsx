import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPG i DESTILERIJA Mraz - Online Trgovina",
  description: "Kupujte svježe domaće likere, rakiju i eko proizvode od OPG i DESTILERIJA Mraz. Tradicija i kvaliteta iz Zagorja.",
  openGraph: {
    title: "OPG i DESTILERIJA Mraz",
    description: "Domaći likeri, rakija i eko proizvodi iz naše obiteljske destilerije. Naručite online!",
    url: "https://opg-mrazmiro.com",
    siteName: "OPG i DESTILERIJA Mraz",
    images: [
      {
        url: "https://opg-mrazmiro.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "OPG i DESTILERIJA Mraz",
      },
    ],
    locale: "hr_HR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OPG i DESTILERIJA Mraz",
    description: "Domaći likeri, rakija i eko proizvodi iz naše obiteljske destilerije.",
    images: ["https://opg-mrazmiro.com/og-image.png"],
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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
