import { Router } from "express";
import { CommentController } from "../controller/CommentController";

const commentController = new CommentController();
const router = Router();

router.get("/comments", commentController.all.bind(commentController));
router.get("/comments/lookup", commentController.getByLecturerTutor.bind(commentController));
router.post("/comments", commentController.save.bind(commentController));

export default router;
