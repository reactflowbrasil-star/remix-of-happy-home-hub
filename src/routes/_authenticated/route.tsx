import { Outlet, createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-display text-2xl tracking-wide">
            CENARIA<span className="text-primary">.</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/estudio" className="hover:text-primary">
              Estúdio
            </Link>
            <Link to="/minhas-cenas" className="hover:text-primary">
              Minhas cenas
            </Link>
            <Link to="/precos" className="hover:text-primary">
              Planos
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
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
