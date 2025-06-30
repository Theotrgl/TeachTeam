import { useCourse } from "@/context/courseContext";
import { Course } from "@/services/api";

interface Props {
  course: Course;
  onClose: () => void;
  onAdd: (course: Course) => void;
}

export default function CoursePopUp({ course, onClose, onAdd }: Props) {
  const { selectedCourses } = useCourse();
  const alreadyAdded = selectedCourses.some((c) => c.code === course.code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4 sm:px-6 overflow-y-hidden">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
          aria-label="Close"
        >
          <span className="material-icons text-xl sm:text-2xl">close</span>
        </button>
        <h2 className="text-2xl font-bold mb-2">{course.code}</h2>
        <p className="text-gray-600 mb-6"><strong>Course Name:</strong>{course.title}</p>
        <p className="text-gray-600 mb-6"><strong>Description:</strong>{course.desc}</p>
        <p className="text-gray-600 mb-6"><strong>Lecturer:</strong>
          {course.lecturer
            ? `${course.lecturer.firstName} ${course.lecturer.lastName}`
            : "Unknown Lecturer"}
        </p>
        <p className="text-gray-600 mb-6"><strong>Role:</strong>{course.role}</p>
        <button
          onClick={() => !alreadyAdded && onAdd(course)}
          disabled={alreadyAdded}
          className={`py-2 px-4 rounded-lg text-white ${
            alreadyAdded
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-prime"
          }`}
        >
          {alreadyAdded ? "Already Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}
