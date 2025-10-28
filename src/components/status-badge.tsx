import { Badge } from "@/components/ui/badge";
import type { GroupStatus } from "@/types/groups";

const STATUS_STYLES: Record<GroupStatus, string> = {
  orange: "bg-orange-100 text-orange-700",
  green: "bg-emerald-100 text-emerald-700",
  grey: "bg-slate-200 text-slate-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700"
};

const STATUS_LABELS: Record<GroupStatus, string> = {
  orange: "Awaiting reply",
  green: "Completed",
  grey: "No status",
  yellow: "Pending",
  red: "Escalated"
};

interface StatusBadgeProps {
  status: GroupStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={STATUS_STYLES[status] ?? STATUS_STYLES.grey} aria-label={`Status: ${STATUS_LABELS[status]}`}>
      {STATUS_LABELS[status] ?? "Unknown"}
    </Badge>
  );
}
