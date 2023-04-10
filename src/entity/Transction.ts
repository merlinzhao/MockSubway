import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm"

@Entity({ name: 'transactions' })
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    uuid: string

    @Column()
    station: string

    @Column()
    fare: number

    @Column()
    remainingbalance: number
}
