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

export const Route = createFileRoute("/api/organization")({
  server: {
    handlers: {
      GET: async () => {
        const baseId = process.env.AIRTABLE_BASE_ID;
        const token = process.env.AIRTABLE_API_KEY;

        if (!baseId || !token) {
          return Response.json(
            { success: false, error: "Airtable not configured", members: [] },
            { status: 500 },
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
            const body = await response.text();
            console.error(`Airtable organization fetch failed [${response.status}]: ${body}`);
            return Response.json(
              { success: false, error: "Failed to fetch organization", members: [] },
              { status: 502 },
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
            { success: false, error: "Unable to load organization", members: [] },
            { status: 500 },
          );
        }
      },
    },
  },
});
