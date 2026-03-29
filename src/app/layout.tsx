import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="SZDSjUuQzGszyhBTAGd-lCMzEzZmWd05CMzuJ545xro"
        />
      </head>
      <body>
        {children}
        {/* Hotjar — loads after page is interactive, doesn't block render */}
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
