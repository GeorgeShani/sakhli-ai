import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  FileText,
  Lock,
  Users,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [
      { title: "Parents' Assurance — SakhliAI" },
      { name: "description", content: "View-only oversight for parents and guarantors." },
    ],
  }),
  component: () => (
    <AuthGate>
      <ParentPortal />
    </AuthGate>
  ),
});

const STUDENT = {
  name: "Nino Beridze",
  university: "Tbilisi State University",
  city: "Tbilisi · ვაკე",
};

const FLATMATES = [
  { name: "Tamar K.", score: 92, note: "High lifestyle match · same sleep schedule" },
  { name: "Giorgi L.", score: 81, note: "Strong financial fit · shared cleanliness 4/5" },
  { name: "Mariam Sh.", score: 74, note: "Compatible budget · differing pet preference" },
];

const LEASE = {
  property: "ვაკე · 2BR Modern Apartment",
  monthlyRent: 1800,
  term: "12 months",
  startDate: "2026-09-01",
  endDate: "2027-08-31",
  vetted: true,
  vettedBy: "SakhliAI Legal · licensed Georgian attorney",
};

const DEPOSIT = {
  amount: 1800,
  status: "Held in Escrow",
  vault: "SakhliAI Vault · TBC Bank custody",
  protectedSince: "2026-08-15",
};

function ParentPortal() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600">
              <Eye className="h-3 w-3" /> View-only
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
              მშობლის კონტროლი
            </h1>
            <p className="text-sm text-muted-foreground">
              Parents' Assurance Portal · oversight for {STUDENT.name}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>{STUDENT.university}</div>
            <div>{STUDENT.city}</div>
          </div>
        </div>

        {/* Hero status */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatusCard
            icon={<Users className="h-4 w-4" />}
            label="Flatmate Match"
            value="92%"
            sub="Top compatibility"
            tone="from-primary/15 to-primary/5 text-primary"
          />
          <StatusCard
            icon={<FileText className="h-4 w-4" />}
            label="Lease"
            value="Vetted"
            sub="By SakhliAI Legal"
            tone="from-emerald-500/15 to-emerald-500/5 text-emerald-600"
          />
          <StatusCard
            icon={<Lock className="h-4 w-4" />}
            label="Security Deposit"
            value={`${DEPOSIT.amount} GEL`}
            sub={DEPOSIT.status}
            tone="from-accent/20 to-accent/5 text-accent"
          />
        </div>

        {/* Flatmate compatibility */}
        <section className="card-elevated mb-6 p-5">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Flatmate Compatibility</h2>
              <p className="text-xs text-muted-foreground">
                AI Fit Scores from SakhliAI's behavioral & financial model.
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-accent" />
          </header>
          <div className="grid gap-3 md:grid-cols-3">
            {FLATMATES.map((f) => (
              <div key={f.name} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{f.name}</div>
                  <Badge
                    variant="secondary"
                    className={
                      f.score >= 90
                        ? "bg-emerald-500/15 text-emerald-700"
                        : f.score >= 80
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-foreground"
                    }
                  >
                    {f.score}% fit
                  </Badge>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{f.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lease + Deposit */}
        <section className="mb-6 grid gap-4 md:grid-cols-2">
          {/* Lease */}
          <div className="card-elevated p-5">
            <header className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold">Lease Agreement</h2>
              </div>
              {LEASE.vetted && (
                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Vetted
                </Badge>
              )}
            </header>
            <dl className="space-y-2 text-sm">
              <Row k="Property" v={LEASE.property} />
              <Row k="Monthly rent" v={`${LEASE.monthlyRent} GEL`} />
              <Row k="Term" v={LEASE.term} />
              <Row k="Start" v={LEASE.startDate} />
              <Row k="End" v={LEASE.endDate} />
              <Row k="Reviewed by" v={LEASE.vettedBy} />
            </dl>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => alert("Mock: download lease PDF")}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              View signed lease (PDF)
            </Button>
          </div>

          {/* Deposit */}
          <div className="card-elevated relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-accent/30 to-transparent blur-2xl" />
            <header className="relative mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <h2 className="font-display text-lg font-semibold">SakhliAI Vault</h2>
              </div>
              <Badge className="bg-accent/15 text-accent">Protected</Badge>
            </header>
            <div className="relative">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Security deposit
              </div>
              <div className="font-display text-4xl font-bold text-gradient">
                ₾ {DEPOSIT.amount.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {DEPOSIT.status} · {DEPOSIT.vault}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Protected since {DEPOSIT.protectedSince}
              </div>

              <div className="mt-5 space-y-2 text-xs">
                <FlowStep done label="Funds received from guarantor" />
                <FlowStep done label="Locked in escrow at TBC Bank" />
                <FlowStep label="Released after move-out inspection" />
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          You are in view-only mode. Edits and payments must be made by the student account holder.
        </p>
      </main>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: string;
}) {
  return (
    <div className="card-elevated relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${tone} blur-2xl opacity-60`} />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          {icon} {label}
        </div>
        <div className="mt-1 font-display text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-1.5 last:border-0">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function FlowStep({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-2 w-2 rounded-full ${done ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
      />
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
