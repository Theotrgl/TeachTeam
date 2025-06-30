import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class TutorOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column("simple-array")
  tutorIds!: number[];
}
