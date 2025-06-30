import { useState, createContext, useEffect, useContext } from "react";
import { useAuth } from "./authContext";
import {
  selectedCoursesApi,
  selectedTutorsApi,
  User,
  Profile,
  SelectedCourse,
  SelectedTutors,
} from "@/services/api";

interface TutorContextType {
  tutors: User[];
  setTutors: React.Dispatch<React.SetStateAction<User[]>>;
  selectedTutors: SelectedTutors | null;
  selectedCourse: SelectedCourse[];
  tutorProfiles: Profile[];
  addTutor: (tutor: User) => void;
  removeTutor: (tutor: User) => void;
  isSelected: (tutor: User) => boolean;
  fetchSelectedTutors: () => void;
  setSelectedTutors: React.Dispatch<
    React.SetStateAction<SelectedTutors | null>
  >;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

export const TutorProvider = ({
  children,
  lecturerId = 0,
}: {
  children: React.ReactNode;
  lecturerId?: number;
}) => {
  const [tutors, setTutors] = useState<User[]>([]);
  const [selectedTutors, setSelectedTutors] = useState<SelectedTutors | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse[]>([]);
  const [tutorProfiles, setTutorProfiles] = useState<Profile[]>([]);
  const { user, users, profiles, updateProfile } = useAuth();

  useEffect(() => {
    const fetchTutorsAndSelection = async () => {
      if (!user?.id || user.role !== "Lecturer") return;

      // console.log(
      //   "[TutorContext] Fetching selected courses and tutors for lecturer",
      //   user.id
      // );

      const selectedCourseEntries =
        await selectedCoursesApi.getSelectedCoursesByLecturer(user.id);
      // console.log(
      //   "[TutorContext] Selected course entries:",
      //   selectedCourseEntries
      // );
      setSelectedCourse(selectedCourseEntries);

      const selectedCourses = selectedCourseEntries.flatMap(
        (entry) => entry.courses
      );
      // console.log(
      //   "[TutorContext] Flattened selected courses:",
      //   selectedCourses
      // );

      const filteredTutors = await selectedTutorsApi.getUniqueTutors(user.id);
      // console.log("[TutorContext] Unique tutors:", filteredTutors);
      setTutors(filteredTutors);

      const tutorProfiles = filteredTutors
        .map((tutor) => tutor.profile)
        .filter((profile): profile is Profile => !!profile);

      // console.log("[TutorContext] Tutor profiles:", tutorProfiles);
      setTutorProfiles(tutorProfiles);

      try {
        const selection = await selectedTutorsApi.getSelectedTutorsByLecturer(
          user.id
        );
        console.log("[TutorContext] Existing selection found:", selection);
        setSelectedTutors(selection);
      } catch (err) {
        console.warn("[TutorContext] No existing selection, creating new...");
        const newEntry = await selectedTutorsApi.createSelectedTutors({
          lecturerId: user.id,
          tutorIds: [],
        });
        // console.log("[TutorContext] New selection created:", newEntry);
        setSelectedTutors(newEntry);
      }
    };

    fetchTutorsAndSelection();
  }, [user, users, profiles]);

  const syncToBackend = async (updated: SelectedTutors) => {
    // console.log("[TutorContext] Syncing to backend:", updated);
    await selectedTutorsApi.updateSelectedTutors(updated.id, {
      lecturerId: updated.lecturerId,
      tutorIds: updated.tutors.map((t) => t.id),
    });
  };

  const addTutor = async (tutor: User) => {
    if (!selectedTutors) return;

    // console.log("[TutorContext] Adding tutor:", tutor);
    const alreadySelected = selectedTutors.tutors.some(
      (t) => t.id === tutor.id
    );
    if (alreadySelected) {
      console.log("[TutorContext] Tutor already selected:", tutor.id);
      return;
    }

    const updatedTutors = [...selectedTutors.tutors, tutor];
    const updated = { ...selectedTutors, tutors: updatedTutors };

    setSelectedTutors(updated);
    await syncToBackend(updated);

    const profile = tutor.profile;
    if (profile) {
      updateProfile({ ...profile, agg_selected: (profile.agg_selected += 1) });
    }
  };
  const fetchSelectedTutors = async (): Promise<void> => {
    if (!user) return;
    const selection = await selectedTutorsApi.getSelectedTutorsByLecturer(
      user.id
    );
    setSelectedTutors(selection);
  };

  const removeTutor = async (tutor: User) => {
    if (!selectedTutors) return;

    // console.log("[TutorContext] Removing tutor:", tutor);
    const updatedTutors = selectedTutors.tutors.filter(
      (t) => t.id !== tutor.id
    );
    const updated = { ...selectedTutors, tutors: updatedTutors };

    setSelectedTutors(updated);
    await syncToBackend(updated);

    const profile = tutor.profile;
    if (profile) {
      updateProfile({
        ...profile,
        agg_selected: Math.max(profile.agg_selected - 1, 0),
      });
    }
  };

  const isSelected = (tutor: User) =>
    selectedTutors?.tutors.some((t) => t.id === tutor.id) ?? false;

  return (
    <TutorContext.Provider
      value={{
        tutors,
        selectedTutors,
        tutorProfiles,
        selectedCourse,
        addTutor,
        removeTutor,
        setTutors,
        isSelected,
        fetchSelectedTutors,
        setSelectedTutors,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};

export const useTutor = () => {
  const context = useContext(TutorContext);
  if (!context) throw new Error("useTutor must be used within a TutorProvider");
  return context;
};
