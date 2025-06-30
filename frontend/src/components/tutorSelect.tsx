import TutorPopUp from "@/components/tutorPopUp";
import { useAuth } from "@/context/authContext";
import { useTutor } from "@/context/tutorContext";
import { useCourse } from "@/context/courseContext";
import { useState } from "react";
import { Profile, User, SelectedCourse } from "@/services/api";

const TutorSelect = () => {
  const { tutors, selectedCourse } = useTutor();
  const { profiles } = useAuth();
  const { courses, lecturerCourse } = useCourse();

  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [searchTutorName, setSearchTutorName] = useState("");
  const [searchCourseName, setSearchCourseName] = useState("");
  const [searchSkillSet, setSearchSkillSet] = useState("");
  const [searchAvailability, setSearchAvailability] = useState("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"course" | "availability">("course");

  const handleTutorClick = (tutor: User) => {
    const profile = tutor.profile;
    setSelectedTutor(tutor);
    setSelectedProfile(profile || null);
  };

  const closePopUp = () => {
    setSelectedTutor(null);
    setSelectedProfile(null);
  };

  const filteredTutors = tutors.filter((tutor) => {
    const profile = tutor.profile;
    const tutorNameMatch = `${tutor.firstName} ${tutor.lastName}`
      .toLowerCase()
      .includes(searchTutorName.toLowerCase());

    const tutorCourses = selectedCourse.find((sc) => sc?.id === tutor.id);
    const courseNameMatch = searchCourseName
      ? tutorCourses?.courses.some((course) =>
          course.title.toLowerCase().includes(searchCourseName.toLowerCase())
        )
      : true;

    const skillSetMatch = searchSkillSet
      ? profile?.skills.some((skill) =>
          skill.toLowerCase().includes(searchSkillSet.toLowerCase())
        )
      : true;

    const availabilityMatch = searchAvailability
      ? profile?.availability
          .toLowerCase()
          .includes(searchAvailability.toLowerCase())
      : true;

    return (
      tutorNameMatch && courseNameMatch && skillSetMatch && availabilityMatch
    );
  });

  const sortedTutors = filteredTutors.sort((a, b) => {
    if (sortBy === "course") {
      const aCourses =
        selectedCourse.find((sc) => sc?.id === a.id)?.courses || [];
      const bCourses =
        selectedCourse.find((sc) => sc?.id === b.id)?.courses || [];

      const aCourseTitle = aCourses[0]?.title || "";
      const bCourseTitle = bCourses[0]?.title || "";

      return sortOrder === "asc"
        ? aCourseTitle.localeCompare(bCourseTitle)
        : bCourseTitle.localeCompare(aCourseTitle);
    } else if (sortBy === "availability") {
      const aAvailability = a.profile?.availability || "";
      const bAvailability = b.profile?.availability || "";

      return sortOrder === "asc"
        ? aAvailability.localeCompare(bAvailability)
        : bAvailability.localeCompare(aAvailability);
    }

    return 0; // Fallback
  });

  return (
    <>
      <div className="mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">Select Candidates</h1>

        <div className="mb-6 flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search by Tutor Name */}
          <input
            type="text"
            placeholder="Search by Tutor Name"
            className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-black w-full sm:w-1/3"
            value={searchTutorName}
            onChange={(e) => setSearchTutorName(e.target.value)}
          />

          {/* Select Course */}
          <select
            className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-black w-full sm:w-1/3"
            value={searchCourseName}
            onChange={(e) => setSearchCourseName(e.target.value)}
          >
            <option value="">Select Course</option>
            {lecturerCourse.map((course) => (
              <option key={course.code} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>

          {/* Search by Skill Set */}
          <input
            type="text"
            placeholder="Search by Skill Set"
            className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-black w-full sm:w-1/3"
            value={searchSkillSet}
            onChange={(e) => setSearchSkillSet(e.target.value)}
          />

          {/* Select Availability */}
          <select
            className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-black w-full sm:w-1/3"
            value={searchAvailability}
            onChange={(e) => setSearchAvailability(e.target.value)}
          >
            <option value="">Select Availability</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>

          {/* Sort by Course / Availability Button */}
          <button
            onClick={() =>
              setSortBy(sortBy === "course" ? "availability" : "course")
            }
            className="px-6 py-2 border border-gray-300 rounded-lg bg-primary text-sm text-white transition-colors duration-200 hover:bg-prime w-full sm:w-auto"
          >
            Sort by {sortBy === "course" ? "Availability" : "Course"} (
            {sortOrder === "asc" ? "A-Z" : "Z-A"})
          </button>

          {/* Toggle Sort Order Button */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-6 py-2 border rounded-lg bg-primary text-white hover:bg-prime sm:w-auto"
          >
            <span className="material-icons text-lg pt-2">swap_vert</span>
          </button>
        </div>

        {sortedTutors.length === 0 ? (
          <p className="text-gray-600">No tutors found.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTutors.map((tutor) => {
              const profile = tutor.profile;

              return (
                <li
                  key={tutor.id}
                  onClick={() => handleTutorClick(tutor)}
                  className="cursor-pointer bg-white rounded-2xl shadow p-6 flex flex-col items-center hover:scale-105 transform transition-all"
                >
                  <img
                    src={profile?.pictureURI}
                    alt={tutor.firstName}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h2 className="text-xl font-semibold text-black">
                    {tutor.firstName} {tutor.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{tutor.role}</p>
                  <p className="text-sm text-gray-500">
                    {profile?.availability}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedTutor && (
        <TutorPopUp
          tutor={selectedTutor}
          profile={selectedProfile}
          onClose={closePopUp}
        />
      )}
    </>
  );
};

export default TutorSelect;
