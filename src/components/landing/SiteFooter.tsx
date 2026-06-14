import { Link } from "@tanstack/react-router";
import { Home, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-4 w-4" />
              </span>
              {t("app.name")}
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("land.footer.tagline")}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" /> {t("land.footer.lang")}
            </p>
          </div>

          <FooterCol
            title={t("land.footer.product")}
            links={[
              { label: t("land.nav.how"), href: "#how" },
              { label: t("land.nav.features"), href: "#features" },
              { label: t("land.nav.automation"), href: "#automation" },
            ]}
          />
          <div>
            <h4 className="font-display text-sm font-semibold">{t("land.footer.company")}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/role-select" search={{ role: "student" }} className="transition-colors hover:text-foreground">
                  {t("land.footer.students")}
                </Link>
              </li>
              <li>
                <Link to="/role-select" search={{ role: "host" }} className="transition-colors hover:text-foreground">
                  {t("land.footer.hosts")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
