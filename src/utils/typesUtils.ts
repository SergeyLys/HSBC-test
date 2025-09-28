export function isOneOf<T extends readonly (string | number)[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return (typeof value === "string" || typeof value === "number") && allowed.includes(value);
}