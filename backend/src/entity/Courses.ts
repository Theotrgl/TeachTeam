import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

    // code: string;
    // title: string;

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  desc!: string;

  @Column()
  role!: string;

  @ManyToOne(() => User, { nullable: true }) // nullable true if a course can exist without lecturer
  @JoinColumn({ name: "lecturer_id" })
  lecturer!: User;
}
