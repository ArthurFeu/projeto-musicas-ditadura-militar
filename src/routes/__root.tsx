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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <p className="mt-4 font-typewriter text-sm uppercase tracking-widest text-muted-foreground">
          página silenciada pela censura
        </p>
        <Link
          to="/"
          className="mt-6 inline-block border-b-2 border-primary font-display text-primary"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Algo desafinou</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 border-2 border-ink px-4 py-2 font-typewriter text-xs uppercase tracking-widest"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Músicas da Ditadura — Infográfico interativo" },
      {
        name: "description",
        content:
          "Infográfico interativo sobre a MPB durante a Ditadura Militar brasileira (1964–1985).",
      },
      { property: "og:title", content: "Músicas da Ditadura" },
      {
        property: "og:description",
        content:
          "Infográfico interativo sobre a MPB durante a Ditadura Militar brasileira (1964–1985).",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&family=Special+Elite&display=swap",
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
    <html lang="pt-BR">
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

function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b-2 border-ink/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-lg uppercase tracking-tight">
          Músicas <span className="text-crimson">·</span> Ditadura
        </Link>
        <div className="flex items-center gap-4 font-typewriter text-[11px] uppercase tracking-widest">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-crimson" }}>
            Início
          </Link>
          <Link to="/visao-geral" activeProps={{ className: "text-crimson" }}>
            Visão geral
          </Link>
          <Link to="/acervo" activeProps={{ className: "text-crimson" }}>
            Acervo completo
          </Link>
        </div>
      </div>
    </nav>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <Outlet />
      <footer className="mt-16 border-t-2 border-ink/30 py-8 text-center font-typewriter text-[11px] uppercase tracking-widest text-muted-foreground">
        Músicas da Ditadura
      </footer>
    </QueryClientProvider>
  );
}
