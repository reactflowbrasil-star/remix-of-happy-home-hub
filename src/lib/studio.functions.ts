import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const SCENE_COST = 1;
const VIDEO_COST = 5;

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta";
const IMAGE_MODEL = "gemini-3.1-flash-image";
const HF_IMAGE_API =
  "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";
const VIDEO_MODEL = "google/gemini-omni-1.1-flash";

function apiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Configuração de IA ausente.");
  return key;
}

function geminiKey() {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("Configure GEMINI_API_KEY para gerar imagens.");
  return key;
}

function hfKey() {
  const key = process.env["HF_TOKEN"];
  if (!key) throw new Error("Configure HF_TOKEN para gerar imagens.");
  return key;
}

async function admin() {
  const mod = await import("@/integrations/supabase/client.server");
  return mod.supabaseAdmin;
}

async function toDataUrl(
  bucket: string,
  path: string,
): Promise<{ dataUrl: string; mime: string; bytes: Uint8Array }> {
  const db = await admin();
  const { data, error } = await db.storage.from(bucket).download(path);
  if (error || !data) throw new Error("Não consegui abrir a imagem enviada.");
  const buf = new Uint8Array(await data.arrayBuffer());
  const mime = data.type || "image/jpeg";
  let binary = "";
  for (let i = 0; i < buf.length; i += 0x8000) {
    binary += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  }
  const b64 = btoa(binary);
  return { dataUrl: `data:${mime};base64,${b64}`, mime, bytes: buf };
}

function scenePrompt(scenario: string, extra: string | null) {
  return [
    "Create one photorealistic vertical 9:16 social media photo (portrait, full frame, no borders, no text).",
    "The FIRST reference image is a product. The SECOND reference image is a real person model.",
    "Show that exact person, with the same face, body type and look, naturally using or presenting that exact product.",
    "Keep the product's shape, colours, label and details identical to the reference.",
    `Scene: ${scenario}.`,
    "Natural lighting, candid UGC smartphone-style photography, sharp product detail, framing suitable for TikTok and Reels.",
    extra ? `Extra direction: ${extra}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

async function gatewayError(res: Response) {
  const text = await res.text();
  if (res.status === 429) return "Muitas gerações ao mesmo tempo. Tente de novo em instantes.";
  if (res.status === 402) return "Os créditos de IA do app acabaram. Avise o responsável pelo app.";
  console.error("[gateway]", res.status, text.slice(0, 500));
  return "A IA não conseguiu gerar agora. Tente novamente.";
}

export const generateScenes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        projectId: z.string().uuid(),
        modelId: z.string().uuid(),
        scenario: z.string().min(2),
        count: z.number().int().min(1).max(4),
        extra: z.string().max(400).nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const db = await admin();

    const { data: project } = await db
      .from("projects")
      .select("id, product_path, user_id")
      .eq("id", data.projectId)
      .maybeSingle();
    if (!project || project.user_id !== userId) throw new Error("Produto não encontrado.");

    const { data: model } = await db
      .from("gallery_models")
      .select("id, name, gender, image_url")
      .eq("id", data.modelId)
      .maybeSingle();
    if (!model) throw new Error("Pessoa não encontrada na galeria.");

    const { data: sub } = await db
      .from("subscriptions")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();
    if (!sub || sub.credits < data.count * SCENE_COST) {
      throw new Error("Créditos insuficientes. Escolha um plano para continuar.");
    }

    const product = await toDataUrl("products", project.product_path);
    const person = await toDataUrl("gallery", model.image_url);

    const created: { id: string; path: string }[] = [];

    for (let i = 0; i < data.count; i++) {
      const { error: spendError } = await db.rpc("spend_credits", {
        _user_id: userId,
        _amount: SCENE_COST,
      });
      if (spendError) throw new Error("Créditos insuficientes. Escolha um plano para continuar.");

      const res = await fetch(HF_IMAGE_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${hfKey()}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: scenePrompt(data.scenario, data.extra),
          parameters: { width: 768, height: 1360, num_inference_steps: 4 },
        }),
      });

      if (!res.ok) {
        await db.from("subscriptions").update({ credits: sub.credits }).eq("user_id", userId);
        throw new Error(await gatewayError(res));
      }

      const bytes = new Uint8Array(await res.arrayBuffer());

      const path = `${userId}/${crypto.randomUUID()}.png`;
      const { error: upErr } = await db.storage
        .from("scenes")
        .upload(path, bytes, { contentType: "image/jpeg" });
      if (upErr) throw new Error("Não consegui salvar a cena gerada.");

      const { data: row, error: insErr } = await db
        .from("scenes")
        .insert({
          user_id: userId,
          project_id: project.id,
          model_id: model.id,
          scenario: data.scenario,
          prompt: scenePrompt(data.scenario, data.extra),
          image_path: path,
          status: "done",
        })
        .select("id")
        .single();
      if (insErr || !row) throw new Error("Não consegui salvar a cena gerada.");
      created.push({ id: row.id, path });
    }

    const { data: after } = await db
      .from("subscriptions")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();

    return { scenes: created, credits: after?.credits ?? 0 };
  });

export const startVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ sceneId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const db = await admin();

    const { data: scene } = await db
      .from("scenes")
      .select("id, user_id, image_path, scenario")
      .eq("id", data.sceneId)
      .maybeSingle();
    if (!scene || scene.user_id !== userId || !scene.image_path) {
      throw new Error("Cena não encontrada.");
    }

    const { error: spendError } = await db.rpc("spend_credits", {
      _user_id: userId,
      _amount: VIDEO_COST,
    });
    if (spendError) throw new Error("Créditos insuficientes para gerar o vídeo.");

    const frame = await toDataUrl("scenes", scene.image_path);
    const base64 = frame.dataUrl.split(",", 2)[1] ?? "";

    const res = await fetch(`${GATEWAY}/videos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: VIDEO_MODEL,
        input: [
          {
            type: "text",
            text: `Animate this photo into a natural short vertical clip. The person moves subtly and presents the product to camera, handheld smartphone feel, gentle camera push-in, in a single continuous shot. Scene: ${scene.scenario ?? "product showcase"}. No dialogue, no on-screen text. Soft ambient background sound only.`,
          },
          { type: "image", data: base64, mime_type: frame.mime },
        ],
        response_format: {
          type: "video",
          resolution: "720p",
          duration: "5s",
          aspect_ratio: "9:16",
        },
      }),
    });

    if (!res.ok) throw new Error(await gatewayError(res));
    const job = (await res.json()) as { id: string };

    const { data: row, error } = await db
      .from("videos")
      .insert({ user_id: userId, scene_id: scene.id, job_id: job.id, status: "processing" })
      .select("id")
      .single();
    if (error || !row) throw new Error("Não consegui iniciar o vídeo.");

    return { videoId: row.id };
  });

export const checkVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ videoId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const db = await admin();

    const { data: video } = await db
      .from("videos")
      .select("id, user_id, job_id, status, video_path")
      .eq("id", data.videoId)
      .maybeSingle();
    if (!video || video.user_id !== userId) throw new Error("Vídeo não encontrado.");
    if (video.status === "done" || video.status === "failed" || !video.job_id) {
      return { status: video.status, path: video.video_path };
    }

    const res = await fetch(`${GATEWAY}/videos/${video.job_id}`, {
      headers: { Authorization: `Bearer ${apiKey()}` },
    });
    if (!res.ok) return { status: "processing", path: null };

    const job = (await res.json()) as {
      status: string;
      error?: { message?: string };
    };

    if (job.status === "failed") {
      await db
        .from("videos")
        .update({ status: "failed", error: job.error?.message ?? "falhou" })
        .eq("id", video.id);
      return { status: "failed", path: null };
    }

    if (job.status !== "completed") return { status: "processing", path: null };

    const contentRes = await fetch(`${GATEWAY}/videos/${video.job_id}/content`, {
      headers: { Authorization: `Bearer ${apiKey()}` },
    });
    if (!contentRes.ok) return { status: "processing", path: null };

    const bytes = new Uint8Array(await contentRes.arrayBuffer());
    const path = `${userId}/${video.id}.mp4`;
    await db.storage.from("videos").upload(path, bytes, {
      contentType: "video/mp4",
      upsert: true,
    });
    await db.from("videos").update({ status: "done", video_path: path }).eq("id", video.id);

    return { status: "done", path };
  });

export const choosePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ planId: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;
    const db = await admin();

    const { data: plan } = await db
      .from("plans")
      .select("id, monthly_credits")
      .eq("id", data.planId)
      .maybeSingle();
    if (!plan) throw new Error("Plano não encontrado.");

    const { error } = await db.from("subscriptions").upsert(
      {
        user_id: userId,
        plan_id: plan.id,
        credits: plan.monthly_credits,
        status: "active",
        renews_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error("Não consegui ativar o plano.");

    return { planId: plan.id, credits: plan.monthly_credits };
  });
