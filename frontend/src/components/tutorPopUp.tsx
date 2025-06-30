import React from "react";
import { useTutor } from "@/context/tutorContext";
import { Profile, User } from "@/services/api";

interface TutorPopUpProps {
  tutor: User;
  profile: Profile | null;
  onClose: () => void;
}

const TutorPopUp: React.FC<TutorPopUpProps> = ({ tutor, profile, onClose }) => {
  const { addTutor, isSelected } = useTutor();
  const selected = isSelected(tutor);

  const handleClick = () => {
    addTutor(tutor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg sm:max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
          aria-label="Close"
        >
          <span className="material-icons text-xl sm:text-2xl">close</span>
        </button>

        <div className="flex flex-col">
          <div className="flex flex-col items-center mb-4">
            <img
              src={profile?.pictureURI || "/default-avatar.png"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 object-cover"
              alt={tutor.firstName}
            />
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">
              {tutor.firstName}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">{tutor.role}</p>
          </div>

          {profile?.about && (
            <div className="mb-4 text-left">
              <h3 className="text-base sm:text-lg font-semibold text-black">About</h3>
              <p className="text-sm sm:text-base text-gray-700">{profile.about}</p>
            </div>
          )}

          {(profile?.skills?.length ?? 0) > 0 && (
            <div className="mb-4 text-left">
              <h3 className="text-base sm:text-lg font-semibold text-black">Skills</h3>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-700">
                {profile?.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {(profile?.prevRoles?.length ?? 0) > 0 && (
            <div className="mb-4 text-left">
              <h3 className="text-base sm:text-lg font-semibold text-black">
                Previous Experience
              </h3>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-700">
                {profile?.prevRoles.map((role, i) => (
                  <li key={i}>
                    <strong>{role.title}</strong>: {role.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile?.availability && (
            <div className="text-sm sm:text-base text-gray-700 mb-4">
              <strong>Availability:</strong> {profile.availability}
            </div>
          )}

          {/* Select Button */}
          <button
            onClick={handleClick}
            disabled={selected}
            className={`w-full py-2 px-4 rounded-lg transition font-semibold text-sm sm:text-base ${
              selected
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-primary text-white hover:bg-prime cursor-pointer"
            }`}
          >
            {selected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorPopUp;
