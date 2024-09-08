import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface ClientsTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface RecordStoreTable {
  id: Generated<number>;
  person_id: number;
  s3_url: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface ClientSummaryPersistedStore {
  id: Generated<number>;
  patient_id: number;
  hash: string;
  summary: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

// The overall database interface that includes all the tables
export interface Database {
  clients: ClientsTable;
  record_store: RecordStoreTable;
  clientpersistense: ClientSummaryPersistedStore;
}

// Export different types to isolate functionality
export type Client = Selectable<ClientsTable>;
export type NewClient = Insertable<ClientsTable>;
export type ClientUpdate = Updateable<ClientsTable>;

export type Record = Selectable<RecordStoreTable>;
export type NewRecord = Insertable<RecordStoreTable>;
export type RecordUpdate = Updateable<RecordStoreTable>;

export type ClientStore = Selectable<ClientSummaryPersistedStore>;
export type NewClientStore = Insertable<ClientSummaryPersistedStore>;
export type ClientStoreUpdate = Updateable<ClientSummaryPersistedStore>;
