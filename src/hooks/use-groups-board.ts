"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getSupabaseClient } from "@/lib/supabase-browser";
import type { Database } from "@/types/supabase";
import { mergeGroup, normalizeGroups } from "@/lib/normalize";
import { subscribeToGroups, unsubscribeFromGroups } from "@/lib/realtime";
import type { GroupCardData, GroupStatus, GroupsBoardRow, NormalizedGroups } from "@/types/groups";

interface UseGroupsBoardOptions {
  status?: GroupStatus | "all";
  search?: string;
}

interface UseGroupsBoardResult {
  groups: GroupCardData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markComplete: (id: string) => Promise<void>;
}

const INITIAL_STATE: NormalizedGroups = {
  items: new Map(),
  order: []
};

function applyFilters(state: NormalizedGroups, { status, search }: UseGroupsBoardOptions): GroupCardData[] {
  const normalizedSearch = search?.trim().toLowerCase();
  const hasSearch = Boolean(normalizedSearch);
  const statusFilter = status && status !== "all" ? status : null;

  return state.order
    .map((id) => state.items.get(id))
    .filter((item): item is GroupCardData => Boolean(item))
    .filter((item) => {
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesSearch = hasSearch ? item.subject.toLowerCase().includes(normalizedSearch!) : true;
      return matchesStatus && matchesSearch;
    });
}

function sortState(state: NormalizedGroups): NormalizedGroups {
  const items = new Map(state.items);
  const order = Array.from(items.values())
    .sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    })
    .map((item) => item.id);

  return { items, order };
}

export function useGroupsBoard(options: UseGroupsBoardOptions = {}): UseGroupsBoardResult {
  const [state, setState] = useState<NormalizedGroups>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queueRef = useRef<GroupsBoardRow[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      return;
    }

    setState((current) => {
      let next = current;
      queueRef.current.forEach((row) => {
        next = mergeGroup(next, row);
      });
      return next;
    });
    queueRef.current = [];
  }, []);

  const scheduleFlush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      flushQueue();
      timeoutRef.current = null;
    }, 200);
  }, [flushQueue]);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from("groups_board_v1")
        .select("*")
        .order("last_message_at", { ascending: false })
        .limit(50);

      if (fetchError) {
        throw fetchError;
      }

      setState(normalizeGroups(data ?? ([] as GroupsBoardRow[])));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load groups.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const channel = subscribeToGroups((payload) => {
      queueRef.current.push(payload.new);
      scheduleFlush();
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      flushQueue();
      unsubscribeFromGroups(channel);
    };
  }, [flushQueue, scheduleFlush]);

  const markComplete = useCallback(
    async (id: string) => {
      const supabase = getSupabaseClient();
      let previous: GroupCardData | undefined;

      setState((current) => {
        const next = sortState(current);
        const existing = next.items.get(id);
        if (!existing) {
          return current;
        }

        previous = { ...existing };
        const updated: GroupCardData = { ...existing, status: "green" };
        next.items.set(id, updated);
        return sortState(next);
      });

      try {
        const updatePayload: Database["public"]["Tables"]["groups"]["Update"] = { status: "green" };

        const { error: updateError } = await supabase.from("groups").update(updatePayload).eq("id", id);

        if (updateError) {
          throw updateError;
        }
      } catch (err) {
        if (previous) {
          setState((current) => {
            const next = sortState(current);
            next.items.set(id, previous!);
            return sortState(next);
          });
        }
        const message = err instanceof Error ? err.message : "Unable to update group.";
        setError(message);
        if (typeof window !== "undefined") {
          window.alert(message);
        }
        throw err;
      }
    },
    []
  );

  const groups = useMemo(() => applyFilters(state, options), [state, options]);

  return {
    groups,
    loading,
    error,
    refetch: fetchGroups,
    markComplete
  };
}
