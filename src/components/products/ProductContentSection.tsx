// ProductContentSection.tsx

import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductContentSectionProps {
  content: unknown[];
}

interface ImageValue {
  asset?: { _ref?: string; url?: string };
  alt?: string;
  caption?: string;
}

interface YoutubeValue {
  url?: string;
  caption?: string;
}

interface LinkValue {
  href?: string;
  blank?: boolean;
}

// ─── Portable Text Components ─────────────────────────────────────────────────

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-neutral-700 leading-relaxed mb-6">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="text-neutral-900 mb-6 mt-8">{children}</h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-neutral-900 mb-5 mt-8">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-2xl font-semibold text-neutral-900 mb-4 mt-6">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neutral-300 pl-6 py-2 italic text-neutral-600 my-6 text-left">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-neutral-700 text-left">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-neutral-700 text-left">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-lg text-left">{children}</li>,
    number: ({ children }) => <li className="text-lg text-left">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <u className="underline decoration-2">{children}</u>
    ),
    "strike-through": ({ children }) => (
      <s className="line-through decoration-2">{children}</s>
    ),
    "align-left": ({ children }) => (
      <span className="block text-left">{children}</span>
    ),
    "align-center": ({ children }) => (
      <span className="block text-center">{children}</span>
    ),
    "align-right": ({ children }) => (
      <span className="block text-right">{children}</span>
    ),
    "align-justify": ({ children }) => (
      <span className="block text-justify">{children}</span>
    ),
    link: ({ children, value }) => {
      const { href, blank } = (value ?? {}) as LinkValue;
      return (
        <a
          href={href}
          target={blank ? "_blank" : "_self"}
          rel={blank ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:text-blue-800 underline decoration-2 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const v = value as ImageValue;
      // Prefer expanded URL from query, fall back to urlFor() for raw refs
      const imageUrl = v?.asset?.url ?? urlFor(v).url();
      if (!imageUrl) return null;

      return (
        <figure className="my-8">
          <img
            src={imageUrl}
            alt={v?.alt ?? "Product content image"}
            className="w-full rounded-2xl shadow-sm"
          />
          {v?.caption && (
            <figcaption className="text-center text-sm text-neutral-600 mt-3">
              {v.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    youtube: ({ value }) => {
      const { url, caption } = (value ?? {}) as YoutubeValue;
      if (!url) return null;

      const getYouTubeId = (url: string) => {
        const match = url.match(
          /(?:youtube\.com\/(?:[^]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\s]{11})/,
        );
        return match ? match[1] : null;
      };

      const videoId = getYouTubeId(url);
      if (!videoId) return null;

      return (
        <figure className="my-8">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={caption ?? "YouTube video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-neutral-600 mt-3">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

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
