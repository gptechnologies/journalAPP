import type {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload
} from "@supabase/supabase-js";

export type GroupStatus = "orange" | "green" | "grey" | "yellow" | "red";

export interface GroupMember {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email?: string | null;
  role: "requester" | "assignee" | "participant";
}

export interface RawGroupMember extends Omit<GroupMember, "avatarUrl"> {
  avatar_url?: string | null;
}

export interface GroupsBoardRow {
  id: string;
  subject: string;
  summary: string | null;
  status: GroupStatus;
  last_message_at: string | null;
  created_at: string | null;
  requester: RawGroupMember | null;
  assignees: RawGroupMember[];
  participants: RawGroupMember[];
  messages_count: number;
  thread_url: string | null;
  updated_at: string | null;
}

export interface GroupCardData {
  id: string;
  subject: string;
  summary: string | null;
  status: GroupStatus;
  lastMessageAt: string | null;
  createdAt: string | null;
  requester: GroupMember | null;
  assignees: GroupMember[];
  participants: GroupMember[];
  messagesCount: number;
  threadUrl: string | null;
  updatedAt: string | null;
}

export interface NormalizedGroups {
  items: Map<string, GroupCardData>;
  order: string[];
}

export type GroupsRealtimePayload =
  | RealtimePostgresInsertPayload<GroupsBoardRow>
  | RealtimePostgresUpdatePayload<GroupsBoardRow>;
