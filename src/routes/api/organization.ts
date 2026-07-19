import { createFileRoute } from "@tanstack/react-router";

export type PublicOrganizationMember = {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  body: string;
  photo: string;
};

type AirtableAttachment = { url?: string };
type AirtableFields = {
  Name?: string;
  Role?: string;
  Location?: string;
  Quote?: string;
  Body?: string;
  Photo?: AirtableAttachment[];
  Order?: number;
  Status?: string;
};
type AirtableRecord = { id: string; fields: AirtableFields };
type AirtableErrorBody = {
  error?: {
    type?: string;
    message?: string;
  };
};

const ORGANIZATION_SETUP_HINT =
  "Organization content is using fallback portraits. Check AIRTABLE_BASE_ID, AIRTABLE_API_KEY, and AIRTABLE_TABLE_ORGANIZATION. The Airtable token needs data.records:read access to the selected base, and the table name or table ID must match exactly.";

async function readAirtableError(response: Response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text) as AirtableErrorBody;
    return {
      type: parsed.error?.type,
      message: parsed.error?.message ?? text,
      raw: text,
    };
  } catch {
    return { type: undefined, message: text, raw: text };
  }
}

export const Route = createFileRoute("/api/organization")({
  server: {
    handlers: {
      GET: async () => {
        const baseId = process.env.AIRTABLE_BASE_ID;
        const token = process.env.AIRTABLE_API_KEY;

        if (!baseId || !token) {
          return Response.json(
            { success: false, error: "Airtable not configured", hint: ORGANIZATION_SETUP_HINT, members: [] },
            { headers: { "Cache-Control": "no-store" } },
          );
        }

        const tableName = process.env.AIRTABLE_TABLE_ORGANIZATION ?? "Organization";
        const params = new URLSearchParams();
        params.set("filterByFormula", "OR({Status}='Active', {Status}='')");
        params.append("sort[0][field]", "Order");
        params.append("sort[0][direction]", "asc");

        const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
          tableName,
        )}?${params.toString()}`;

        try {
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const details = await readAirtableError(response);
            const isPermissionOrModelError =
              response.status === 403 && details.type === "INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND";

            console.warn(
              isPermissionOrModelError
                ? `Airtable organization setup issue: cannot read table "${tableName}" in base "${baseId}". ${ORGANIZATION_SETUP_HINT}`
                : `Airtable organization fetch failed [${response.status}]: ${details.raw}`,
            );

            return Response.json(
              {
                success: false,
                error: isPermissionOrModelError
                  ? "Airtable organization table is unavailable"
                  : "Failed to fetch organization",
                hint: isPermissionOrModelError ? ORGANIZATION_SETUP_HINT : undefined,
                members: [],
              },
              { headers: { "Cache-Control": "no-store" } },
            );
          }

          const data = (await response.json()) as { records: AirtableRecord[] };
          const members: PublicOrganizationMember[] = data.records.map((record) => ({
            id: record.id,
            name: record.fields.Name ?? "",
            role: record.fields.Role ?? "",
            location: record.fields.Location ?? "",
            quote: record.fields.Quote ?? "",
            body: record.fields.Body ?? "",
            photo: record.fields.Photo?.[0]?.url ?? "",
          }));

          return Response.json(
            { success: true, members },
            { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } },
          );
        } catch (error) {
          console.error("Organization fetch error:", error);
          return Response.json(
            { success: false, error: "Unable to load organization", hint: ORGANIZATION_SETUP_HINT, members: [] },
            { headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  },
});
