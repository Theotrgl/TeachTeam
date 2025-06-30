import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { PrevRoles } from "./prevRoles";

// id: number;
// about: string;
// picture: string;
// prevRoles: Array<{ title: string; description: string }>;
// availability: string;
// skills: Array<string>;
// credentials: Array<string>;
// aggSelected: number;
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  about!: string;

  @Column()
  pictureURI!: string;

  @Column("simple-json") // Store as a JSON array in a single column
  prevRoles!: { title: string; description: string }[];

  @Column()
  availability!: string;

  @Column("simple-json")
  skills!: string[];

  @Column("simple-json")
  credentials!: string[];

  @Column()
  agg_selected!: number;
}
