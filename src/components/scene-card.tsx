import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, RefreshCw, Video } from "lucide-react";
import { toast } from "sonner";
import { checkVideo, startVideo } from "@/lib/studio.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export type VideoState = { id: string; status: string; url: string | null; error?: string | null };

export type SceneItem = {
  id: string;
  url: string | null;
  scenario: string;
  model: string;
  video: VideoState | null;
};

export async function downloadUrl(url: string | null, name: string) {
  if (!url) return;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  } catch {
    window.open(url, "_blank");
  }
}

export function SceneCard({
  item,
  onVideoUpdate,
  onRegenerate,
}: {
  item: SceneItem;
  onVideoUpdate: (sceneId: string, video: VideoState) => void;
  onRegenerate?: () => void;
}) {
  const checkVid = useServerFn(checkVideo);
  const startVid = useServerFn(startVideo);
  const [starting, setStarting] = useState(false);
  const video = item.video;
  const updateRef = useRef(onVideoUpdate);
  updateRef.current = onVideoUpdate;

  useEffect(() => {
    if (!video || video.status === "done" || video.status === "failed") return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await checkVid({ data: { videoId: video.id } });
        if (cancelled) return;
        if (res.status === "done" && res.path) {
          const { data } = await supabase.storage.from("videos").createSignedUrl(res.path, 60 * 60 * 24);
          if (!cancelled) {
            updateRef.current(item.id, { id: video.id, status: "done", url: data?.signedUrl ?? null });
          }
        } else if (res.status === "failed") {
          if (!cancelled) updateRef.current(item.id, { id: video.id, status: "failed", url: null });
        }
      } catch {
        /* segue tentando */
      }
    };
    void tick();
    const timer = setInterval(tick, 6000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [video?.id, video?.status, checkVid]);

  async function handleStartVideo() {
    setStarting(true);
    try {
      const res = await startVid({ data: { sceneId: item.id } });
      updateRef.current(item.id, { id: res.videoId, status: "processing", url: null });
      toast.success("Vídeo em produção — avisamos aqui quando ficar pronto.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não consegui iniciar o vídeo.");
    } finally {
      setStarting(false);
    }
  }

  const videoBusy = video?.status === "processing" || video?.status === "queued";

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[9/16] bg-muted">
        {item.url ? (
          <img
            src={item.url}
            alt={`Cena: ${item.scenario}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Imagem indisponível
          </div>
        )}
      </div>
      <figcaption className="space-y-3 p-4">
        <div>
          <p className="text-sm font-semibold">{item.scenario}</p>
          <p className="text-xs text-muted-foreground">com {item.model}</p>
        </div>

        {videoBusy ? (
          <p className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Gerando vídeo... pode levar um minuto.
          </p>
        ) : null}

        {video?.status === "failed" ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            O vídeo falhou. Você pode tentar de novo em uma cena nova.
          </p>
        ) : null}

        {video?.status === "done" && video.url ? (
          <video src={video.url} controls loop playsInline className="w-full rounded-lg" />
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => downloadUrl(item.url, `cena-${item.id.slice(0, 8)}.png`)}
          >
            <Download className="h-3.5 w-3.5" />
            Baixar
          </Button>
          {onRegenerate ? (
            <Button size="sm" variant="secondary" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" />
              Gerar de novo
            </Button>
          ) : null}
          {!video ? (
            <Button size="sm" className="ember-glow" onClick={handleStartVideo} disabled={starting}>
              {starting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Video className="h-3.5 w-3.5" />
              )}
              Vídeo · 5 créditos
            </Button>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
