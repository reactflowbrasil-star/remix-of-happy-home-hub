import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Coins, ImagePlus, Sparkles, Upload } from "lucide-react";
import { generateScenes } from "@/lib/studio.functions";
import { getGallery } from "@/lib/platform.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useInvalidateSubscription, useSubscription } from "@/hooks/useSubscription";
import { SceneCard, type SceneItem, type VideoState } from "@/components/scene-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/estudio")({
  head: () => ({
    meta: [
      { title: "Estúdio — Cenaria" },
      {
        name: "description",
        content:
          "Envie a foto do seu produto, escolha uma pessoa da galeria e gere cenas verticais 9x16 com IA.",
      },
      { property: "og:title", content: "Estúdio — Cenaria" },
      {
        property: "og:description",
        content: "Transforme a foto do seu produto em cenas com pessoas reais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstudioPage,
});

const SCENARIOS = [
  "Rua urbana movimentada",
  "Casa aconchegante",
  "Academia",
  "Café",
  "Praia ao pôr do sol",
  "Loja / vitrine",
];

function EstudioPage() {
  const fetchGallery = useServerFn(getGallery);
  const generate = useServerFn(generateScenes);
  const { user } = useAuth();
  const { data: models = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchGallery(),
  });
  const { data: sub } = useSubscription();
  const invalidateSub = useInvalidateSubscription();

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gender, setGender] = useState<"feminino" | "masculino">("feminino");
  const [modelId, setModelId] = useState<string | null>(null);
  const [scenario, setScenario] = useState<string>(SCENARIOS[0]!);
  const [extra, setExtra] = useState("");
  const [count, setCount] = useState(2);
  const [busy, setBusy] = useState(false);
  const [scenes, setScenes] = useState<SceneItem[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [lastGen, setLastGen] = useState<{
    modelId: string;
    scenario: string;
    extra: string | null;
  } | null>(null);

  const filtered = models.filter((m) => m.gender === gender);

  function pickFile(next: File | null) {
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
    setProjectId(null);
    setScenes([]);
    setLastGen(null);
  }

  async function ensureProject(): Promise<string> {
    if (projectId) return projectId;
    if (!file || !user) throw new Error("Envie a foto do produto primeiro.");
    const rawExt = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const ext = /^[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("products")
      .upload(path, file, { contentType: file.type || "image/jpeg" });
    if (upErr) throw new Error("Não consegui enviar a foto do produto.");
    const { data: project, error: pErr } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        product_path: path,
        title: file.name.replace(/\.[^.]+$/, "").slice(0, 60) || "Meu produto",
      })
      .select("id")
      .single();
    if (pErr || !project) throw new Error("Não consegui registrar o produto.");
    setProjectId(project.id);
    return project.id;
  }

  async function handleGenerate(fresh = true) {
    const mid = fresh ? modelId : (lastGen?.modelId ?? modelId);
    const scen = fresh ? scenario : (lastGen?.scenario ?? scenario);
    const ex = fresh ? (extra.trim() || null) : (lastGen?.extra ?? null);
    if (!file && !projectId) {
      toast.error("Envie a foto do produto primeiro.");
      return;
    }
    if (!mid) {
      toast.error("Escolha uma pessoa da galeria.");
      return;
    }
    const cost = fresh ? count : 1;
    if ((sub?.credits ?? 0) < cost) {
      toast.error("Créditos insuficientes. Escolha um plano para continuar.");
      return;
    }
    setBusy(true);
    try {
      const pid = await ensureProject();
      const res = await generate({
        data: { projectId: pid, modelId: mid, scenario: scen, count: cost, extra: ex },
      });
      setLastGen({ modelId: mid, scenario: scen, extra: ex });
      const modelName = models.find((m) => m.id === mid)?.name ?? "";
      const items: SceneItem[] = await Promise.all(
        res.scenes.map(async (s) => {
          const { data } = await supabase.storage.from("scenes").createSignedUrl(s.path, 60 * 60 * 24);
          return {
            id: s.id,
            url: data?.signedUrl ?? null,
            scenario: scen,
            model: modelName,
            video: null,
          };
        }),
      );
      setScenes((prev) => [...items, ...prev]);
      invalidateSub();
      toast.success(
        fresh ? `${items.length} cena(s) pronta(s)!` : "Nova cena pronta!",
      );
    } catch (error) {
      invalidateSub();
      toast.error(error instanceof Error ? error.message : "Não consegui gerar agora.");
    } finally {
      setBusy(false);
    }
  }

  const handleVideoUpdate = useCallback(
    (sceneId: string, video: VideoState) => {
      setScenes((prev) => prev.map((s) => (s.id === sceneId ? { ...s, video } : s)));
      invalidateSub();
    },
    [invalidateSub],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Estúdio</p>
          <h1 className="text-display mt-1 text-5xl leading-none">CRIAR CENAS</h1>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold">
          <Coins className="h-4 w-4 text-primary" />
          {sub ? `${sub.credits} créditos` : "…"}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px,1fr]">
        <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label>1 · Foto do produto</Label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-background transition-colors hover:border-primary/60"
            >
              {preview ? (
                <img src={preview} alt="Prévia do produto" className="h-full w-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-6 w-6 text-primary" />
                  Clique para enviar a foto
                </span>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-3">
            <Label>2 · Pessoa da cena</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["feminino", "masculino"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGender(g);
                    setModelId(null);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                    gender === g
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelId(m.id)}
                  className={`group overflow-hidden rounded-xl border-2 transition-colors ${
                    modelId === m.id ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                  title={m.description ?? m.name}
                >
                  {m.url ? (
                    <img
                      src={m.url}
                      alt={`Pessoa ${m.name}`}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-[3/4] w-full bg-muted" />
                  )}
                  <span className="block bg-background py-1 text-center text-xs font-semibold">
                    {m.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>3 · Ambiente da cena</Label>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScenario(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    scenario === s
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <Textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Instruções extras (opcional): ex. segurando o produto com as duas mãos, sorrindo"
              rows={2}
              maxLength={400}
            />
          </div>

          <div className="space-y-3">
            <Label>4 · Quantas cenas</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`h-10 w-10 rounded-lg border text-sm font-bold transition-colors ${
                    count === n
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="ember-glow w-full text-base font-bold"
            size="lg"
            onClick={() => handleGenerate(true)}
            disabled={busy || !file || !modelId}
          >
            {busy ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Gerando cenas...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Gerar {count} cena{count > 1 ? "s" : ""} · {count} crédito{count > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </section>

        <section>
          {scenes.length === 0 ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-display mt-4 text-3xl leading-none">SUAS CENAS APARECEM AQUI</h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Envie a foto do produto, escolha a pessoa e o ambiente. Cada cena sai no formato
                9x16, pronta para virar vídeo.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {scenes.map((s) => (
                <SceneCard
                  key={s.id}
                  item={s}
                  onVideoUpdate={handleVideoUpdate}
                  onRegenerate={() => handleGenerate(false)}
                />
              ))}
            </div>
          )}
          {scenes.length > 0 ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Precisa de mais variedade?{" "}
              <Link to="/precos" className="text-primary underline underline-offset-4">
                Veja os planos
              </Link>
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
