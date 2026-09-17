import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Flame,
  Play,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import courseViral from "@/assets/course-viral.jpg";
import courseEdicao from "@/assets/course-edicao.jpg";
import courseMonetizacao from "@/assets/course-monetizacao.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Viraliza — Cursos para Criadores de TikTok",
      },
      {
        name: "description",
        content:
          "Aprenda a viralizar no TikTok, editar vídeos que prendem e monetizar sua audiência. Cursos práticos para criadores.",
      },
      {
        property: "og:title",
        content: "Viraliza — Cursos para Criadores de TikTok",
      },
      {
        property: "og:description",
        content:
          "Cursos práticos para criadores: crescimento, edição e monetização no TikTok.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const courses = [
  {
    slug: "viral",
    image: courseViral,
    level: "Iniciante",
    title: "TikTok do Zero ao Viral",
    description:
      "O método completo para criar vídeos que o algoritmo ama — do primeiro post aos milhões de views.",
    meta: "32 aulas · 6h de conteúdo",
    price: "R$ 297",
    featured: false,
  },
  {
    slug: "edicao",
    image: courseEdicao,
    level: "Todos os níveis",
    title: "Edição que Prende",
    description:
      "Cortes, ritmo, legendas e ganchos: faça o espectador assistir até o último segundo.",
    meta: "24 aulas · 4h de conteúdo",
    price: "R$ 197",
    featured: false,
  },
  {
    slug: "monetizacao",
    image: courseMonetizacao,
    level: "Avançado",
    title: "Monetização & Marca",
    description:
      "Transforme seguidores em renda: publis, produtos próprios e contratos de longo prazo.",
    meta: "28 aulas · 5h de conteúdo",
    price: "R$ 397",
    featured: false,
  },
];

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="text-display text-2xl tracking-wide">
          VIRALIZA<span className="text-primary">.</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#cursos" className="transition-colors hover:text-foreground">
            Cursos
          </a>
          <a href="#metodo" className="transition-colors hover:text-foreground">
            Método
          </a>
          <a
            href="#depoimentos"
            className="transition-colors hover:text-foreground"
          >
            Resultados
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            Dúvidas
          </a>
        </nav>
        <a
          href="#cursos"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Começar agora
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-primary), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Flame className="h-3.5 w-3.5" />
            Escola de criadores
          </p>
          <h1 className="text-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            FAÇA SEU TIKTOK
            <br />
            <span className="text-primary">VIRALIZAR</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Cursos direto ao ponto para criadores que querem crescer de
            verdade: mais views, mais seguidores e mais dinheiro — sem fórmula
            mágica.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#cursos"
              className="ember-glow inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Ver cursos
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#metodo"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-base font-semibold transition-colors hover:bg-accent"
            >
              <Play className="h-4 w-4 text-primary" />
              Como funciona
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-primary text-primary"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4,9/5</span> de
              mais de 2.000 alunos
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="ember-glow overflow-hidden rounded-2xl border border-border">
            <img
              src={heroImg}
              alt="Criadora de conteúdo gravando vídeo com celular e ring light"
              width={1024}
              height={1024}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-6 rounded-xl border border-border bg-card px-5 py-3 shadow-xl">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              +1,2 mi de views no 1º mês
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseCard({
  course,
}: {
  course: (typeof courses)[number];
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50">
      <div className="overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          width={768}
          height={768}
          loading="lazy"
          className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {course.level}
        </p>
        <h3 className="text-display mt-2 text-3xl leading-none">
          {course.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">{course.meta}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <p className="text-2xl font-bold">{course.price}</p>
          <a
            href="#comprar"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Quero esse
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function Bento() {
  return (
    <section id="cursos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Os cursos
          </p>
          <h2 className="text-display mt-2 text-5xl leading-none sm:text-6xl">
            ESCOLHA SEU PRÓXIMO NÍVEL
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Compre separado ou leve o combo completo com desconto. Acesso vitalício
          e atualizações incluídas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-4">
          <CourseCard course={courses[0]!} />
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground md:col-span-2">
          <div>
            <TrendingUp className="h-8 w-8" />
            <p className="text-display mt-6 text-7xl leading-none">+12 mil</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide">
              alunos formados
            </p>
          </div>
          <p className="mt-6 text-sm opacity-80">
            Criadores de todos os tamanhos — de 0 a milhões de seguidores.
          </p>
        </div>

        <div className="md:col-span-2">
          <CourseCard course={courses[1]!} />
        </div>
        <div className="md:col-span-2">
          <CourseCard course={courses[2]!} />
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-primary/60 bg-card p-6 md:col-span-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Combo completo · Economize R$ 294
            </p>
            <h3 className="text-display mt-3 text-4xl leading-none">
              OS 3 CURSOS
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                "Acesso vitalício aos 3 cursos",
                "Comunidade fechada de alunos",
                "Aulas novas todo mês",
                "Certificado de conclusão",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm text-muted-foreground line-through">
              R$ 891
            </p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-3xl font-bold text-primary">R$ 597</p>
              <a
                href="#comprar"
                className="ember-glow inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                Levar combo
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "ASSISTA",
    text: "Aulas curtas e práticas, direto do celular ou do computador. Sem enrolação.",
  },
  {
    n: "02",
    title: "APPLIQUE",
    text: "Siga os roteiros e modelos prontos para gravar, editar e postar ainda na mesma semana.",
  },
  {
    n: "03",
    title: "MONETIZE",
    text: "Use o passo a passo de negociação para transformar views em renda recorrente.",
  },
];

function Method() {
  return (
    <section id="metodo" className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          O método
        </p>
        <h2 className="text-display mt-2 text-5xl leading-none sm:text-6xl">
          SIMPLES ASSIM
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-border bg-background p-8"
            >
              <p className="text-display text-6xl leading-none text-primary/30">
                {step.n}
              </p>
              <h3 className="text-display mt-4 text-3xl leading-none">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Marina L.",
    handle: "@marinacria · 380K seguidores",
    text: "Em 60 dias saí de 8 mil para 380 mil seguidores. O módulo de ganchos mudou meu jogo.",
  },
  {
    name: "Diego F.",
    handle: "@diegofit · 92K seguidores",
    text: "Fechei minha primeira pub de R$ 2.500 um mês depois de terminar o curso de monetização.",
  },
  {
    name: "Camila R.",
    handle: "@camilarecebe · 51K seguidores",
    text: "Eu postava há 2 anos sem direção. Hoje tenho calendário de conteúdo e vídeos com 1M+ de views.",
  },
];

function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Resultados
      </p>
      <h2 className="text-display mt-2 text-5xl leading-none sm:text-6xl">
        QUEM JÁ ESTÁ VIVENDO DISSO
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6"
          >
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.handle}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Nunca postei nada. Por onde começo?",
    a: "Pelo TikTok do Zero ao Viral. Ele assume que você está começando do absoluto zero e te leva até os primeiros vídeos com desempenho.",
  },
  {
    q: "Por quanto tempo tenho acesso?",
    a: "Acesso vitalício. Você paga uma vez e recebe todas as atualizações futuras do curso sem custo extra.",
  },
  {
    q: "Funciona para quem não aparece nos vídeos?",
    a: "Sim. Temos módulos específicos de conteúdo sem rosto: narração, textos na tela e vídeos com material de terceiros licenciado.",
  },
  {
    q: "Tem garantia?",
    a: "Garantia incondicional de 7 dias. Se não for para você, devolvemos 100% do valor, sem perguntas.",
  },
];

function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Dúvidas
        </p>
        <h2 className="text-display mt-2 text-5xl leading-none sm:text-6xl">
          PERGUNTAS FREQUENTES
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border bg-background px-6 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="comprar" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[400px] -translate-y-1/2 opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-primary), transparent)",
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <Wallet className="mx-auto h-10 w-10 text-primary" />
        <h2 className="text-display mt-6 text-6xl leading-[0.95] sm:text-7xl">
          SEU MOMENTO DE{" "}
          <span className="text-primary">COMEÇAR É AGORA</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Cada dia sem postar é um dia de audiência indo para outro criador.
          Comece hoje com garantia de 7 dias.
        </p>
        <a
          href="#cursos"
          className="ember-glow mt-9 inline-flex items-center gap-2 rounded-lg bg-primary px-9 py-4 text-lg font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Garantir meu acesso
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p className="text-display text-xl tracking-wide text-foreground">
          VIRALIZA<span className="text-primary">.</span>
        </p>
        <p>© 2026 Viraliza. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Bento />
        <Method />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
