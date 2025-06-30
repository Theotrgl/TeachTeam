import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

    // lecturer_id: number;
    // tutor_id: number;
    // comment: string;
@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  lecturer_id!: number;

  @Column()
  tutor_id!: number;

  @Column()
  comment!: string;
}
