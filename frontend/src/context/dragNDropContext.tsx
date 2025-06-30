import React, { createContext, useContext, useEffect, useState } from "react";
import { selectedTutorsApi, User, tutorOrderApi } from "@/services/api";
import { useTutor } from "./tutorContext";
import { useAuth } from "./authContext";

interface DragNDropContextType {
  dragTutors: User[];
  reorderTutors: (newTutors: User[]) => void;
}

const DragNDropContext = createContext<DragNDropContextType | undefined>(
  undefined
);

export const DragNDropProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {selectedTutors} = useTutor();
  const { user } = useAuth();
  const [dragTutors, setDragTutors] = useState<User[]>([]); // local only
  
  useEffect(() => {
    const loadTutorsInCorrectOrder = async () => {
      if (!selectedTutors || !user?.id) return;

      try {
        const savedOrder = await tutorOrderApi.getTutorOrder(user.id);
        const savedIds = savedOrder.tutorIds.map(Number);

        const orderedTutors = savedIds
          .map((id) => selectedTutors.tutors.find((t) => t.id === id))
          .filter((t): t is User => Boolean(t));

        const unorderedTutors = selectedTutors.tutors.filter(
          (t) => !savedIds.includes(t.id)
        );

        const finalList = [...orderedTutors, ...unorderedTutors];

        console.log("[DragNDrop Load] Final dragTutors order:", finalList.map(t => t.id));
        setDragTutors(finalList);
      } catch (error) {
        console.error("Failed to load tutor order:", error);
        setDragTutors(selectedTutors.tutors);
      }
    };

    loadTutorsInCorrectOrder();
  }, [selectedTutors, user?.id]);

  const reorderTutors = async (newTutors: User[]) => {
    setDragTutors(newTutors);

    if (user?.id && selectedTutors?.id) {
      const tutorIds = newTutors.map((t) => t.id);
      try {
        await tutorOrderApi.saveTutorOrder(user.id, tutorIds);
        await selectedTutorsApi.updateSelectedTutors(selectedTutors.id, {
          lecturerId: selectedTutors.lecturerId,
          tutorIds,
        });
      } catch (error) {
        console.error("Failed to save tutor order:", error);
      }
    }
  };

  return (
    <DragNDropContext.Provider value={{ dragTutors, reorderTutors }}>
      {children}
    </DragNDropContext.Provider>
  );
};

export const useDragNDrop = () => {
  const context = useContext(DragNDropContext);
  if (!context)
    throw new Error("useDragNDrop must be used within a DragNDropProvider");
  return context;
};
