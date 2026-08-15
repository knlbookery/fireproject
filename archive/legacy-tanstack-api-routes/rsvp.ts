import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const rsvpSchema = z.object({
  eventId: z.string().trim().min(1).max(64),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().default(""),
});

export const Route = createFileRoute("/api/rsvp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = rsvpSchema.parse(await request.json());

          const baseId = process.env.AIRTABLE_BASE_ID;
          const token = process.env.AIRTABLE_API_KEY;

          if (!baseId || !token) {
            return Response.json(
              { success: false, error: "Airtable not configured" },
              { status: 500 },
            );
          }

          const tableName = "Event RSVPs";
          const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

          const body = {
            records: [
              {
                fields: {
                  "Full Name": payload.fullName,
                  "Email Address": payload.email,
                  "Phone Number": payload.phone,
                  Event: [payload.eventId],
                },
              },
            ],
          };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error(`Airtable RSVP failed [${response.status}]: ${errText}`);
            return Response.json(
              { success: false, error: "Unable to submit RSVP" },
              { status: 502 },
            );
          }

          return Response.json({ success: true });
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json(
              { success: false, error: "Invalid RSVP details" },
              { status: 400 },
            );
          }
          console.error("RSVP error:", error);
          return Response.json(
            { success: false, error: "Unable to submit RSVP" },
            { status: 500 },
          );
        }
      },
    },
  },
});
