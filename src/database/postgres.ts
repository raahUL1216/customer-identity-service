import { Pool, PoolClient } from 'pg';
import { IDatabase } from './index'

class PostgreSQLDatabase implements IDatabase {
    private static instance: PostgreSQLDatabase;
    private pool: Pool;
    private client: PoolClient | null;

    private constructor() {
        this.pool = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DB_NAME,
            password: process.env.PG_PASS,
            port: parseInt(process.env.PG_PORT || '5432'),
            ssl: true
        });
        this.client = null;
    }

    public static getInstance(): PostgreSQLDatabase {
        if (!this.instance) {
            this.instance = new PostgreSQLDatabase();
        }
        return this.instance;
    }

    async connect(): Promise<void> {
        this.client = await this.pool.connect();
    }

    public getClient(): PoolClient | null {
        return this.client;
    }
}

export { PostgreSQLDatabase };