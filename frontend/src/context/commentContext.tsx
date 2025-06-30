import { Comment } from "@/types/comment";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { User } from "@/services/api";

interface CommentContextType {
  comments: Comment[];
  comment: Comment | null;
  addComment: (text: string, lecturer: User, tutor: User) => boolean;
  getCommentForTutor: (lecturer: User, tutor: User) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<Comment | null>(null);
  const { profiles } = useAuth();

  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      const parsedComments = JSON.parse(storedComments);
      setComments(parsedComments);
    }
  }, []);

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  const addComment = (comment: string, lecturer: User, tutor: User): boolean => {
    if (!lecturer) return false;

    const newComment: Comment = {
      lecturer_id: lecturer.id,
      tutor_id: tutor.id,
      comment,
    };
  
    const updatedComments = comments.filter(
      (c) => !(c.lecturer_id === lecturer.id && c.tutor_id === tutor.id)
    );
  
    updatedComments.unshift(newComment);
  
    setComments(updatedComments);
    setComment(newComment);

    return true
  };

  const getCommentForTutor = (lecturer: User, tutor: User): string[] => {
    return comments
      .filter((c) => c.tutor_id === tutor.id && c.lecturer_id === lecturer.id)
      .map((c) => c.comment);
  };

  return (
    <CommentContext.Provider
      value={{ comments, comment, addComment, getCommentForTutor }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useTutor must be used within a TutorProvider");
  }
  return context;
};
