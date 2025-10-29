import type { GroupStatus, GroupsBoardRow } from "./groups";

type Mutable<T> = {
  [K in keyof T]: T[K];
};

type PartialRow<T> = {
  [K in keyof T]?: T[K] | null;
};

export type Database = {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string;
          status: GroupStatus;
        } & Record<string, unknown>;
        Insert: {
          id?: string;
          status?: GroupStatus | null;
        } & Record<string, unknown>;
        Update: {
          status?: GroupStatus | null;
        } & Record<string, unknown>;
        Relationships: [];
      };
      groups_board_v1: {
        Row: GroupsBoardRow & Record<string, unknown>;
        Insert: PartialRow<Mutable<GroupsBoardRow>> & Record<string, unknown>;
        Update: PartialRow<Mutable<GroupsBoardRow>> & Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
