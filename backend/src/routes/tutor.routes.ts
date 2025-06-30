// routes/selectedTutors.ts
import { Router } from "express";
import {
  getSelectedTutorsByLecturer,
  createSelectedTutors,
  updateSelectedTutors,
  getUniqueTutors
} from "../controller/SelectTutorController";

const router = Router();

router.get("/selectedTutors/lecturer/:lecturerId", getSelectedTutorsByLecturer);
router.post("/selectedTutors/", createSelectedTutors);
router.put("/selectedTutors/:id", updateSelectedTutors);
router.get("/uniqueTutors/:lecturerId", getUniqueTutors);

export default router;
