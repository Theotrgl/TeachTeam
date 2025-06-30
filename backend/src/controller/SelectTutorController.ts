// controllers/selectedTutorController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SelectedTutors } from "../entity/selectedTutors";
import { User } from "../entity/User";
import { SelectedCourses } from "../entity/selectedCourses";
import { In } from "typeorm";



export const getSelectedTutorsByLecturer = async (
  req: Request,
  res: Response
) => {
  const lecturerId = Number(req.params.lecturerId);
  const selectedTutorRepo = AppDataSource.getRepository(SelectedTutors); // <--
  const selected = await selectedTutorRepo.findOne({
    where: { lecturerId },
    relations: ["tutors", "tutors.profile"],
  });

  if (!selected) return res.status(404).json({ message: "Not found" });
  res.json(selected);
};

export const createSelectedTutors = async (req: Request, res: Response) => {
  const { lecturerId, tutorIds } = req.body;

  const userRepo = AppDataSource.getRepository(User);               // <--
  const selectedTutorRepo = AppDataSource.getRepository(SelectedTutors); // <--
  const tutors = await userRepo.findByIds(tutorIds);
  const newEntry = selectedTutorRepo.create({ lecturerId, tutors });

  await selectedTutorRepo.save(newEntry);
  res.status(201).json(newEntry);
};

export const updateSelectedTutors = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { lecturerId, tutorIds } = req.body;

  const selectedTutorRepo = AppDataSource.getRepository(SelectedTutors); // <--
  const userRepo = AppDataSource.getRepository(User);                    // <--

  const entry = await selectedTutorRepo.findOne({
    where: { id },
    relations: ["tutors"],
  });
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const tutors = await userRepo.findByIds(tutorIds);

  entry.lecturerId = lecturerId;
  entry.tutors = tutors;

  await selectedTutorRepo.save(entry);
  res.json(entry);
};

export const getUniqueTutors = async (req: Request, res: Response) => {
  try {
    const lecturerId = parseInt(req.params.lecturerId, 10);
    if (isNaN(lecturerId)) {
      return res.status(400).json({ error: "Invalid lecturerId parameter" });
    }

    const selectedCoursesRepo = AppDataSource.getRepository(SelectedCourses);

    const selectedCoursesEntities = await selectedCoursesRepo.find({
      relations: ["user", "courses", "courses.lecturer"],
    });

    const tutorMap = new Map<number, User>();

    for (const entry of selectedCoursesEntities) {
      // Check if any course linked to this entry is taught by the target lecturer
      const hasCourseByLecturer = entry.courses.some(
        (course) => course.lecturer?.id === lecturerId
      );

      if (hasCourseByLecturer && entry.user?.role === "candidate") {
        tutorMap.set(entry.user.id, entry.user);
      }
    }

    // Get all unique tutor IDs
    const tutorIds = Array.from(tutorMap.keys());

    if (tutorIds.length === 0) {
      return res.status(200).json([]); // No tutors found
    }

    // Fetch tutors with profile relation
    const userRepo = AppDataSource.getRepository(User);
    const tutorsWithProfiles = await userRepo.find({
      where: { id: In(tutorIds) },
      relations: ["profile"],
    });

    return res.status(200).json(tutorsWithProfiles);
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};

export const getTutorProfiles = async (req: Request, res: Response) => {
  try {
    // Optionally filter by user IDs (tutor IDs) from query params
    const ids = req.query.ids as string;

    if (!ids) {
      return res.status(400).json({ error: "Missing 'ids' query parameter." });
    }

    const idArray = ids
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (!idArray.length) {
      return res.status(400).json({ error: "Invalid tutor IDs provided." });
    }

    const users = await AppDataSource.getRepository(User).find({
      where: { id: In(idArray) },
      relations: ["profile"], // assuming User has `@OneToOne(() => Profile)` or similar
    });

    const profiles = users.filter((u) => u.profile).map((u) => u.profile);

    return res.status(200).json(profiles);
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
};
