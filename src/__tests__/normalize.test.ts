import { describe, expect, it } from "vitest";

import { mergeGroup, normalizeGroups } from "@/lib/normalize";
import type { GroupsBoardRow } from "@/types/groups";

const baseRow: GroupsBoardRow = {
  id: "1",
  subject: "Welcome",
  summary: "First message",
  status: "orange",
  last_message_at: "2024-04-01T12:00:00.000Z",
  created_at: "2024-04-01T11:00:00.000Z",
  requester: {
    id: "requester-1",
    name: "Sam",
    role: "requester",
    email: "sam@example.com",
    avatar_url: null
  },
  assignees: [],
  participants: [],
  messages_count: 1,
  thread_url: null,
  updated_at: "2024-04-01T12:00:00.000Z"
};

describe("normalizeGroups", () => {
  it("returns a map keyed by id with descending order", () => {
    const newerRow: GroupsBoardRow = { ...baseRow, id: "2", last_message_at: "2024-04-02T12:00:00.000Z" };

    const result = normalizeGroups([baseRow, newerRow]);

    expect(result.order).toEqual(["2", "1"]);
    expect(result.items.get("1")?.subject).toBe("Welcome");
  });
});

describe("mergeGroup", () => {
  it("adds new rows and resorts the order", () => {
    const state = normalizeGroups([baseRow]);
    const newerRow: GroupsBoardRow = { ...baseRow, id: "2", last_message_at: "2024-04-03T12:00:00.000Z" };

    const result = mergeGroup(state, newerRow);

    expect(result.order[0]).toBe("2");
    expect(result.items.get("2")?.lastMessageAt).toBe("2024-04-03T12:00:00.000Z");
  });

  it("updates existing rows", () => {
    const state = normalizeGroups([baseRow]);
    const updatedRow: GroupsBoardRow = { ...baseRow, summary: "Updated", status: "green" };

    const result = mergeGroup(state, updatedRow);

    expect(result.items.get("1")?.summary).toBe("Updated");
    expect(result.items.get("1")?.status).toBe("green");
  });
});
