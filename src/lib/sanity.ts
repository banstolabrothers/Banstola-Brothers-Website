// import { createClient } from "@sanity/client";
// import imageUrlBuilder from "@sanity/image-url";

// export const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "wsx6a0ze",
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
//   apiVersion: "2021-10-21",
//   useCdn: false,
// });

// const builder = imageUrlBuilder(client);
// export const urlFor = (source: any) => builder.image(source);

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "wsx6a0ze";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// console.log("[Sanity client] projectId:", projectId);
// console.log("[Sanity client] dataset:", dataset);
// console.log("[Sanity client] using env var for projectId:", !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2021-10-21",
  useCdn: false,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
