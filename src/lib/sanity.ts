import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "wsx6a0ze";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2021-10-21",
  useCdn: false,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
