import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SceneCard, type SceneItem, type VideoState } from "@/components/scene-card";

export const Route = createFileRoute("/_authenticated/minhas-cenas")({
  head: () => ({
    meta: [
      { title: "Minhas cenas — Cenaria" },
      {
        name: "description",
        content: "Todo o histórico de cenas e vídeos gerados a partir dos seus produtos.",
      },
      { property: "og:title", content: "Minhas cenas — Cenaria" },
      { property: "og:description", content: "Histórico de cenas e vídeos gerados com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinhasCenasPage,
});

function MinhasCenasPage() {
  const [overrides, setOverrides] = useState<Record<string, VideoState>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["library"],
    queryFn: async (): Promise<SceneItem[]> => {
      const [scenesRes, videosRes] = await Promise.all([
        supabase
          .from("scenes")
          .select(
            "id, scenario, image_path, created_at, model:gallery_models(name), project:projects(title)",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("videos")
          .select("id, scene_id, status, video_path, error")
          .order("created_at", { ascending: false }),
      ]);

      const scenes = scenesRes.data ?? [];
      const videos = videosRes.data ?? [];

      return Promise.all(
        scenes.map(async (s) => {
          let url: string | null = null;
          if (s.image_path) {
            const { data: signed } = await supabase.storage
              .from("scenes")
              .createSignedUrl(s.image_path, 60 * 60 * 24);
            url = signed?.signedUrl ?? null;
          }
          const v = videos.find((x) => x.scene_id === s.id);
          let video: VideoState | null = null;
          if (v) {
            if (v.status === "done" && v.video_path) {
              const { data: signed } = await supabase.storage
                .from("videos")
                .createSignedUrl(v.video_path, 60 * 60 * 24);
              video = { id: v.id, status: "done", url: signed?.signedUrl ?? null };
            } else {
              video = { id: v.id, status: v.status, url: null, error: v.error };
            }
          }
          const model = s.model as { name: string } | null;
          return {
            id: s.id,
            url,
            scenario: s.scenario ?? "Cena",
            model: model?.name ?? "",
            video,
          };
        }),
      );
    },
  });

  const handleVideoUpdate = useCallback((sceneId: string, video: VideoState) => {
    setOverrides((prev) => ({ ...prev, [video.id]: video }));
  }, []);

  const items = (data ?? []).map((s) =>
    s.video && overrides[s.video.id] ? { ...s, video: overrides[s.video.id] } : s,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Histórico</p>
      <h1 className="text-display mt-1 text-5xl leading-none">MINHAS CENAS</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Todas as cenas e vídeos que você gerou, prontos para baixar.
      </p>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <h2 className="text-display text-3xl leading-none">NADA GERADO AINDA</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Suas primeiras cenas aparecem aqui assim que você criar no estúdio.
          </p>
          <Link
            to="/estudio"
            className="ember-glow mt-5 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Criar minha primeira cena
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((s) => (
            <SceneCard key={s.id} item={s} onVideoUpdate={handleVideoUpdate} />
          ))}
        </div>
      )}
    </main>
  );
}
