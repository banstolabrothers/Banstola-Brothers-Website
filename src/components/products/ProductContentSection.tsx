// ProductContentSection.tsx

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/ui/portableTextComponents"; // 👈 shared import

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductContentSectionProps {
  content: unknown[];
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProductContentSection = ({ content }: ProductContentSectionProps) => {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {content.map((block, index) => {
          const b = block as { _type?: string; _key?: string };
          const isMediaBlock = b._type === "image" || b._type === "youtube";
          const widthClass = isMediaBlock ? "max-w-[1200px]" : "max-w-[640px]";

          return (
            <div key={b._key ?? index} className={`${widthClass} mx-auto`}>
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={[block] as Parameters<typeof PortableText>[0]["value"]}
                  components={portableTextComponents}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductContentSection;
