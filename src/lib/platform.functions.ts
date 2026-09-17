import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // Opaque sb_ keys aren't JWTs; send only apikey, not the default bearer.
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export type PlanRow = {
  id: string;
  name: string;
  price_cents: number;
  monthly_credits: number;
  highlight: boolean;
  features: string[];
};

export const getPlans = createServerFn({ method: "GET" }).handler(async (): Promise<PlanRow[]> => {
  const db = publicClient();
  const { data, error } = await db
    .from("plans")
    .select("id, name, price_cents, monthly_credits, highlight, features")
    .order("sort_order");
  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    price_cents: p.price_cents,
    monthly_credits: p.monthly_credits,
    highlight: p.highlight,
    features: Array.isArray(p.features)
      ? p.features.filter((f): f is string => typeof f === "string")
      : [],
  }));
});

export type GalleryModel = {
  id: string;
  name: string;
  gender: string;
  description: string | null;
  url: string | null;
};

export const getGallery = createServerFn({ method: "GET" }).handler(async (): Promise<GalleryModel[]> => {
  const db = publicClient();
  const { data, error } = await db
    .from("gallery_models")
    .select("id, name, gender, description, image_url")
    .eq("active", true)
    .order("sort_order");
  if (error || !data) return [];

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return Promise.all(
    data.map(async (m) => {
      const { data: signed } = await supabaseAdmin.storage
        .from("gallery")
        .createSignedUrl(m.image_url, 60 * 60 * 24 * 6);
      return {
        id: m.id,
        name: m.name,
        gender: m.gender,
        description: m.description,
        url: signed?.signedUrl ?? null,
      };
    }),
  );
});
