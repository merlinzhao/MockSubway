import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm"

@Entity({ name: 'cards' })
export class Card {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    uuid: string

    @Column()
    balance: number
}
