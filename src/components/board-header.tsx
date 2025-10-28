"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GroupStatus } from "@/types/groups";

interface BoardHeaderProps {
  status: GroupStatus | "all";
  onStatusChange: (status: GroupStatus | "all") => void;
  search: string;
  onSearchChange: (term: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: Array<{ label: string; value: GroupStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Orange", value: "orange" },
  { label: "Green", value: "green" },
  { label: "Grey", value: "grey" }
];

export function BoardHeader({ status, onStatusChange, search, onSearchChange, onReset }: BoardHeaderProps) {
  const hasFilters = useMemo(() => status !== "all" || search.trim().length > 0, [status, search]);

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">Groups board</h1>
        <p className="text-sm text-slate-500">Monitor and triage your shared inbox conversations in realtime.</p>
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
        <div className="flex items-center gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={option.value === status ? "default" : "outline"}
              className="min-w-[72px] capitalize"
              onClick={() => onStatusChange(option.value)}
              aria-pressed={option.value === status}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 lg:w-64">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search subject..."
            aria-label="Search groups"
          />
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={onReset} aria-label="Reset filters">
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
