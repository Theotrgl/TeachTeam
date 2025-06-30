// routes/selectedCourses.ts
import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();

router.post("/selectedCourses", CourseController.saveSelectedCourses);
router.get("/selectedCourses/:userId", CourseController.getSelectedCourses);
router.get("/selectedCourses/lecturer/:userId", CourseController.getSelectedCoursesForLecturer);
router.put("/selectedCourses/:userId", CourseController.updateSelectedCourses);
router.get("/courses", CourseController.getAllCourses);

export default router;
