import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

export function formatTimestamp(value: string | Date | null | undefined, pattern = "MMM d, yyyy h:mm a") {
  const date = toDate(value);
  if (!date) {
    return "Unknown";
  }

  try {
    return format(date, pattern);
  } catch (error) {
    console.warn("Failed to format timestamp", error);
    return date.toLocaleString();
  }
}

export function formatRelativeTime(value: string | Date | null | undefined) {
  const date = toDate(value);
  if (!date) {
    return "a while ago";
  }

  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.warn("Failed to format relative time", error);
    return "recently";
  }
}
