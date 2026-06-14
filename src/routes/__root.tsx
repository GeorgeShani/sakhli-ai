import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider, useI18n } from "../lib/i18n";
import { AuthProvider } from "../lib/auth";
import { ThemeProvider } from "../lib/theme";
import { AiAssistantBubble } from "../components/AiAssistantBubble";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SakhliAI — Smart rentals for Georgia" },
      {
        name: "description",
        content:
          "Match with compatible flatmates and long-term homes in Georgia. Behavior-based matching and utility splitting for students.",
      },
      { name: "author", content: "SakhliAI" },
      { property: "og:title", content: "SakhliAI — Smart rentals for Georgia" },
      {
        property: "og:description",
        content: "Match with compatible flatmates and long-term homes in Georgia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "SakhliAI — Smart rentals for Georgia" },
      { name: "description", content: "SakhliAI is a hybrid PropTech/EduTech platform for Georgia, matching student flatmates and automating short-term rentals." },
      { property: "og:description", content: "SakhliAI is a hybrid PropTech/EduTech platform for Georgia, matching student flatmates and automating short-term rentals." },
      { name: "twitter:description", content: "SakhliAI is a hybrid PropTech/EduTech platform for Georgia, matching student flatmates and automating short-term rentals." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ac126174-6c17-461a-a1c5-afeae3ccb442/id-preview-18c293ba--e8a38f6d-1801-4fe5-b720-f1ea33cfebdb.lovable.app-1781356379028.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ac126174-6c17-461a-a1c5-afeae3ccb442/id-preview-18c293ba--e8a38f6d-1801-4fe5-b720-f1ea33cfebdb.lovable.app-1781356379028.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Urbanist:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Noto+Sans+Georgian:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <MotionConfig reducedMotion="user">
              <LocaleBodyWrapper>
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
                <AiAssistantBubble />
                <Toaster richColors position="top-right" />
              </LocaleBodyWrapper>
            </MotionConfig>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function LocaleBodyWrapper({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  return (
    <div data-locale={locale} className="min-h-screen">
      {children}
    </div>
  );
}
