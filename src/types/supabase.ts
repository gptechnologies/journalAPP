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
        };
        Insert: {
          id?: string;
          status?: GroupStatus | null;
        };
        Update: {
          status?: GroupStatus | null;
        };
        Relationships: [];
      };
      groups_board_v1: {
        Row: GroupsBoardRow;
        Insert: PartialRow<Mutable<GroupsBoardRow>>;
        Update: PartialRow<Mutable<GroupsBoardRow>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
