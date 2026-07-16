import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const inquireSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  organization: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10).max(2000),
  submittedAt: z.string().datetime().optional(),
});

const AIRTABLE_INQUIRE_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appWTrxY1CajQl81C/wflmgWwKFu6Pk0pvd/wtrBrqtwE0km59VI9";

export const Route = createFileRoute("/api/inquire")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = inquireSchema.parse(await request.json());

          const response = await fetch(AIRTABLE_INQUIRE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: payload.name,
              email: payload.email,
              organization: payload.organization,
              message: payload.message,
              submittedAt: payload.submittedAt ?? new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Airtable inquire webhook failed [${response.status}]: ${errorBody}`);
            return Response.json({ error: "Unable to submit inquiry." }, { status: 502 });
          }

          return Response.json({ ok: true });
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json({ error: "Invalid inquiry details." }, { status: 400 });
          }

          console.error("Inquire submission failed:", error);
          return Response.json({ error: "Unable to submit inquiry." }, { status: 500 });
        }
      },
    },
  },
});