import { Check, ExternalLink, Mail } from "lucide-react";

import { AvatarStack } from "@/components/avatar-stack";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format";
import type { GroupCardData } from "@/types/groups";

interface GroupCardProps {
  group: GroupCardData;
  onMarkComplete: (id: string) => Promise<void>;
}

export function GroupCard({ group, onMarkComplete }: GroupCardProps) {
  const requesterName = group.requester?.name ?? "Unknown requester";
  const threadUrl = group.threadUrl ?? undefined;

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={group.status} />
          <span className="text-xs text-slate-500" title={formatRelativeTime(group.lastMessageAt)}>
            {formatRelativeTime(group.lastMessageAt)}
          </span>
        </div>
        <CardTitle className="line-clamp-1" title={group.subject}>
          {group.subject}
        </CardTitle>
        <p className="line-clamp-2 text-sm text-slate-600" title={group.summary ?? undefined}>
          {group.summary ?? "No summary available."}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Requester</p>
          <p className="text-sm font-medium text-slate-700" title={requesterName}>
            {requesterName}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Assignees</p>
          <AvatarStack members={group.assignees} ariaLabel={`Assignees for ${group.subject}`} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => {
            if (threadUrl) {
              window.open(threadUrl, "_blank", "noopener,noreferrer");
            }
          }}
          disabled={!threadUrl}
          aria-label="Open thread in Gmail"
        >
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Open in Gmail
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </span>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => onMarkComplete(group.id)}
          aria-label="Mark conversation as complete"
        >
          <Check className="mr-2 h-4 w-4" aria-hidden="true" />
          Mark complete
        </Button>
      </CardFooter>
    </Card>
  );
}
