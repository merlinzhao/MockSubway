import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Trainline } from "./entity/Trainline"
import { Station } from "./entity/Station"
import { Card } from "./entity/Card"
// pg_ctl -D /usr/local/var/postgres -l logfile start
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "mock_subway",
    synchronize: true,
    logging: false,
    entities: [User, Trainline, Station, Card],
    migrations: [],
    subscribers: [],
})
