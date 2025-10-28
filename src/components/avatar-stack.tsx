import { Fragment } from "react";

import type { GroupMember } from "@/types/groups";

interface AvatarStackProps {
  members: GroupMember[];
  ariaLabel?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AvatarStack({ members, ariaLabel }: AvatarStackProps) {
  if (!members || members.length === 0) {
    return <span className="text-xs text-slate-500">No assignees</span>;
  }

  return (
    <div className="flex -space-x-2" aria-label={ariaLabel} role="list">
      {members.slice(0, 3).map((member) => (
        <Fragment key={member.id}>
          <span
            role="listitem"
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
            title={member.name}
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="h-full w-full rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              getInitials(member.name)
            )}
          </span>
        </Fragment>
      ))}
      {members.length > 3 ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600 shadow-sm">
          +{members.length - 3}
        </span>
      ) : null}
    </div>
  );
}
