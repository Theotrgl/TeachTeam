import { Course } from "./courses";

export type SelectedCourse = {
  id: number;
  course: Array<Course>;
  user_id: number;
};

export const DEFAULT_SELECTED_COURSES: SelectedCourse[] = [
  {
    id: 2,
    course: [
      { code: "COSC2408", title: "Programming Project 1" },
    ],
    user_id: 3, // Simon
  },
  {
    id: 3,
    course: [
      { code: "COSC2758", title: "Full Stack Development" },
    ],
    user_id: 4, // Matt
  },
  {
    id: 4,
    course: [
      { code: "COSC2758", title: "Full Stack Development" },
      { code: "COSC2408", title: "Programming Project 1" },
    ],
    user_id: 5, // Jessica
  },
];
