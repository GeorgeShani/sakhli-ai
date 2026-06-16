import { useI18n, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const opts: { code: Locale; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ka", label: "ქა" },
  ];
  return (
    <div className="inline-flex rounded-md border border-border bg-card p-0.5 text-xs">
      {opts.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLocale(o.code)}
          className={[
            "px-2 py-1 rounded-sm font-medium transition-colors",
            locale === o.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
