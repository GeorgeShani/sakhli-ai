import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { signUpConfirmed } from "@/lib/api/auth.functions";

export type AppRole = "student" | "host";

export type Profile = {
  id: string;
  full_name: string | null;
  role: AppRole | null;
};

type AuthState = {
  loading: boolean;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  setRole: (role: AppRole) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", uid)
      .maybeSingle();
    setProfile((data as Profile | null) ?? { id: uid, full_name: null, role: null });
  };

  // The handle_new_user trigger normally creates a public.users row on sign-up,
  // but accounts created before that trigger existed won't have one. Several
  // tables (e.g. student_profiles.user_id) FK to public.users(id), so guarantee
  // the row exists once we have a session. RLS allows id = auth.uid().
  const ensureUserRow = async (u: User) => {
    const row: { id: string; email: string | null; full_name?: string } = {
      id: u.id,
      email: u.email ?? null,
    };
    const fullName = u.user_metadata?.full_name as string | undefined;
    if (fullName) row.full_name = fullName;
    await supabase.from("users").upsert(row, { onConflict: "id" });
  };

  useEffect(() => {
    // Listener FIRST (synchronous setState only)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer DB calls to avoid deadlock inside the listener
        setTimeout(() => {
          void ensureUserRow(sess.user);
          loadProfile(sess.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        void ensureUserRow(data.session.user);
        loadProfile(data.session.user.id);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Create the account server-side, already email-confirmed (no confirmation
    // email is ever sent), then establish a session immediately.
    const res = await signUpConfirmed({ data: { email, password, fullName } });
    if ("error" in res && res.error) {
      // If the email already exists, fall through to a normal sign-in.
      if (res.alreadyExists) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error
          ? { error: "An account with this email already exists — wrong password?" }
          : {};
      }
      return { error: res.error };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const setRole = async (role: AppRole) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role }, { onConflict: "id" });
    if (error) return { error: error.message };
    setProfile((p) => (p ? { ...p, role } : { id: user.id, full_name: null, role }));
    return {};
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{ loading, user, session, profile, signIn, signUp, signOut, setRole, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
