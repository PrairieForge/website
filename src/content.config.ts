// 1. Import utilities from `astro:content`
// 2. Import loader(s)
import { file, glob } from "astro/loaders";
// 3. Import Zod
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

// 4. Define a `loader` and `schema` for each collection
const churches = defineCollection({
  loader: glob({ base: "./src/data/churches", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    name: z.string(),
    city: z.string(),
    pastor: z.string(),
    email: z.email(),
    url: z.url(),
    gps: z.string(),
  }),
});
const friends = defineCollection({
  loader: glob({ base: "./src/data/friends", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    name: z.string(),
    url: z.url(),
  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { churches, friends };
