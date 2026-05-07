import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.number(),
    updatedDate: z.number().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    summary: z.string().optional(),
    schemaType: z.enum(['blog', 'faq']).default('blog'),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
    email: z.string().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
  }),
});

const moments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/moments' }),
  schema: z.object({
    pubDate: z.number(),
  }),
});

export const collections = { blog, site, moments };
