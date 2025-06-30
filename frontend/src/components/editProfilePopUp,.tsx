import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Profile } from "@/services/api";
interface Props {
  setShowModal: (value: boolean) => void;
}
export default function ProfilePopUp({ setShowModal }: Props) {
  const { profile, updateProfile } = useAuth();
  const [editAbout, setEditAbout] = useState<string>(profile?.about || "");
  const [editAvailability, setEditAvailability] = useState<string>(
    profile?.availability || ""
  );
  const [editPrevRoles, setEditPrevRoles] = useState<
    Array<{ title: string; description: string }>
  >(profile?.prevRoles || []);
  const [editSkills, setEditSkills] = useState<string[]>(profile?.skills || []);
  const [editCredentials, setEditCredentials] = useState<string[]>(
    profile?.credentials || []
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const newErrors: string[] = [];

    if (!editAbout.trim()) newErrors.push("About section cannot be empty.");
    if (!editAvailability) newErrors.push("Availability must be selected.");

    editPrevRoles.forEach((role, i) => {
      if (!role.title.trim())
        newErrors.push(`Previous Role ${i + 1}: Title is required.`);
      if (!role.description.trim())
        newErrors.push(`Previous Role ${i + 1}: Description is required.`);
    });

    editSkills.forEach((skill, i) => {
      if (!skill.trim()) newErrors.push(`Skill ${i + 1} cannot be empty.`);
    });

    editCredentials.forEach((cred, i) => {
      if (!cred.trim()) newErrors.push(`Credential ${i + 1} cannot be empty.`);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedProfile: Profile = {
      ...profile, // keep id or other unmodified properties
      id: profile?.id,
      pictureURI: profile?.pictureURI,
      about: editAbout,
      availability: editAvailability,
      prevRoles: editPrevRoles,
      skills: editSkills,
      credentials: editCredentials,
    };

    // Send updatedProfile to the backend or state manager
    console.log("Updated Profile:", updatedProfile);

    updateProfile(updatedProfile);
    setShowModal(false);
  };
  const updatePrevRole = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setEditPrevRoles((prev) =>
      prev.map((role, i) => (i === index ? { ...role, [field]: value } : role))
    );
  };

  const addPrevRole = () => {
    setEditPrevRoles([...editPrevRoles, { title: "", description: "" }]);
  };

  const removePrevRole = (index: number) => {
    setEditPrevRoles(editPrevRoles.filter((_, i) => i !== index));
  };

  const addSkill = () => setEditSkills([...editSkills, ""]);
  const updateSkill = (index: number, value: string) => {
    setEditSkills(editSkills.map((s, i) => (i === index ? value : s)));
  };
  const removeSkill = (index: number) => {
    setEditSkills(editSkills.filter((_, i) => i !== index));
  };

  const addCredential = () => setEditCredentials([...editCredentials, ""]);
  const updateCredential = (index: number, value: string) => {
    setEditCredentials(
      editCredentials.map((c, i) => (i === index ? value : c))
    );
  };
  const removeCredential = (index: number) => {
    setEditCredentials(editCredentials.filter((_, i) => i !== index));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4 sm:px-6 overflow-y-hidden">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-3xl sm:max-w-3xl relative shadow-xl max-h-[90vh]">
        <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
        <form
          onSubmit={handleFormSubmit}
          className="space-y-6 max-h-[80vh] overflow-y-auto pr-2"
        >
          {/* About */}
          <div>
            <label className="block font-semibold mb-1">About Me</label>
            <textarea
              className="w-full border p-2 rounded"
              value={editAbout}
              onChange={(e) => setEditAbout(e.target.value)}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-semibold mb-1">Availability</label>
            <select
              className="w-full border p-2 rounded"
              value={editAvailability}
              onChange={(e) => setEditAvailability(e.target.value)}
            >
              <option value="">Select Availability</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>

          {/* Previous Roles */}
          <div>
            <label className="block font-semibold mb-2">Previous Roles</label>
            {editPrevRoles.map((role, index) => (
              <div key={index} className="mb-3 border p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={role.title}
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    updatePrevRole(index, "title", e.target.value)
                  }
                />
                <textarea
                  placeholder="Description"
                  value={role.description}
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    updatePrevRole(index, "description", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removePrevRole(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove Role
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPrevRole}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Role
            </button>
          </div>

          {/* Skills */}
          <div>
            <label className="block font-semibold mb-2">Skills</label>
            {editSkills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  className="w-full border p-2 rounded"
                  onChange={(e) => updateSkill(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Skill
            </button>
          </div>

          {/* Credentials */}
          <div>
            <label className="block font-semibold mb-2">Credentials</label>
            {editCredentials.map((cred, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={cred}
                  className="w-full border p-2 rounded"
                  onChange={(e) => updateCredential(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeCredential(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCredential}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Credential
            </button>
          </div>
          {errors.length > 0 && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 space-y-1 text-sm">
                {errors.map((err, idx) => (
                  <div key={idx}>• {err}</div>
                ))}
              </div>
            )}
          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
