import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";
// id: number;
// tutors: Array<User>;
// lecturer_id: number;
@Entity()
export class SelectedTutors {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(() => User)
  @JoinTable() 
  tutors!: User[];

  @Column()
  lecturerId!: number;
}
