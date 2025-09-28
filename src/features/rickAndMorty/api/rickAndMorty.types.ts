import { CHARACTER_STATUSES } from "./rickAndMorty.constants";

export type CharacterStatus = typeof CHARACTER_STATUSES[number];

export type CharacterFilters = {
  name?: string;
  status?: CharacterStatus;
};

export interface CharactersRequestOptions extends CharacterFilters {
  page: number;
  pageSize: number;
  totalCount?: number;
};