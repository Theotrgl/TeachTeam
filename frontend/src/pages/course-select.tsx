import Layout from "@/components/layout";
import { useCourse } from "@/context/courseContext";
import { Course } from "@/services/api";
import { useState } from "react";
import CoursePopUp from "@/components/coursePopUp";
import { useAuth } from "@/context/authContext";

export default function CourseSelect() {
  const { course, courses } = useCourse();
  const [clickedCourse, setClickedCourse] = useState<Course | null>(null);
  const { addCourse } = useCourse();
  const { user } = useAuth();

  const handleCourseClick = (course: Course) => {
    setClickedCourse(course);
  };

  const closePopUp = () => {
    setClickedCourse(null);
  };

  const handleAddCourse = (course: Course) => {
    addCourse(course);
    closePopUp();
  };

  return (
    <Layout>
      {user?.role == "candidate" ? (
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-black mb-6">Courses</h1>

          {courses.length === 0 ? (
            <p className="text-gray-600">No Courses found.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <li
                  key={course.code}
                  onClick={() => handleCourseClick(course)}
                  className="cursor-pointer bg-white rounded-2xl shadow p-6 flex flex-col items-center hover:scale-105 transform transition-all"
                >
                  <h2 className="text-xl font-semibold text-black">
                    {course.code}
                  </h2>
                  <p className="text-sm text-gray-500">{course.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-20vh)] flex flex-col items-center justify-center">
          <strong className="font-bold text-3xl">403</strong>
          <strong className="font-bold text-3xl">Access Restricted</strong>
        </div>
      )}

      {clickedCourse && (
        <CoursePopUp
          course={clickedCourse}
          onClose={closePopUp}
          onAdd={handleAddCourse}
        />
      )}
    </Layout>
  );
}
