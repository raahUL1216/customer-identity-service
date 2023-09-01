import "reflect-metadata";
import { DataSource } from "typeorm";

import { Contact } from "../entity/contact";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB_NAME,
    ssl: true,
    synchronize: false,
    logging: false,
    entities: [Contact],
    migrations: [],
    subscribers: [],
});