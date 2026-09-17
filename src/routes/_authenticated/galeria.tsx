import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getGallery } from "@/lib/platform.functions";

export const Route = createFileRoute("/_authenticated/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria de pessoas — Cenaria" },
      {
        name: "description",
        content:
          "Escolha entre pessoas reais criadas por IA — variadas em gênero, idade e estilo — para estrelar as cenas do seu produto.",
      },
      { property: "og:title", content: "Galeria de pessoas — Cenaria" },
      {
        property: "og:description",
        content: "Modelos variados para estrelar as cenas do seu produto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaleriaPage,
});

function GaleriaPage() {
  const fetchGallery = useServerFn(getGallery);
  const { data: models = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchGallery(),
  });
  const [gender, setGender] = useState<"todos" | "feminino" | "masculino">("todos");

  const filtered = gender === "todos" ? models : models.filter((m) => m.gender === gender);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Galeria</p>
          <h1 className="text-display mt-1 text-5xl leading-none">ESCOLHA A PESSOA</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Pessoas criadas por IA, variadas em gênero, idade e estilo. Elas estrelam as cenas do
            seu produto com o rosto e o corpo consistentes.
          </p>
        </div>
        <div className="flex gap-2">
          {(["todos", "feminino", "masculino"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                gender === g
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((m) => (
          <figure
            key={m.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              {m.url ? (
                <img
                  src={m.url}
                  alt={`Pessoa ${m.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : null}
            </div>
            <figcaption className="p-4">
              <p className="text-sm font-bold">{m.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-primary/40 bg-card p-8 text-center">
        <h2 className="text-display text-4xl leading-none">PRONTO PARA CRIAR?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha uma dessas pessoas no estúdio e gere as cenas do seu produto.
        </p>
        <Link
          to="/estudio"
          className="ember-glow mt-5 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Ir para o estúdio
        </Link>
      </div>
    </main>
  );
}
