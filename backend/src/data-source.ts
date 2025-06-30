import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Profile } from "./entity/Profile";
import { Courses } from "./entity/Courses";
import { SelectedCourses } from "./entity/selectedCourses";
import { SelectedTutors } from "./entity/selectedTutors";
import { Comments } from "./entity/Comments";
import { PrevRoles } from "./entity/prevRoles";
import { TutorOrder } from "./entity/tutorOrder";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4115477",
  password: "Shibe534!",
  database: "S4115477",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [User, Profile, Comments, Courses, SelectedCourses, SelectedTutors, PrevRoles, TutorOrder],
  migrations: [],
  subscribers: [],
});
