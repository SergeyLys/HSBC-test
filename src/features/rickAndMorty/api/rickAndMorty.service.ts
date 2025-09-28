import { fetchHandler } from "../../../utils/fetchHandler";
import { API_PAGE_SIZE, BASE_URL, CACHE_TIME } from "./rickAndMorty.constants";
import { CharacterSchema, Character, CharactersResponseSchema, CharactersResponse } from "./rickAndMorty.model";
import type { CharactersRequestOptions } from "./rickAndMorty.types";
import { CachedStore } from "../../../utils/cachedStore";
import { withErrorHandler } from "../../../utils/withErrorHandler";

export async function getCharacter(id: number, signal?: AbortSignal) {
  const url = `${BASE_URL}/character/${id}`;
  const result = await fetchHandler<Character, void>(
    url,
    { signal }
  );

  return withErrorHandler<Character>(() => CharacterSchema.parse(result), `Response validation failed from ${url}`);
}

export async function fetchWithFilters(
  params: Omit<CharactersRequestOptions, "pageSize">,
  signal?: AbortSignal
) {
  const url = `${BASE_URL}/character`;
  const result = await fetchHandler<CharactersResponse, void>(
    url,
    { searchParams: params, signal }
  );

  return withErrorHandler(() => CharactersResponseSchema.parse(result), `Response validation failed from ${url}`);
}

// This function is to prevent unnecessasry api call in case when half of data was fetched from previous request
const cache = new CachedStore<CharactersResponse>();

async function getCachedCharacters(
  options: CharactersRequestOptions,
  signal?: AbortSignal,
  shouldInvalidateCache?: boolean
) {
  const { page, name, status } = options;
  let cacheKey = `page:${page}`;

  if (name) cacheKey += `-name:${name}`;
  if (status) cacheKey += `-status:${status}`;

  if (shouldInvalidateCache) {
    cache.clear();
  }

  console.log(cacheKey, cache.has(cacheKey), shouldInvalidateCache);
  if (cache.has(cacheKey))  {
    const result = cache.get(cacheKey);
    if (result) return Promise.resolve(result);
  }

  const result = await fetchWithFilters(
    { page, name, status },
    signal
  );
  cache.set(cacheKey, result, CACHE_TIME);
  return result;
} 

export async function getCharacters(
  options: CharactersRequestOptions,
  signal?: AbortSignal,
  shouldInvalidateCache?: boolean
) {
  const { page, pageSize, name, status } = options;

  const startIndex = (page - 1) * pageSize;

  const startApiPage = Math.floor(startIndex / API_PAGE_SIZE) + 1;
  const firstResponse = await getCachedCharacters({ page: startApiPage, name, status, pageSize }, signal, shouldInvalidateCache);


  const totalCount = firstResponse.info.count;
  const totalApiPages = Math.ceil(totalCount / API_PAGE_SIZE);
  

  const endIndexInclusive = startIndex + pageSize - 1;
  const endApiPage = Math.min(Math.ceil((endIndexInclusive + 1) / API_PAGE_SIZE), totalApiPages);

  const pagesToFetch = [];
  for (let p = startApiPage + 1; p <= endApiPage; p++) {
    pagesToFetch.push(p);
  }

  const remainingResponses = await Promise.all(
    pagesToFetch.map((p) => getCachedCharacters({ page: p, name, status, pageSize }, signal, shouldInvalidateCache))
  );

  const combined: Character[] = [firstResponse, ...remainingResponses].flatMap((r) => r.results);
  const withinFirstPageOffset = startIndex - (startApiPage - 1) * API_PAGE_SIZE;
  
  const results = combined.slice(withinFirstPageOffset, withinFirstPageOffset + pageSize);
  const compositeTotalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);

  return {
    info: { count: totalCount, pages: compositeTotalPages },
    results,
  };
}

