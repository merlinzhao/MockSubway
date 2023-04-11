import "reflect-metadata"
import { DataSource } from "typeorm"
import { Trainline } from "./entity/Trainline"
import { Station } from "./entity/Station"
import { Card } from "./entity/Card"
import { Transaction } from "./entity/Transction"

// pg_ctl -D /usr/local/var/postgres -l logfile start
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "mock-subway-instance.cvl5bfciu1ri.us-east-1.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "mock_subway",
    synchronize: true,
    logging: false,
    entities: [Trainline, Station, Card, Transaction],
    migrations: [],
    subscribers: [],
})
