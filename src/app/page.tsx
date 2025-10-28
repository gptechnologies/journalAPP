"use client";

import { useMemo, useState } from "react";

import { BoardGrid } from "@/components/board-grid";
import { BoardHeader } from "@/components/board-header";
import { GroupCard } from "@/components/group-card";
import { GroupDrawer } from "@/components/group-drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupsBoard } from "@/hooks/use-groups-board";
import type { GroupStatus } from "@/types/groups";

export default function Page() {
  const [status, setStatus] = useState<GroupStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { groups, loading, error, refetch, markComplete } = useGroupsBoard({ status, search });

  const hasActiveFilters = useMemo(() => status !== "all" || search.trim().length > 0, [status, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      <BoardHeader
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
        onReset={() => {
          setStatus("all");
          setSearch("");
        }}
      />

      {error ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="text-base font-medium text-red-600">{error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      ) : null}

      {loading ? (
        <BoardGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="flex h-full flex-col gap-4 p-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </BoardGrid>
      ) : null}

      {!loading && groups.length > 0 ? (
        <BoardGrid>
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col">
              <GroupCard group={group} onMarkComplete={markComplete} />
              <GroupDrawer group={group} />
            </div>
          ))}
        </BoardGrid>
      ) : null}

      {!loading && groups.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <h2 className="text-lg font-semibold text-slate-800">No conversations found</h2>
          <p className="max-w-md text-sm text-slate-500">
            {hasActiveFilters
              ? "Try clearing your filters or adjusting the search terms to find more conversations."
              : "When new conversations arrive in the shared inbox they will appear here instantly."}
          </p>
          {hasActiveFilters ? (
            <Button onClick={() => {
              setStatus("all");
              setSearch("");
            }}>
              Reset filters
            </Button>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
