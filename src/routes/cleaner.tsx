import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Clock, MapPin, Phone, Sparkles, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/cleaner")({
  head: () => ({
    meta: [
      { title: "Cleaner portal — SakhliAI" },
      { name: "description", content: "Mobile turnover portal for cleaning staff." },
    ],
  }),
  component: () => (
    <AuthGate>
      <CleanerPortal />
    </AuthGate>
  ),
});

type Task = {
  id: string;
  property_id: string;
  scheduled_for: string;
  status: string;
  cleaner_name: string | null;
  cleaner_phone: string | null;
  notes: string | null;
};

type Property = { id: string; title: string; address: string | null; city: string | null };

const CHECKLIST = [
  "Strip beds & start laundry",
  "Bathrooms — toilet, shower, mirrors",
  "Kitchen — surfaces, sink, fridge check",
  "Floors — vacuum & mop",
  "Restock toiletries & water",
  "Trash out & lockbox reset",
];

function CleanerPortal() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [checks, setChecks] = useState<Record<string, Set<number>>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [t, p] = await Promise.all([
      supabase.from("cleaning_tasks").select("*").order("scheduled_for"),
      supabase.from("properties").select("id,title,address,city"),
    ]);
    if (t.data) setTasks(t.data as Task[]);
    if (p.data) setProperties(p.data as Property[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("cleaner-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cleaning_tasks" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const propFor = (id: string) => properties.find((p) => p.id === id);

  const toggleCheck = (taskId: string, idx: number) => {
    setChecks((prev) => {
      const set = new Set(prev[taskId] ?? []);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      return { ...prev, [taskId]: set };
    });
  };

  const complete = async (t: Task) => {
    const { error } = await supabase
      .from("cleaning_tasks")
      .update({ status: "completed" })
      .eq("id", t.id);
    if (error) toast.error(error.message);
    else toast.success("Property released back to inventory ✨");
  };

  const active = tasks.filter((t) => t.status !== "completed");
  const done = tasks.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <main className="mx-auto max-w-xl px-4 py-6">
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            დღევანდელი დავალებები
          </h1>
          <p className="text-sm text-muted-foreground">
            Today's turnovers · {active.length} active · {done.length} completed
          </p>
        </div>

        {loading ? (
          <div className="card-elevated p-10 text-center text-sm text-muted-foreground">
            Loading tasks…
          </div>
        ) : active.length === 0 ? (
          <div className="card-elevated p-10 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm text-muted-foreground">
              All clear! No active turnovers right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {active.map((t) => {
              const prop = propFor(t.property_id);
              const set = checks[t.id] ?? new Set<number>();
              const progress = Math.round((set.size / CHECKLIST.length) * 100);
              const ready = set.size === CHECKLIST.length;
              return (
                <div key={t.id} className="card-elevated overflow-hidden">
                  <div className="border-b border-border bg-gradient-to-br from-primary/8 to-transparent p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-display text-lg font-semibold">
                          {prop?.title ?? "Property"}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {prop?.address ?? prop?.city ?? "Tbilisi"}
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {t.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(t.scheduled_for).toLocaleString("en", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {t.cleaner_phone && (
                        <a href={`tel:${t.cleaner_phone}`} className="inline-flex items-center gap-1 text-primary">
                          <Phone className="h-3 w-3" /> {t.cleaner_phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="font-medium">Checklist</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="mb-3 h-1.5 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <ul className="space-y-2">
                      {CHECKLIST.map((c, i) => {
                        const checked = set.has(i);
                        return (
                          <li
                            key={i}
                            onClick={() => toggleCheck(t.id, i)}
                            className={[
                              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                              checked
                                ? "border-emerald-500/40 bg-emerald-500/5"
                                : "border-border bg-card hover:border-accent/40",
                            ].join(" ")}
                          >
                            <Checkbox checked={checked} />
                            <span className={`text-sm ${checked ? "text-muted-foreground line-through" : ""}`}>
                              {c}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {t.notes && (
                      <div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-muted-foreground">
                        <strong className="text-foreground">Notes:</strong> {t.notes}
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="mt-4 h-14 w-full text-base font-semibold"
                      disabled={!ready}
                      onClick={() => complete(t)}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      {ready ? "Mark as Completed · დასრულდა" : `Finish ${CHECKLIST.length - set.size} more item${CHECKLIST.length - set.size === 1 ? "" : "s"}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {done.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Completed today
            </h2>
            <div className="space-y-2">
              {done.slice(-5).reverse().map((t) => {
                const prop = propFor(t.property_id);
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{prop?.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Released to inventory
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await supabase
                          .from("cleaning_tasks")
                          .update({ status: "in_progress" })
                          .eq("id", t.id);
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
