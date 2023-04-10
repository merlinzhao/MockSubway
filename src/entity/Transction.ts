import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({ name: 'transactions' })
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    uuid: string

    @Column()
    station: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    fare: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    remainingbalance: number

    @CreateDateColumn()
    createdAt: Date
}
