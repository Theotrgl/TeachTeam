import React, { useEffect, useState } from "react";
import { Profile, User } from "@/services/api";
import { useTutor } from "@/context/tutorContext";
import toast from "react-hot-toast";
import { useDragNDrop } from "@/context/dragNDropContext";
import { useComment } from "@/context/commentContext";
import { useAuth } from "@/context/authContext";

interface CommentPopUpProps {
  tutor: User;
  profile: Profile | null;
  onClose: () => void;
}

const CommentPopUp: React.FC<CommentPopUpProps> = ({
  tutor,
  profile,
  onClose,
}) => {
  const { removeTutor, isSelected } = useTutor();
  const selected = isSelected(tutor);
  const [comment, setComment] = useState("");
  const { dragTutors, reorderTutors } = useDragNDrop();
  const { user } = useAuth();
  const { addComment, getCommentForTutor } = useComment();
  const [error, setError] = useState("");

  const handleSelect = () => {
    removeTutor(tutor);
    toast.success("Remove Successfull!");
    onClose();

    const updatedTutors = dragTutors.filter((t) => t.id !== tutor.id);
    reorderTutors(updatedTutors); // Ensure the list is updated in DragNDrop context
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in as a lecturer to comment.");
      return;
    }

    let isValid = true;

    if (comment.length <= 0) {
      setError("Comment field cannot be empty!");
      isValid = false;
    }

    if (!isValid) return;

    const success = addComment(comment, user, tutor);
    if (success) {
      toast.success("Comment successfully submitted!");
    } else {
      setError("Invalid input");
    }

    if (comment.length <= 0) {
    }
    addComment(comment, user, tutor);
    setComment("");
    onClose();
  };

  useEffect(() => {
    if (!user || !tutor) return;
    const currentComment = getCommentForTutor(user, tutor);
    setComment(currentComment ?? "");
  }, [user, tutor, getCommentForTutor]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-3xl relative shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
          aria-label="Close"
        >
          <span className="material-icons text-xl sm:text-2xl">close</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* LEFT: Tutor Details */}
          <div className="sm:w-1/2">
            <div className="flex flex-col items-center text-center sm:text-left mb-4">
              <img
                src={profile?.pictureURI || "/default-avatar.png"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 object-cover"
                alt={tutor.firstName}
              />
              <h2 className="text-2xl font-bold text-black mb-1">
                {tutor.firstName} {tutor.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{tutor.role}</p>
            </div>

            {profile?.about && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-black">About</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {profile.about}
                </p>
              </div>
            )}

            {(profile?.skills?.length ?? 0) > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-black">Skills</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base">
                  {profile?.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {profile?.availability && (
              <div className="text-gray-700 mb-2">
                <strong>Availability:</strong> {profile.availability}
              </div>
            )}
          </div>

          {/* RIGHT: Experience, Comment, Buttons */}
          <div className="sm:w-1/2 flex flex-col justify-between">
            <div className="flex-grow">
              {(profile?.prevRoles?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-black">
                    Previous Experience
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base">
                    {profile?.prevRoles.map((role, i) => (
                      <li key={i}>
                        <strong>{role.title}</strong>: {role.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comment Field */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-black mb-1">
                  Add Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write a comment about this tutor..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 rounded-lg bg-primary text-white font-semibold text-sm sm:text-base hover:bg-prime transition"
              >
                Submit
              </button>
              <button
                onClick={handleSelect}
                className={`w-full py-2 px-4 rounded-lg transition font-semibold text-sm sm:text-base ${
                  selected
                    ? "bg-red-600 text-white cursor-pointer"
                    : "bg-primary text-white hover:bg-prime cursor-pointer"
                }`}
              >
                {selected ? "Remove Tutor" : "Select"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPopUp;
