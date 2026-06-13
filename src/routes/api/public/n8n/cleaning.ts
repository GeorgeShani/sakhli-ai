import { createFileRoute } from "@tanstack/react-router";

/**
 * n8n → SakliAI cleaning dispatch receiver
 * POST /api/public/n8n/cleaning
 * Headers: x-n8n-secret: <N8N_WEBHOOK_SECRET>  (optional but recommended)
 * Body (Workflow C — auto turn-over):
 * {
 *   task_id?: string (uuid)         // present → update; absent → insert
 *   property_id?: string (uuid)     // required when inserting
 *   booking_id?: string (uuid),
 *   cleaner_name?: string,
 *   cleaner_phone?: string,
 *   scheduled_for?: string (ISO 8601),
 *   status?: "pending" | "assigned" | "in_progress" | "completed" | "cancelled",
 *   notes?: string,
 *   notified?: boolean              // mark notified_at = now()
 * }
 *
 * The Operations Hub subscribes to Supabase Realtime on `cleaning_tasks`;
 * inserts and updates from n8n appear instantly in every open /host tab.
 */
export const Route = createFileRoute("/api/public/n8n/cleaning")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders() }),
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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const task_id = str(body.task_id);
        const notified = body.notified === true;

        if (task_id) {
          const patch: Record<string, unknown> = {};
          for (const k of ["cleaner_name", "cleaner_phone", "scheduled_for", "status", "notes", "booking_id"] as const) {
            const v = body[k];
            if (typeof v === "string" && v.length > 0) patch[k] = v;
          }
          if (notified) patch.notified_at = new Date().toISOString();
          const { data, error } = await supabaseAdmin
            .from("cleaning_tasks")
            .update(patch)
            .eq("id", task_id)
            .select()
            .single();
          if (error) return jsonError(error.message, 400);
          return jsonOk({ task: data });
        }

        // Insert
        const property_id = str(body.property_id);
        const scheduled_for = str(body.scheduled_for);
        if (!property_id || !scheduled_for) {
          return jsonError("property_id and scheduled_for are required for new tasks", 400);
        }
        const { data, error } = await supabaseAdmin
          .from("cleaning_tasks")
          .insert({
            property_id,
            booking_id: str(body.booking_id) ?? null,
            cleaner_name: str(body.cleaner_name) ?? null,
            cleaner_phone: str(body.cleaner_phone) ?? null,
            scheduled_for,
            status: str(body.status) ?? (str(body.cleaner_name) ? "assigned" : "pending"),
            notes: str(body.notes) ?? null,
            notified_at: notified ? new Date().toISOString() : null,
          })
          .select()
          .single();
        if (error) return jsonError(error.message, 400);
        return jsonOk({ task: data });
      },
    },
  },
});

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
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
