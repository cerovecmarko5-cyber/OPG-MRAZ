import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerification from "../components/AgeVerification";
import Providers from "../components/Providers";
import { auth } from "../auth";
import WhatsAppButton from "../components/WhatsAppButton";
import GoogleAnalytics from "../components/GoogleAnalytics";
import PageTracker from "../components/PageTracker";
import CookieConsent from "../components/CookieConsent";

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
  metadataBase: new URL("https://opg-mrazmiro.com"),
  alternates: {
    canonical: "https://opg-mrazmiro.com",
  },
  icons: {
    icon: '/kazun.png',
    shortcut: '/kazun.png',
    apple: '/kazun-192.png',
  },
  openGraph: {
    title: "OPG Mraz - Domaći Likeri i Rakija",
    description: "Domaći likeri, rakija i eko proizvodi iz naše obiteljske destilerije u Zagorju. Naručite online!",
    url: "https://opg-mrazmiro.com",
    siteName: "OPG Mraz",
    locale: "hr_HR",
    type: "website",
    images: [
      {
        url: '/kazun.png',
        width: 512,
        height: 512,
        alt: 'OPG Mraz logo',
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "OPG Mraz - Domaći Likeri i Rakija",
    description: "Domaći likeri, rakija i eko proizvodi iz naše obiteljske destilerije u Zagorju.",
    images: ['/kazun.png'],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = !!session;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "OPG Mraz",
    "alternateName": "Destilerija Mraz",
    "description": "OPG Mraz — domaći likeri, rakija i eko proizvodi iz obiteljske destilerije u Zagorju. Naručite online svježe domaće proizvode s tradicijom i kvalitetom.",
    "url": "https://opg-mrazmiro.com",
    "email": "narudzbe@opg-mrazmiro.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "HR",
      "addressRegion": "Zagorje"
    },
    "servesCuisine": "Domaći likeri i rakija",
    "priceRange": "€€",
    "sameAs": []
  };

  return (
    <html
      lang="hr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <Providers>
          <CartProvider>
            <PageTracker />
            <AgeVerification />
            <Header isAdmin={isAdmin} />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <CookieConsent />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
