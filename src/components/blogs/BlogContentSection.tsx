import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/ui/portableTextComponents"; // 👈
import ScrollProgressMinimap from "../ui/ScrollProgressMinimap";

interface BlogContentSectionProps {
  content: unknown[];
}

const BlogContentSection = ({ content }: BlogContentSectionProps) => {
  return (
    <section className="py-10">
      {content.map((block, index) => {
        const b = block as { _type?: string; _key?: string };

        return (
          <div key={b._key ?? index} className={`mx-auto`}>
            <ScrollProgressMinimap showMinimap={false} />

            <div className="prose prose-lg max-w-none">
              <PortableText
                value={[block] as Parameters<typeof PortableText>[0]["value"]}
                components={portableTextComponents}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default BlogContentSection;
