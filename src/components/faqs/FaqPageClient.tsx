"use client";
import { useState, useRef } from "react";
import { PortableText } from "@portabletext/react";
import { ChevronDown } from "lucide-react";
import type { FaqTopic, FaqItem } from "@/types/faqs";
import MyButton from "@/components/ui/MyButton";

// ── Types ────────────────────────────────────────────────────────────────────

interface FaqPageClientProps {
  topics: FaqTopic[];
}

// ── AccordionItem ─────────────────────────────────────────────────────────────

const AccordionItem = ({ faq }: { faq: FaqItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-brand-900/20 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
        aria-expanded={open}
      >
        <p className="font-black text-brand-900">{faq.question}</p>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-brand-900 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-[600px] pb-5" : "max-h-0"
        }`}
      >
        <div className="text-brand-900/80 prose prose-neutral max-w-none">
          <PortableText value={faq.answer} />
        </div>
      </div>
    </div>
  );
};

// ── FaqPageClient ─────────────────────────────────────────────────────────────

const FaqPageClient = ({ topics }: FaqPageClientProps) => {
  const [activeSlug, setActiveSlug] = useState(topics[0]?.slug ?? "");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToTopic = (slug: string) => {
    setActiveSlug(slug);
    const el = sectionRefs.current[slug];
    if (!el) return;
    const offset = 150; // adjust for any sticky header height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full items-start">
      {/* ── Left: sticky topic list ── */}
      <aside className="w-full  lg:w-80 flex-shrink-0 lg:sticky lg:top-40 hidden md:flex md:flex-col gap-4">
        <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 w-full">
          {topics.map((topic) => (
            <li key={topic._id}>
              <button
                onClick={() => scrollToTopic(topic.slug)}
                className={`whitespace-nowrap lg:whitespace-normal w-full flex text-left px-4 py-3 rounded-xl transition-all duration-150 ${
                  activeSlug === topic.slug
                    ? "bg-brand-900 text-white"
                    : "bg-brand-100/50 text-brand-900 hover:bg-brand-100"
                }`}
              >
                <p className="w-full">{topic.title}</p>
                <p className="w-fit ">{topic.faqs.length}</p>
              </button>
            </li>
          ))}
        </ul>
        <label>
          Don't see the answer? Reach out to{" "}
          <a
            href="mailto:contact@banstolabrothers.com.np"
            className="underline underline-offset-4"
          >
            contact@banstolabrothers.com.np
          </a>{" "}
          and we'll get back to you in a flash.
        </label>
      </aside>

      {/* ── Right: all topics + FAQs ── */}
      <div className="flex-1 flex flex-col gap-12 ">
        {topics.map((topic) => (
          <div
            key={topic._id}
            ref={(el) => {
              sectionRefs.current[topic.slug] = el;
            }}
          >
            <MyButton
              type="primarybutton"
              text={topic.title}
              className="hover:none "
            />

            <div className="mt-4">
              {topic.faqs.map((faq) => (
                <AccordionItem key={faq._id} faq={faq} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPageClient;
