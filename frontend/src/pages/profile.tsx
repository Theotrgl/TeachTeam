import Layout from "@/components/layout";
import { useAuth } from "@/context/authContext";
import { useCourse } from "@/context/courseContext";
import { useEffect, useState } from "react";
import ProfilePopUp from "@/components/editProfilePopUp,";
import { selectedCoursesApi, Course } from "@/services/api";

export default function ProfilePage() {
  const [isLoadingTutors, setIsLoadingTutors] = useState(true);
  const { user, profile, updateProfile } = useAuth();
  const {
    courses,
    selectedCourses,
    setSelectedCourses,
    droppedCourses,
    setDroppedCourses,
  } = useCourse();
  const [showModal, setShowModal] = useState(false);
  const toggleDropCourse = (course: Course) => {
    const isAlreadyDropped = droppedCourses.some((c) => c.id === course.id);
    const updatedDroppedCourses = isAlreadyDropped
      ? droppedCourses.filter((c) => c.id !== course.id)
      : [...droppedCourses, course];

    console.log(updatedDroppedCourses);
    setDroppedCourses(updatedDroppedCourses);
  };
  useEffect(() => {
    if (user) {
      setIsLoadingTutors(true);
    }
  }, [user]);

  const handleDrop = async () => {
    if (!user) return;

    const updatedSelectedCourses = selectedCourses.filter(
      (course) => !droppedCourses.some((d) => d.id === course.id)
    );

    try {
      await selectedCoursesApi.updateUserSelectedCourses(
        user.id,
        updatedSelectedCourses
      );

      console.log(
        "🟡 Updated selected courses (to keep):",
        updatedSelectedCourses
      );
      console.log("🟡 Dropped courses (to remove):", droppedCourses);
      setSelectedCourses(updatedSelectedCourses);
      setDroppedCourses([]);

      localStorage.setItem(
        "selectedCourses",
        JSON.stringify(updatedSelectedCourses)
      );
    } catch (err) {
      console.error("Failed to drop courses:", err);
    }
  };

  const isDropped = (code: string) =>
    droppedCourses.find((c) => c.code === code);

  return (
    <Layout>
      <div className="profile bg-background min-h-screen flex no-scrollbar">
        <div className="container mx-auto py-12 flex flex-col flex-grow">
          {/* Main Flex Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 flex-grow items-start">
            {/* Profile Card */}
            <div className="lg:col-span-4 flex flex-col flex-grow h-full">
              <div className="bg-white shadow-lg rounded-2xl p-6 text-center flex flex-col flex-grow">
                <div className="flex flex-col items-center my-3">
                  <img
                    src={profile?.pictureURI}
                    className="w-42 h-42 bg-gray-300 rounded-full mb-4 mx-auto"
                  />
                  <h1 className="text-4xl font-bold text-black">
                    {user ? `${user.firstName} ${user.lastName}` : ""}
                  </h1>
                  {/* <p className="text-gray-600 text-2xl">{user?.position}</p> */}
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <button className="bg-primary hover:bg-prime text-white py-2 px-4 rounded-lg transition">
                      Contact
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg transition">
                      Resume
                    </button>
                  </div>
                </div>
                <hr className="my-6 border-t border-border" />
                <div className="text-left">
                  <span className="text-lg text-black uppercase font-semibold mb-2">
                    Skills
                  </span>
                  {profile?.skills.length === 0 ? (
                    <p className="text-gray-400 mt-2 mb-4">N/A</p>
                  ) : (
                    <ul className="text-gray-700 mb-5">
                      {profile?.skills.map((skill, index) => (
                        <li key={index} className="py-1">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="text-lg text-black uppercase font-semibold mb-2">
                    Credentials
                  </span>
                  {profile?.credentials.length === 0 ? (
                    <p className="text-gray-400 mt-2 mb-4">N/A</p>
                  ) : (
                    <ul className="text-gray-700 mb-5">
                      {profile?.credentials.map((credential, index) => (
                        <li key={index} className="py-1">
                          {credential}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* About Me Card */}
            <div className="lg:col-span-8 flex flex-col flex-grow h-full">
              <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col flex-grow h-full">
                <h2 className="text-2xl font-bold text-black mb-4">About Me</h2>
                {profile?.about == "" ? (
                  <p className="text-gray-400">N/A</p>
                ) : (
                  <p className="text-gray-700">{profile?.about}</p>
                )}

                <h2 className="text-2xl font-bold text-black mt-6 mb-4">
                  Previous Roles
                </h2>
                {profile?.prevRoles.length === 0 ? (
                  <p className="text-gray-400">N/A</p>
                ) : (
                  <ul className="text-gray-700 space-y-2">
                    {profile?.prevRoles?.map((role, index) => (
                      <li
                        key={index}
                        className="border-l-4 border-secondary pl-3"
                      >
                        <strong>{role.title}</strong>: {role.description}
                      </li>
                    ))}
                  </ul>
                )}

                {user?.role == "candidate" && (
                  <>
                    <h2 className="text-2xl font-bold text-black mt-6 mb-4">
                      Availability
                    </h2>
                    {profile?.availability == "" ? (
                      <p className="text-gray-400">Availability not set</p>
                    ) : (
                      <strong className="text-gray-700">
                        {profile?.availability}
                      </strong>
                    )}
                  </>
                )}

                {/* Spacer to push button to bottom */}
                <div className="flex-grow" />

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Selected Courses / Tutor Ranking Section */}
              {user?.role == "Lecturer" ? (
                <>
                </>
              ) : (
                <div className="bg-white shadow-lg rounded-2xl p-6 mt-8 h-full flex flex-col">
                  <h1 className="text-2xl font-bold text-black mb-4">
                    Selected Courses
                  </h1>
                  {selectedCourses.length === 0 ? (
                    <>
                      <p className="text-gray-400 mb-2">No Courses Selected</p>
                      <a
                        className="text-blue-600 hover:underline"
                        href="/course-select"
                      >
                        → Select Courses
                      </a>
                    </>
                  ) : (
                    <ul className="space-y-3">
                      {selectedCourses.map((course) => (
                        <li
                          key={course.code}
                          className="flex items-center justify-between p-3 bg-background shadow rounded-lg"
                        >
                          <span className="text-black">
                            {course.title} ({course.code})
                          </span>
                          <button
                            onClick={() => toggleDropCourse(course)}
                            className={`px-3 py-1 rounded-lg transition ${
                              droppedCourses.some((c) => c.code === course.code)
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-gray-400 hover:bg-gray-500 text-white"
                            }`}
                          >
                            {isDropped(course.code) ? "Deselect" : "Select"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedCourses.length > 0 && (
                    <div className="mt-6 text-right">
                      <button
                        onClick={handleDrop}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Drop Courses
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && <ProfilePopUp setShowModal={setShowModal} />}
    </Layout>
  );
}
