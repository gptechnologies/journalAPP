import type { RealtimeChannel } from "@supabase/supabase-js";

import type { GroupsRealtimePayload } from "@/types/groups";
import { getSupabaseClient } from "./supabase-browser";

export type GroupsRealtimeCallback = (payload: GroupsRealtimePayload) => void;

export function subscribeToGroups(callback: GroupsRealtimeCallback): RealtimeChannel {
  const supabase = getSupabaseClient();

  const channel = supabase
    .channel("public:groups")
    .on<GroupsRealtimePayload>("postgres_changes", { schema: "public", table: "groups", event: "INSERT" }, callback)
    .on<GroupsRealtimePayload>("postgres_changes", { schema: "public", table: "groups", event: "UPDATE" }, callback)
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.info("Connected to groups realtime channel");
      }
    });

  return channel;
}

export function unsubscribeFromGroups(channel: RealtimeChannel | null | undefined) {
  if (!channel) {
    return;
  }

  channel.unsubscribe();
}
