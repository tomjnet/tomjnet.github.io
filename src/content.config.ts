import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Posts and research live in the website-info repo and are loaded at build time (see src/lib/content.ts).

const hobbies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/hobbies" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    // Path under public/ (e.g. "/videos/hero.mp4"), or omit for a plain card.
    video: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { hobbies };
