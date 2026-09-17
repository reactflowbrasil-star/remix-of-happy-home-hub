import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Images, Play, Sparkles, WandSparkles } from "lucide-react";

const title = "Cenaria Studio — Cenas de produto com IA";
const description =
  "Transforme a foto do seu produto em cenas verticais 9:16 e vídeos prontos para publicar, com IA e pessoas reais.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  ["01", "Envie sua foto", "Escolha uma imagem clara do produto e organize seu projeto."],
  ["02", "Monte sua cena", "Selecione uma pessoa, ambiente e instruções para a composição."],
  ["03", "Gere o vídeo", "Transforme a cena em um vídeo vertical pronto para revisar e baixar."],
];
const features = [
  [
    Images,
    "Biblioteca de cenas",
    "Tudo que você gera fica organizado e acessível no seu histórico.",
  ],
  [
    WandSparkles,
    "Cenas com contexto",
    "Escolha ambiente, pessoa e instruções para criar imagens mais úteis.",
  ],
  [Play, "Vídeos verticais", "Gere vídeos no formato ideal para Reels, TikTok e Shorts."],
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-display text-2xl tracking-wide">
            CENARIA<span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#como-funciona" className="hover:text-foreground">
              Como funciona
            </a>
            <a href="#recursos" className="hover:text-foreground">
              Recursos
            </a>
            <a href="#para-quem" className="hover:text-foreground">
              Para quem é
            </a>
          </nav>
          <Link
            to="/estudio"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Entrar no estúdio
          </Link>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(closest-side, var(--color-primary), transparent)",
            }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Criação visual com IA
              </p>
              <h1 className="text-display text-6xl leading-[0.93] sm:text-7xl lg:text-8xl">
                SUA FOTO.
                <br />
                <span className="text-primary">SUA CENA.</span>
                <br />
                SEU VÍDEO.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                O Cenaria Studio transforma uma foto simples do seu produto em imagens verticais
                9:16 e vídeos que ajudam sua marca a aparecer melhor nas redes.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/estudio"
                  className="ember-glow inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-bold text-primary-foreground"
                >
                  Criar minha primeira cena <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 font-semibold"
                >
                  <Play className="h-4 w-4 text-primary" /> Como funciona
                </a>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Comece com uma foto do produto. O resultado fica salvo no seu estúdio.
              </p>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-card p-4 shadow-2xl shadow-primary/10">
              <div className="flex aspect-[9/12] flex-col justify-between rounded-2xl bg-gradient-to-br from-primary/25 via-background to-primary/5 p-6">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-primary">
                  <span>Cenaria Studio</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <WandSparkles className="mx-auto h-14 w-14 text-primary" />
                  <p className="text-display mt-5 text-5xl leading-none">
                    CRIANDO
                    <br />
                    <span className="text-primary">AGORA</span>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Cena vertical pronta para sua próxima publicação
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Formato</span>
                    <strong>9:16</strong>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div className="h-2 w-4/5 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="como-funciona" className="border-y border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Do produto ao conteúdo
            </p>
            <h2 className="text-display mt-2 text-5xl leading-none sm:text-6xl">
              CRIE EM POUCOS PASSOS
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map(([n, h, t]) => (
                <article key={n} className="rounded-2xl border border-border bg-background p-7">
                  <span className="text-display text-6xl text-primary/30">{n}</span>
                  <h3 className="text-display mt-4 text-3xl">{h}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="recursos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(([Icon, h, t]) => (
              <article key={h as string} className="rounded-2xl border border-border bg-card p-7">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-6 text-xl font-bold">{h as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t as string}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="para-quem" className="border-t border-border">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Para criadores e marcas
            </p>
            <h2 className="text-display mt-3 text-6xl leading-none sm:text-7xl">
              PARE DE COMEÇAR DO ZERO
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Crie uma biblioteca visual consistente para divulgar produtos, testar ideias e
              publicar com mais velocidade.
            </p>
            <Link
              to="/estudio"
              className="ember-glow mt-9 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground"
            >
              Entrar no Cenaria <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-display text-xl text-foreground">
              CENARIA<span className="text-primary">.</span>
            </p>
            <p className="mt-1">Criação visual para produtos com IA.</p>
          </div>
          <div className="text-left sm:text-right">
            <p>© 2026 Cenaria Studio. Todos os direitos reservados.</p>
            <p className="mt-1">Imagens e vídeos gerados com inteligência artificial.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
