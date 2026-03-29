// app/page.tsx
import type { Metadata } from "next";
import IntroSection from "@/components/home/IntroSection";
import HistorySection from "@/components/home/HistorySection";
import ProductByCategory from "@/components/products/ProductByCategory";
import HomeReviewSection from "@/components/home/HomeReviewSection";
import FollowUsSection from "@/components/home/FollowUsSection";

import { pageMeta } from "@/lib/metadata";
import { LocalBusinessSchema } from "@/lib/schema"; // ← import from central file

export const metadata: Metadata = pageMeta.home;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* LocalBusiness JSON-LD — only on homepage, not repeated site-wide */}
      <LocalBusinessSchema />

      <section>
        <IntroSection />
        <HistorySection />
        <ProductByCategory />
        <HomeReviewSection />
        <FollowUsSection />

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14061.556005867795!2d83.98500705!3d28.225870399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595eb31663f9f%3A0xeb2b74dd8de8beea!2sBanstola%20Brothers!5e0!3m2!1sen!2snp!4v1751128652987!5m2!1sen!2snp"
          width="100%"
          height="820"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Google Map showing Banstola Brothers location in Pokhara"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
