import { createFileRoute } from "@tanstack/react-router";

/**
 * n8n → SakliAI booking receiver
 * POST /api/public/n8n/booking
 * Headers: x-n8n-secret: <N8N_WEBHOOK_SECRET>  (optional but recommended)
 * Body (Workflow A — guest screening / new booking):
 * {
 *   property_id: string (uuid),
 *   guest_name?: string,
 *   channel?: "airbnb" | "booking" | "sakliai" | "student" | "direct",
 *   booking_type?: "short_term" | "long_term" | "student",
 *   check_in: string (YYYY-MM-DD),
 *   check_out: string (YYYY-MM-DD),
 *   status?: "pending" | "confirmed" | "cancelled" | "completed",
 *   total_price?: number,
 *   guests_count?: number,
 *   notes?: string
 * }
 *
 * The Host calendar listens on Supabase Realtime for `bookings`. As soon as
 * this endpoint inserts the row, every open /host tab flashes a toast and
 * renders the new booking bar — no reload, no extra socket.
 */
export const Route = createFileRoute("/api/public/n8n/booking")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: corsHeaders(),
        }),
      POST: async ({ request }) => {
        const expected = process.env.N8N_WEBHOOK_SECRET;
        if (expected) {
          const got = request.headers.get("x-n8n-secret");
          if (got !== expected) return jsonError("Invalid secret", 401);
        }

        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return jsonError("Invalid JSON body", 400);
        }

        const property_id = str(body.property_id);
        const check_in = str(body.check_in);
        const check_out = str(body.check_out);
        if (!property_id || !check_in || !check_out) {
          return jsonError("property_id, check_in, check_out are required", 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .insert({
            property_id,
            guest_name: str(body.guest_name) ?? "Guest",
            channel: str(body.channel) ?? "direct",
            booking_type: str(body.booking_type) ?? "short_term",
            check_in,
            check_out,
            status: str(body.status) ?? "confirmed",
            total_price: num(body.total_price),
            guests_count: num(body.guests_count) ?? 1,
            notes: str(body.notes),
          })
          .select()
          .single();

        if (error) return jsonError(error.message, 400);
        return jsonOk({ booking: data });
      },
    },
  },
});

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-n8n-secret",
  } as Record<string, string>;
}
function jsonOk(body: unknown, status = 200) {
  return new Response(JSON.stringify({ ok: true, ...((body as object) ?? {}) }), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders() },
  });
}
function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders() },
  });
}
