import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Server-side sign-up that bypasses email confirmation entirely.
 *
 * Instead of the public `auth.signUp` (which sends a confirmation email when
 * "Confirm email" is enabled in Supabase), we create the user with the
 * service-role Admin API and `email_confirm: true`. That marks the email
 * confirmed immediately and sends NO email — so the client can sign in right
 * away. The service-role key only exists inside the `.handler` (server-only).
 */
export const signUpConfirmed = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fullName: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName ?? null },
    });

    if (error) {
      return {
        error: error.message,
        alreadyExists: /already|registered|exists/i.test(error.message),
      };
    }
    return { ok: true as const, userId: created.user?.id ?? null };
  });
