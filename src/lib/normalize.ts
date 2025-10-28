import type { GroupCardData, GroupMember, GroupsBoardRow, NormalizedGroups, RawGroupMember } from "@/types/groups";

function mapMember(member: RawGroupMember | null): GroupMember | null {
  if (!member) {
    return null;
  }

  return {
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email ?? null,
    avatarUrl: (member as RawGroupMember & { avatarUrl?: string | null }).avatarUrl ?? member.avatar_url ?? null
  };
}

function mapMembers(members: RawGroupMember[]): GroupMember[] {
  return (members ?? []).map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email ?? null,
    avatarUrl: (member as RawGroupMember & { avatarUrl?: string | null }).avatarUrl ?? member.avatar_url ?? null
  }));
}

export function mapRowToCard(row: GroupsBoardRow): GroupCardData {
  return {
    id: row.id,
    subject: row.subject ?? "Untitled conversation",
    summary: row.summary,
    status: row.status,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    requester: mapMember(row.requester),
    assignees: mapMembers(row.assignees ?? []),
    participants: mapMembers(row.participants ?? []),
    messagesCount: row.messages_count ?? 0,
    threadUrl: row.thread_url,
    updatedAt: row.updated_at
  };
}

function compareLastMessage(a: GroupCardData, b: GroupCardData) {
  const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
  const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
  return bTime - aTime;
}

export function normalizeGroups(rows: GroupsBoardRow[]): NormalizedGroups {
  const items = new Map<string, GroupCardData>();

  rows.forEach((row) => {
    const card = mapRowToCard(row);
    items.set(card.id, card);
  });

  const order = Array.from(items.values())
    .sort(compareLastMessage)
    .map((card) => card.id);

  return { items, order };
}

export function mergeGroup(normalized: NormalizedGroups, row: GroupsBoardRow): NormalizedGroups {
  const items = new Map(normalized.items);
  const card = mapRowToCard(row);
  items.set(card.id, card);

  const order = Array.from(items.values())
    .sort(compareLastMessage)
    .map((value) => value.id);

  return { items, order };
}

export function cloneNormalizedGroups(source: NormalizedGroups): NormalizedGroups {
  return {
    items: new Map(source.items),
    order: [...source.order]
  };
}
