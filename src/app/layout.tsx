import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import LenisProvider from "@/components/ui/LenisProvider"; // 👈 import

export const metadata: Metadata = {
  metadataBase: new URL("https://www.banstolabrothers.com.np"),
  title: {
    default: "Banstola Brothers | Original Chhurpi Since 1999",
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
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.banstolabrothers.com.np",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GTM_ID = "GTM-04011M7W45";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="SZDSjUuQzGszyhBTAGd-lCMzEzZmWd05CMzuJ545xro"
        />
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LenisProvider>{children}</LenisProvider> {/* 👈 wrap children */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-04011M7W45"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-04011M7W45');
            `,
          }}
        />
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6538761,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </body>
    </html>
  );
}
