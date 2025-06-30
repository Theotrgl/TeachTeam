export type User = {
    id: number;
    position: string;
    email: string;
    username: string;
    password: string;
    role: string;
    profile_id: number;
}

export const DEFAULT_USERS: User[] = [
    { id: 1, position: "Software Engineer",email: "john123@gmail.com",username: "john", password: "Password123!", role: "Tutor", profile_id: 1},
    { id: 2, position: "Course Coordinator", email: "jane123@gmail.com" ,username: "jane", password: "Password456!", role: "Lecturer", profile_id: 2},
    { id: 3, position: "Software Engineer", email: "simon123@gmail.com" ,username: "simon", password: "Password123!", role: "Tutor", profile_id: 3},
    { id: 4, position: "Software Engineer", email: "matt123@gmail.com" ,username: "matt", password: "Password456!", role: "Tutor", profile_id: 4},
    { id: 5, position: "Software Engineer", email: "jessica123@gmail.com" ,username: "jessica", password: "Password123!", role: "Tutor", profile_id: 5},
    { id: 6, position: "Software Engineer", email: "chris123@gmail.com" ,username: "chris", password: "Password456!", role: "Lecturer", profile_id: 6},
  ];