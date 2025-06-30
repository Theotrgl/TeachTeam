// "use client";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import CommentPopUp from "./commentPopUp";
import { Profile, User,  } from "@/services/api";

interface DraggableListProps {
  tutors: User[];
  onReorder: (newTutors: User[]) => void;
}

export default function DraggableList({
  tutors,
  onReorder,
}: DraggableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

 const handleEditClick = (tutor: User) => {
  console.log("Clicked tutor:", tutor);
  console.log("Tutor profile:", tutor.profile); // Should not be undefined
  setSelectedTutor(tutor);
  setSelectedProfile(tutor.profile || null);
};


  const closePopUp = () => {
    setSelectedTutor(null);
    setSelectedProfile(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tutors.findIndex((tutor) => tutor.id === active.id);
    const newIndex = tutors.findIndex((tutor) => tutor.id === over.id);
    onReorder(arrayMove(tutors, oldIndex, newIndex));
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tutors} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {tutors.map((tutor, index) => (
              <SortableItem
                key={tutor.id}
                id={tutor.id}
                name= {`${tutor.firstName} ${tutor.lastName}`}
                index={index}
                onEdit={() => handleEditClick(tutor)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {selectedTutor && (
        <CommentPopUp
          tutor={selectedTutor}
          profile={selectedProfile}
          onClose={closePopUp}
        />
      )}
    </>
  );
}

interface SortableItemProps {
  id: number;
  name: string;
  index: number;
  onEdit: () => void;
}

function SortableItem({ id, name, index, onEdit }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-background shadow rounded-lg cursor-grab text-black"
    >
      <span>
        <strong className="mr-2">{index + 1}.</strong>
        {name}
      </span>
      <span className="material-icons cursor-pointer" onClick={onEdit}>
        edit
      </span>
    </li>
  );
}
