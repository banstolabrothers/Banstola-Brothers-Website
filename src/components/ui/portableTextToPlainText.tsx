import type { PortableTextBlock } from "@portabletext/types";

// ─────────────────────────────────────────────────────────────────────────────
// Minimal Portable Text → plain text flattener.
//
// Used anywhere we need plain text for structured data (JSON-LD) rather than
// rendered rich text — e.g. FAQPage `acceptedAnswer.text`, meta descriptions,
// etc. Deliberately dependency-free; if you already have
// `@portabletext/to-plain-text` installed, you can swap this out for that
// instead, they do the same job.
// ─────────────────────────────────────────────────────────────────────────────

export function portableTextToPlainText(
  blocks: PortableTextBlock[] | undefined | null,
): string {
  if (!blocks || blocks.length === 0) return "";

  return blocks
    .map((block) => {
      // Non-"block" types (images, custom objects, etc.) contribute nothing
      // to plain text — only real text blocks are flattened.
      if (block._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }
      return block.children
        .map((child) => ("text" in child ? child.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
