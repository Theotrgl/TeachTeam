import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Profile } from "./Profile";

// id: number;
// about: string;
// picture: string;
// prevRoles: Array<{ title: string; description: string }>;
// availability: string;
// skills: Array<string>;
// credentials: Array<string>;
// aggSelected: number;
@Entity()
export class PrevRoles {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @ManyToOne(() => Profile, (profile) => profile.prevRoles, {
    onDelete: "CASCADE",
  })
  profile!: Profile;
}
