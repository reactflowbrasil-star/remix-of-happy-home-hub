import { Outlet, createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { data: sub } = useSubscription();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-7">
            <Link to="/" className="text-display text-2xl tracking-wide">
              CENARIA<span className="text-primary">.</span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm md:flex">
              <Link
                to="/estudio"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "font-semibold text-foreground" }}
              >
                Estúdio
              </Link>
              <Link
                to="/galeria"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "font-semibold text-foreground" }}
              >
                Galeria
              </Link>
              <Link
                to="/minhas-cenas"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "font-semibold text-foreground" }}
              >
                Minhas cenas
              </Link>
              <Link
                to="/precos"
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "font-semibold text-foreground" }}
              >
                Planos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/precos"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary/60"
            >
              <Coins className="h-4 w-4 text-primary" />
              {sub ? `${sub.credits} créditos` : "…"}
            </Link>
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
