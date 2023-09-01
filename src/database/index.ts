import { PoolClient } from "pg";

interface IDatabase {
  connect(): void;
  getClient(): PoolClient | null;
}

export { IDatabase };