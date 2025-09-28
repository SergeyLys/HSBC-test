import { z } from 'zod';
import { CHARACTER_STATUSES } from './rickAndMorty.constants';

export const CharacterSchema = z.object({
  // notexisting: z.string(),
  id: z.number(),
  name: z.string(),
  status: z.enum(CHARACTER_STATUSES).optional(),
  species: z.string(),
  type: z.string(),
  gender: z.enum(['Female', 'Male', 'Genderless', 'unknown']),
  image: z.string().url(),
  url: z.string().url(),
  created: z.string(),
  origin: z.object({ name: z.string(), url: z.string().url().or(z.literal('')) }),
  location: z.object({ name: z.string(), url: z.string().url().or(z.literal('')) }),
});

export type Character = z.infer<typeof CharacterSchema>;

export const InfoSchema = z.object({
  count: z.number(),
  pages: z.number(),
  next: z.string().url().nullable(),
  prev: z.string().url().nullable(),
});

export const CharactersResponseSchema = z.object({
  info: InfoSchema,
  results: z.array(CharacterSchema),
});

export type CharactersResponse = z.infer<typeof CharactersResponseSchema>;