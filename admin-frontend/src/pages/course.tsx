import { AssignLecturerSection } from "@/components/assignLecturer";
import withAuth from "@/lib/withAuth";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      code
      title
      desc
      role
      lecturer {
        id
        firstName
        lastName
      }
    }
  }
`;

const CREATE_COURSE = gql`
  mutation CreateCourse(
    $code: String!
    $title: String!
    $desc: String!
    $role: String!
  ) {
    createCourse(code: $code, title: $title, desc: $desc, role: $role) {
      id
      code
      title
      desc
      role
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse(
    $id: ID!
    $code: String
    $title: String
    $desc: String
    $role: String
  ) {
    updateCourse(
      id: $id
      code: $code
      title: $title
      desc: $desc
      role: $role
    ) {
      id
      code
      title
      desc
      role
    }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

function CoursesAdminPage() {
  const { data, loading, error, refetch } = useQuery(GET_COURSES);

  // Form states for adding a new course
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRole, setNewRole] = useState("");

  // For editing
  const [editId, setEditId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editRole, setEditRole] = useState("");

  const [createCourse] = useMutation(CREATE_COURSE);
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error loading courses: {error.message}</p>;

  const startEdit = (course: any) => {
    setEditId(course.id);
    setEditCode(course.code);
    setEditTitle(course.title);
    setEditDesc(course.desc);
    setEditRole(course.role);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditCode("");
    setEditTitle("");
    setEditDesc("");
    setEditRole("");
  };

  const submitEdit = async () => {
    if (!editId) return;
    try {
      await updateCourse({
        variables: {
          id: editId,
          code: editCode,
          title: editTitle,
          desc: editDesc,
          role: editRole,
        },
      });
      cancelEdit();
      refetch();
    } catch (err: any) {
      alert("Error updating course: " + err.message);
    }
  };

  const submitNew = async () => {
    if (!newCode || !newTitle || !newDesc || !newRole) {
      alert("Please fill all fields");
      return;
    }
    try {
      await createCourse({
        variables: {
          code: newCode,
          title: newTitle,
          desc: newDesc,
          role: newRole,
        },
      });
      setNewCode("");
      setNewTitle("");
      setNewDesc("");
      setNewRole("");
      refetch();
    } catch (err: any) {
      alert("Error creating course: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse({ variables: { id } });
      if (editId === id) cancelEdit();
      refetch();
    } catch (err: any) {
      alert("Error deleting course: " + err.message);
    }
  };

  return (
    <div className="p-8 min-h-screen space-y-10 text-[var(--black)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Courses</h1>

      {/* Add New Course */}
      <section className="border border-gray-300 rounded-md p-6 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          Add New Course
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <input
            type="text"
            placeholder="Course Code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={submitNew}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors duration-200"
        >
          Add Course
        </button>
      </section>

      {/* Courses Table */}
      <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left text-gray-700">
                Code
              </th>
              <th className="border border-gray-300 p-3 text-left text-gray-700">
                Title
              </th>
              <th className="border border-gray-300 p-3 text-left text-gray-700">
                Description
              </th>
              <th className="border border-gray-300 p-3 text-left text-gray-700">
                Role
              </th>
              <th className="border border-gray-300 p-3 text-left text-gray-700">
                Lecturer
              </th>
              <th className="border border-gray-300 p-3 text-center text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.courses.map((course: any) =>
              editId === course.id ? (
                <tr key={course.id} className="bg-white">
                  <td className="border border-gray-300 p-2">
                    <input
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {course.lecturer ? (
                      <span className="text-gray-800">
                        {course.lecturer.firstName} {course.lecturer.lastName}
                      </span>
                    ) : (
                      <span className="italic text-gray-500">None</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center space-x-3">
                    <button
                      onClick={submitEdit}
                      className="bg-green-600 text-white px-4 py-1 rounded-md font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-4 py-1 rounded-md font-medium hover:bg-gray-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{course.code}</td>
                  <td className="border border-gray-300 p-3">{course.title}</td>
                  <td className="border border-gray-300 p-3">{course.desc}</td>
                  <td className="border border-gray-300 p-3">{course.role}</td>
                  <td className="border border-gray-300 p-3">
                    {course.lecturer ? (
                      <span className="text-gray-800">
                        {course.lecturer.firstName} {course.lecturer.lastName}
                      </span>
                    ) : (
                      <span className="italic text-gray-500">None</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-3 text-center space-x-3">
                    <button
                      onClick={() => startEdit(course)}
                      className="bg-yellow-400 text-black px-4 py-1 rounded-md font-medium hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-md font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <AssignLecturerSection />
    </div>
  );
}

export default withAuth(CoursesAdminPage);
