import { createFileRoute } from "@tanstack/react-router";

export type PublicEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  photo: string;
};

type AirtableAttachment = { url?: string };
type AirtableEventFields = {
  "Event name/title"?: string;
  "Event date(s)"?: string;
  "Event time"?: string;
  "Event location"?: string;
  "Event description"?: string;
  "Event Photo"?: AirtableAttachment[];
  Status?: string;
};
type AirtableRecord = { id: string; fields: AirtableEventFields };

export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: async () => {
        const baseId = process.env.AIRTABLE_BASE_ID;
        const token = process.env.AIRTABLE_API_KEY;

        if (!baseId || !token) {
          return Response.json(
            { success: false, error: "Airtable not configured", events: [] },
            { status: 500 },
          );
        }

        const tableName = "Events";
        const params = new URLSearchParams();
        params.set("filterByFormula", "{Status}='Active'");
        // Best-effort sort; if the field type doesn't support sort Airtable will ignore.
        params.append("sort[0][field]", "Event date(s)");
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
            console.error(`Airtable events fetch failed [${response.status}]: ${body}`);
            return Response.json(
              { success: false, error: "Failed to fetch events", events: [] },
              { status: 502 },
            );
          }

          const data = (await response.json()) as { records: AirtableRecord[] };
          const events: PublicEvent[] = data.records.map((record) => ({
            id: record.id,
            name: record.fields["Event name/title"] ?? "",
            date: record.fields["Event date(s)"] ?? "",
            time: record.fields["Event time"] ?? "",
            location: record.fields["Event location"] ?? "",
            description: record.fields["Event description"] ?? "",
            photo: record.fields["Event Photo"]?.[0]?.url ?? "",
          }));

          return Response.json(
            { success: true, events },
            {
              headers: {
                "Cache-Control": "public, max-age=60, s-maxage=60",
              },
            },
          );
        } catch (error) {
          console.error("Events fetch error:", error);
          return Response.json(
            { success: false, error: "Unable to load events", events: [] },
            { status: 500 },
          );
        }
      },
    },
  },
});
