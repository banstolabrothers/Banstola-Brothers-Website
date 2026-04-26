"use client";

import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import MyButton from "@/components/ui/MyButton";

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

// Shared shape for both button annotations.
// `children` is the selected text the editor highlighted — it becomes the label.
interface ButtonValue {
  href?: string;
  blank?: boolean;
}

export const portableTextComponents: PortableTextComponents = {
  // ── Block-level elements ────────────────────────────────────────────────────
  block: {
    h1: ({ children }) => (
      <h2 className="text-brand-900 mb-6 mt-8">{children}</h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-brand-900 mb-5 mt-8">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-brand-900 mb-4 mt-6">{children}</h4>
    ),
    h4: ({ children }) => (
      <h5 className="text-brand-900 mb-3 mt-4">{children}</h5>
    ),
    h5: ({ children }) => (
      <h6 className="text-brand-900 mb-2 mt-2">{children}</h6>
    ),
    normal: ({ children }) => (
      <p className="text-brand-900 leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neutral-300 pl-6 py-2 italic text-neutral-600 my-6 text-left">
        {children}
      </blockquote>
    ),
  },

  // ── Lists ───────────────────────────────────────────────────────────────────
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

  // ── Inline marks ────────────────────────────────────────────────────────────
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-brand-900">{children}</strong>
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

    // ── Plain hyperlink (unchanged) ───────────────────────────────────────────
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

    // ── Primary Button ────────────────────────────────────────────────────────
    buttonPrimary: ({ children, value }) => {
      const { href, blank } = (value ?? {}) as ButtonValue;
      const label =
        typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children.join("")
            : String(children ?? "");

      return (
        <MyButton
          type="primarybutton"
          text={label}
          link={href}
          onClick={
            blank && href
              ? () => window.open(href, "_blank", "noopener,noreferrer")
              : undefined
          }
        />
      );
    },

    // ── Secondary Button ──────────────────────────────────────────────────────
    buttonSecondary: ({ children, value }) => {
      const { href, blank } = (value ?? {}) as ButtonValue;
      const label =
        typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children.join("")
            : String(children ?? "");

      return (
        <MyButton
          type="secondarybutton"
          text={label}
          link={href}
          onClick={
            blank && href
              ? () => window.open(href, "_blank", "noopener,noreferrer")
              : undefined
          }
        />
      );
    },
  },

  // ── Block-level custom types ─────────────────────────────────────────────────
  types: {
    image: ({ value }) => {
      const v = value as ImageValue;
      const imageUrl = v?.asset?.url ?? urlFor(v).url();
      if (!imageUrl) return null;

      return (
        <figure className="my-8">
          <img
            src={imageUrl}
            alt={v?.alt ?? "Blog content image"}
            className="w-full rounded-4xl shadow-sm"
          />
          {v?.caption && (
            <figcaption className="text-neutral-600 mt-3">
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
            <figcaption className="text-center text-neutral-600 mt-3">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
