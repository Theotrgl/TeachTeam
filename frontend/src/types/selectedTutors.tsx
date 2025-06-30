import { User } from "./user";

export type SelectedTutor = {
    id: number;
    tutors: Array<User>;
    lecturer_id: number;
}