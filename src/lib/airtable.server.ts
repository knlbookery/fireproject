/**
 * Airtable client (server-only).
 *
 * Wiring is intentionally left as a stub — set the env vars below and fill in
 * `fetchAirtableRecords` when your Airtable base + PAT are ready. Until then,
 * `isAirtableConfigured()` returns false and the callers in
 * `src/lib/content.functions.ts` fall back to the built-in static content, so
 * the landing page keeps working with no API access.
 *
 * Expected environment (server-side only):
 *   AIRTABLE_API_KEY           Personal access token (secret)
 *   AIRTABLE_BASE_ID           e.g. "appXXXXXXXXXXXXXX"
 *   AIRTABLE_TABLE_HERO        Table/view name for hero slides   (default: "Hero Slides")
 *   AIRTABLE_TABLE_EVENTS      Table/view name for events        (default: "Events")
 *   AIRTABLE_TABLE_SITE_IMAGES Table/view name for shared images (default: "Site Images")
 */

export const AIRTABLE_TABLES = {
  hero: process.env.AIRTABLE_TABLE_HERO ?? "Hero Slides",
  events: process.env.AIRTABLE_TABLE_EVENTS ?? "Events",
  siteImages: process.env.AIRTABLE_TABLE_SITE_IMAGES ?? "Site Images",
} as const;

export function isAirtableConfigured(): boolean {
  return Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID);
}

/** Raw Airtable REST record shape. */
export type AirtableRecord<F = Record<string, unknown>> = {
  id: string;
  createdTime: string;
  fields: F;
};

export type AirtableAttachment = {
  id: string;
  url: string;
  filename?: string;
  width?: number;
  height?: number;
};

/**
 * Fetch all records from a table. Handles pagination.
 *
 * TODO(airtable): the user will supply the API key + base id. Once set, this
 * function is ready to call — no other changes required.
 */
export async function fetchAirtableRecords<F = Record<string, unknown>>(
  table: string,
  params: { view?: string; maxRecords?: number; filterByFormula?: string } = {},
): Promise<AirtableRecord<F>[]> {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable is not configured (missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID)");
  }

  const baseId = process.env.AIRTABLE_BASE_ID!;
  const token = process.env.AIRTABLE_API_KEY!;
  const results: AirtableRecord<F>[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`);
    if (params.view) url.searchParams.set("view", params.view);
    if (params.maxRecords) url.searchParams.set("maxRecords", String(params.maxRecords));
    if (params.filterByFormula) url.searchParams.set("filterByFormula", params.filterByFormula);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Airtable ${table} request failed: ${res.status} ${await res.text()}`);
    }
    const body = (await res.json()) as { records: AirtableRecord<F>[]; offset?: string };
    results.push(...body.records);
    offset = body.offset;
  } while (offset);

  return results;
}

/** Pick the first attachment URL off a record field, if present. */
export function pickAttachmentUrl(field: unknown): string | undefined {
  if (Array.isArray(field) && field.length > 0) {
    const first = field[0] as AirtableAttachment | undefined;
    if (first && typeof first.url === "string") return first.url;
  }
  return undefined;
}
