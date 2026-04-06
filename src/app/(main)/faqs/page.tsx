import { client } from "@/lib/sanity";
import { allFaqsQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/metadata";
import FaqPageClient from "@/components/faqs/FaqPageClient";
import type { FaqTopic } from "@/types/faqs";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta.faqs;
export const revalidate = 60;

const FaqPage = async () => {
  const topics = await client.fetch<FaqTopic[]>(allFaqsQuery);

  // Filter out topics with no FAQs
  const populated = topics.filter((t) => t.faqs.length > 0);

  return (
    <section className="flex flex-col w-full max-w-[1440] mx-auto my-20 px-4 ">
      {populated.length > 0 ? (
        <FaqPageClient topics={populated} />
      ) : (
        <p className="text-center text-neutral-500">
          No FAQs available yet. Check back soon!
        </p>
      )}
    </section>
  );
};

export default FaqPage;
