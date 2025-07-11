import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const GET_COURSES_AND_USERS = gql`
  query {
    courses {
      id
      title
    }
    users {
      id
      firstName
      lastName
      role
    }
  }
`;

const ASSIGN_LECTURER = gql`
  mutation AssignLecturer($courseId: ID!, $lecturerId: ID!) {
    assignLecturerToCourse(courseId: $courseId, lecturerId: $lecturerId) {
      id
      title
      lecturer {
        firstName
      }
    }
  }
`;

export function AssignLecturerSection() {
  const { data, loading } = useQuery(GET_COURSES_AND_USERS);
  const [assignLecturer] = useMutation(ASSIGN_LECTURER, {
    refetchQueries: [{ query: GET_COURSES_AND_USERS }],
  });
  const [courseId, setCourseId] = useState("");
  const [lecturerId, setLecturerId] = useState("");

  if (loading) return <p>Loading assign lecturer section...</p>;

  const handleAssign = async () => {
    if (!courseId || !lecturerId) {
      alert("Please select both course and lecturer");
      return;
    }
    await assignLecturer({ variables: { courseId, lecturerId } });
    alert("Lecturer assigned!");
    setCourseId("");
    setLecturerId("");
  };

  const lecturers = data.users.filter((u: any) => u.role === "Lecturer");

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Assign Lecturer to Course
      </h1>
      <div className="border border-gray-300 rounded-md p-6 mb-10 shadow-sm">
        <div className="mb-4">
          <label
            htmlFor="course"
            className="block mb-1 font-medium text-gray-700"
          >
            Select Course
          </label>
          <select
            id="course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Course</option>
            {data.courses.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="lecturer"
            className="block mb-1 font-medium text-gray-700"
          >
            Select Lecturer
          </label>
          <select
            id="lecturer"
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Lecturer</option>
            {lecturers.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className=" mt-6 bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors duration-200"
        >
          Assign Lecturer
        </button>
      </div>
    </>
  );
}
