import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface BoardGridProps extends PropsWithChildren {
  className?: string;
}

export function BoardGrid({ children, className }: BoardGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}
