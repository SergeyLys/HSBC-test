import z from "zod";
import { API_PAGE_SIZE, CHARACTER_STATUSES, PAGE_SIZE_OPTIONS } from "../api/rickAndMorty.constants";

export const searchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.union(PAGE_SIZE_OPTIONS.map(v => z.literal(v))).default(API_PAGE_SIZE),
  name: z.string().trim().min(1).max(100).optional(),
  status: z.enum(CHARACTER_STATUSES).optional(),
});

export type CharacterSearch = z.infer<typeof searchSchema>;