import React, { createContext, useContext, useEffect, useState } from "react";
import { Course, selectedCoursesApi } from "@/services/api";
import { useAuth } from "./authContext";

interface CourseContextType {
    course: Course | null;
    courses: Course[];
    selectedCourses: Course[];
    setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    alreadySelected: boolean;
    droppedCourses: Course[];
    setDroppedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    addCourse: (course: Course) => void;
    lecturerCourse: Course[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturerCourse, setLecturerCourse] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [droppedCourses, setDroppedCourses] = useState<Course[]>([]);
  const [alreadySelected, setAlreadySelected] = useState<boolean>(false);
  const {user} = useAuth();
  
useEffect(() => {
  async function fetchSelectedCourses() {
    if (user?.id) {
      try {
        const data = await selectedCoursesApi.getSelectedCoursesByUser(user.id);
        setSelectedCourses(data);
      } catch (err) {
        console.error("Failed to fetch selected courses:", err);
      }
    }
  }
  fetchSelectedCourses();
}, [user?.id]);

useEffect(() => {
  async function fetchCourses() {
    try {
      const data = await selectedCoursesApi.getAllCourses();
      // console.log(data)
      setCourses(data);

      if (user?.role === "Lecturer" && user?.id) {
        const lecturerCourse = data.filter((course: Course) => course?.lecturer?.id === user?.id)
        setLecturerCourse(lecturerCourse)
      }

    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  }
  fetchCourses();
}, [user?.id]);


const addCourse = async (course: Course) => {
  const alreadyAdded = selectedCourses.some((c) => c.code === course.code);
  if (alreadyAdded || !user?.id) return;

  const updatedCourses = [...selectedCourses, course];
  setSelectedCourses(updatedCourses);

  try {
    await selectedCoursesApi.saveSelectedCourses(user.id, updatedCourses.map(c => c.id));
  } catch (err) {
    console.error("Failed to save selected courses:", err);
  }
};



  return (
    <CourseContext.Provider
      value={{ course,
        courses,
        selectedCourses,
        setSelectedCourses,
        droppedCourses,
        setDroppedCourses,
        addCourse,
        alreadySelected,
        lecturerCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within an CourseProvider");
  }
  return context;
}
