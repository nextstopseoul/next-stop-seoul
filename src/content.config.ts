import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const photo = z.object({
  src: z.string(),
  alt: z.string(),
  credit: z.string().optional(), // "Author / License"
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    type: z.enum(['daily', 'weekly', 'monthly', 'guide']).default('daily'),
    category: z.string(),
    area: z.string().optional(),
    tags: z.array(z.string()).default([]),
    hero: photo,
    // Events: drives the "Happening now / Opens soon / Ended" badge.
    event: z
      .object({ start: z.coerce.date(), end: z.coerce.date() })
      .optional(),
    quickFacts: z
      .object({
        name: z.string(),
        korean: z.string().optional(),
        dates: z.string().optional(),
        hours: z.string().optional(),
        price: z.string().optional(),
        station: z.string().optional(),
        reservation: z.string().optional(),
        payment: z.string().optional(),
        englishLevel: z.number().min(1).max(5).optional(),
        mapQuery: z.string().optional(), // English/Korean search term for Naver Map
      })
      .optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    credits: z.array(z.string()).default([]), // "Photo 1: Author / License (Wikimedia Commons)"
    koreanUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
