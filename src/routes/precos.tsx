import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";
import { getPlans } from "@/lib/platform.functions";
import { choosePlan } from "@/lib/studio.functions";
import { supabase } from "@/integrations/supabase/client";
import { useInvalidateSubscription } from "@/hooks/useSubscription";

export const Route = createFileRoute("/precos")({
  head: () => ({
    meta: [
      { title: "Planos — Cenaria" },
      {
        name: "description",
        content:
          "Escolha seu plano de créditos e gere cenas 9x16 do seu produto com pessoas reais. Starter, Pro e Studio.",
      },
      { property: "og:title", content: "Planos — Cenaria" },
      {
        property: "og:description",
        content: "Créditos mensais para gerar cenas e vídeos do seu produto com IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(plansOptions),
  component: PrecosPage,
});

const plansOptions = queryOptions({
  queryKey: ["plans"],
  queryFn: () => getPlans(),
});

function PrecosPage() {
  const { data: plans } = useSuspenseQuery(plansOptions);
  const choose = useServerFn(choosePlan);
  const navigate = useNavigate();
  const invalidateSub = useInvalidateSubscription();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleChoose(planId: string) {
    setBusyId(planId);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.info("Crie sua conta para ativar o plano.");
        navigate({ to: "/auth" });
        return;
      }
      await choose({ data: { planId } });
      invalidateSub();
      toast.success("Plano ativado! Seus créditos já estão disponíveis.");
      navigate({ to: "/estudio" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não consegui ativar o plano.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Planos</p>
        <h1 className="text-display mt-2 text-6xl leading-[0.95] sm:text-7xl">
          ESCOLHA SEU <span className="text-primary">CRÉDITO</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Cada cena gerada custa 1 crédito. Cada vídeo curto custa 5. Seus créditos ficam guardados
          na conta e são renovados a cada ciclo do plano.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Ativação imediata — a cobrança automática chega em breve
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-7 ${
              plan.highlight
                ? "border-primary bg-card ember-glow"
                : "border-border bg-card"
            }`}
          >
            {plan.highlight ? (
              <p className="mb-3 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                Mais popular
              </p>
            ) : null}
            <h2 className="text-display text-4xl leading-none">{plan.name.toUpperCase()}</h2>
            <p className="mt-4">
              <span className="text-4xl font-bold">
                R$ {(plan.price_cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </span>
              <span className="text-sm text-muted-foreground"> /mês</span>
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">
              {plan.monthly_credits} cenas por mês
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted-foreground">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleChoose(plan.id)}
              disabled={busyId === plan.id}
              className={`mt-7 rounded-lg px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02] disabled:opacity-60 ${
                plan.highlight
                  ? "ember-glow bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground"
              }`}
            >
              {busyId === plan.id ? "Ativando..." : "Escolher este plano"}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          {
            q: "O que vale 1 crédito?",
            a: "Uma cena vertical 9x16 gerada com a pessoa e o ambiente que você escolheu.",
          },
          {
            q: "E o vídeo?",
            a: "Transformar uma cena em vídeo curto custa 5 créditos e sai no formato 9x16, pronto para postar.",
          },
          {
            q: "Os créditos acumulam?",
            a: "Ao trocar de plano, os créditos são renovados com o valor do novo plano na hora.",
          },
        ].map((f) => (
          <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold">{f.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
