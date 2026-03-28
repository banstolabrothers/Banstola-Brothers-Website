import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.banstolabrothers.com.np"),
  title: {
    default: "Banstola Brothers | Authentic Chhurpi – Pokhara Nepal",
    template: "%s | Banstola Brothers",
  },
  description:
    "Buy authentic handcrafted Chhurpi from Banstola Brothers. Smoked, White & Coffee Chhurpi sourced from Ilam, Dolakha & Palpa. Shop in Pokhara, Nepal.",
  keywords: [
    "Chhurpi Pokhara",
    "Banstola Brothers",
    "Smoked Chhurpi",
    "White Chhurpi",
    "Coffee Chhurpi",
    "Nepali hard cheese",
    "Chhurpi from Ilam",
    "traditional Nepali cheese",
  ],
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://www.banstolabrothers.com.np",
    siteName: "Banstola Brothers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
