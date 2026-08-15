import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      GET: async () => {
        const baseId = process.env.AIRTABLE_BASE_ID!;
        const token = process.env.AIRTABLE_API_KEY!;

        if (!baseId || !token) {
          return Response.json(
            { success: false, error: "Airtable not configured" },
            { status: 500 },
          );
        }

        // Table name from environment or fallback default
        const heroTable = process.env.AIRTABLE_TABLE_HERO ?? "Hero Slides";

        try {
          // Fetch only the hero slides cleanly
          const heroRes = await fetch(
            `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(heroTable)}?sort[0][field]=Order&sort[0][direction]=asc`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!heroRes.ok) {
            return Response.json(
              { success: false, error: "Failed to fetch content from Airtable panels" },
              { status: 502 },
            );
          }

          const heroData = await heroRes.json();

          // Map Hero Slides safely
          const heroSlides = (heroData.records || []).map((record: any) => {
            const f = record.fields;
            const cta = [];
            if (f["CTA Label"] && f["CTA Href"]) {
              cta.push({
                label: f["CTA Label"],
                href: f["CTA Href"],
                primary: f["CTA Primary"] ?? true,
              });
            }
            if (f["Secondary CTA Label"] && f["Secondary CTA Href"]) {
              cta.push({
                label: f["Secondary CTA Label"],
                href: f["Secondary CTA Href"],
              });
            }

            return {
              eyebrow: f.Eyebrow ?? "",
              title: f.Title ?? "",
              subtitle: f.Subtitle ?? "",
              image: f.Image?.[0]?.url ?? "",
              alt: f.Alt ?? f.Title ?? "",
              cta,
            };
          });

          return Response.json(
            { success: true, heroSlides },
            {
              headers: { "Cache-Control": "public, max-age=10, s-maxage=10" },
            },
          );
        } catch (error) {
          console.error("Content endpoint error:", error);
          return Response.json(
            { success: false, error: "Unable to load landing configurations" },
            { status: 500 },
          );
        }
      },
    },
  },
});