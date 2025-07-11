import { createContext, useCallback, useContext, useState } from "react";
import { commentApi, Comment, User } from "@/services/api"; // adjust path if needed

interface CommentContextType {
  comment: Comment | null;
  addComment: (text: string, lecturer: User, tutor: User) => Promise<boolean>;
  getCommentForTutor: (lecturer: User, tutor: User) => Promise<Comment | null>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<Comment | null>(null);

  const addComment = useCallback(
    async (text: string, lecturer: User, tutor: User): Promise<boolean> => {
      try {
        const data = await commentApi.addComment(text, lecturer.id, tutor.id);
        setComment(data);

        // Refresh the comments list for this lecturer-tutor pair
        const updatedComments = await commentApi.getCommentForTutor(
          lecturer.id,
          tutor.id
        );
        setComments(updatedComments);

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    []
  );

  const getCommentForTutor = useCallback(
    async (lecturer: User, tutor: User): Promise<Comment | null> => {
      try {
        const data = await commentApi.getCommentForTutor(lecturer.id, tutor.id);
        // Assuming your backend returns array, take the first or null
        const comment = data.length > 0 ? data[0] : null;
        setComment(comment);
        return comment;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    []
  );

  return (
    <CommentContext.Provider
      value={{ comment, addComment, getCommentForTutor }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context)
    throw new Error("useComment must be used within a CommentProvider");
  return context;
};
