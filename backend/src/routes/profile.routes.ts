import { Router } from "express";
import { ProfileController } from "../controller/ProfileController";
import { getTutorProfiles } from "../controller/SelectTutorController";

const router = Router();
const profileController = new ProfileController();

router.get("/profiles", async (req, res) => {
  await profileController.all(req, res);
});

router.get("/profiles/:id", async (req, res) => {
  await profileController.one(req, res);
});

router.post("/profiles", async (req, res) => {
  await profileController.save(req, res);
});

router.put("/profiles/:id", async (req, res) => {
  await profileController.update(req, res);
});

router.delete("/profiles/:id", async (req, res) => {
  await profileController.remove(req, res);
});

router.get("/profiles/by-tutor-ids", getTutorProfiles);
export default router;
