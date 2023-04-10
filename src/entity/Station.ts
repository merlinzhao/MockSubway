import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

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

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    fare: number

    @CreateDateColumn()
    createdAt: Date
}
