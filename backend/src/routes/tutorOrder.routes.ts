// routes/selectedTutors.ts
import { Router } from "express";
import {
    getTutorOrder,
    saveTutorOrder
} from "../controller/tutorOrderController";

const router = Router();

router.get("/tutor-order/:userId", getTutorOrder);
router.post("/tutor-order/:userId", saveTutorOrder);

export default router;
