import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Subscription = {
  credits: number;
  plan_id: string;
  renews_at: string;
};

export function useSubscription() {
  return useQuery<Subscription | null>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("credits, plan_id, renews_at")
        .eq("user_id", data.user.id)
        .maybeSingle();
      return sub ?? null;
    },
  });
}

export function useInvalidateSubscription() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: ["subscription"] });
}
