// components/TutorRanking.tsx
import { useTutor } from "@/context/tutorContext";
import { useAuth } from "@/context/authContext";
import DraggableList from "@/components/dragndrop";
import { useDragNDrop } from "@/context/dragNDropContext";

export default function TutorDragNDrop() {
  const { user } = useAuth();
  const { selectedTutors } = useTutor();
    const { dragTutors, reorderTutors } = useDragNDrop();
  

  if (!user || user.role !== "Lecturer") return null;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-8 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-black mb-4">Tutor Ranking</h1>

      {selectedTutors?.lecturerId === user.id &&
      selectedTutors?.tutors?.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Hold and drag a tutor to adjust their ranking.
          </p>
          <DraggableList tutors={dragTutors} onReorder={reorderTutors} />
        </>
      ) : (
        <>
          <p className="text-gray-400 mb-2">No Tutors Selected</p>
          <a className="text-blue-600 hover:underline" href="/tutors">
            → Select Tutors
          </a>
          <DraggableList tutors={dragTutors} onReorder={reorderTutors} />
        </>
      )}
    </div>
  );
}
