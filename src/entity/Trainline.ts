import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'train_lines' })
export class Trainline {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string
}
