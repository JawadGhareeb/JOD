export type QueryValue = string | number | boolean | null | undefined;

export function buildQuery<T extends object>(params: T): string {
  const query = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") query.append(key, String(value));
  });
  const result = query.toString();
  return result ? `?${result}` : "";
}
