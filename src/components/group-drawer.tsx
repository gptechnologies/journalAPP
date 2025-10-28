"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { GroupCardData } from "@/types/groups";

interface GroupDrawerProps {
  group: GroupCardData;
}

export function GroupDrawer({ group }: GroupDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 text-xs text-slate-500">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen((value) => !value)}>
        {isOpen ? "Hide details" : "Preview details"}
      </Button>
      {isOpen ? (
        <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-4 text-left">
          <p className="text-sm font-medium text-slate-700">Detailed drawer (coming soon)</p>
          <p className="mt-1 text-xs text-slate-500">
            Future iterations can surface the full thread, message timeline, and assignment controls for
            <span className="font-semibold"> {group.subject}</span>.
          </p>
        </div>
      ) : null}
    </div>
  );
}
