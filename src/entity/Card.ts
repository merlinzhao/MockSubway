import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm"

@Entity({ name: 'cards' })
export class Card {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    balance: number
}
