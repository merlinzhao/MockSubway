import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm"
import { Trainline } from "./Trainline"

@Entity({ name: 'train_line_stations' })
export class Station {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    trainlineId: number

    @Column()
    trainlineName: string
}
