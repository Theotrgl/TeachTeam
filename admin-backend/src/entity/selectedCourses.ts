import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne
} from "typeorm";
import { Courses } from "./Courses";
import { User } from "./User";

@Entity()
export class SelectedCourses {
  @PrimaryGeneratedColumn()
  id!: number;

  // Many selected course records can have many courses
  @ManyToMany(() => Courses)
  @JoinTable()  // Required for many-to-many relation to define the join table
  courses!: Courses[];

  // Many SelectedCourses entries can belong to one User
  @ManyToOne(() => User, user => user.id)
  user!: User;
}
