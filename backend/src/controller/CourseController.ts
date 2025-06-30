import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SelectedCourses } from "../entity/selectedCourses";
import { Courses } from "../entity/Courses";
import { User } from "../entity/User";

export class CourseController {
  static async saveSelectedCourses(req: Request, res: Response) {
    const { userId, courseIds } = req.body;

    if (!userId || !Array.isArray(courseIds)) {
      return res
        .status(400)
        .json({ error: "userId and courseIds are required." });
    }

    try {
      const userRepo = AppDataSource.getRepository(User);
      const courseRepo = AppDataSource.getRepository(Courses);
      const selectedRepo = AppDataSource.getRepository(SelectedCourses);

      const user = await userRepo.findOneByOrFail({ id: userId });
      const courses = await courseRepo.findByIds(courseIds);

      let selected = await selectedRepo.findOne({
        where: { user: { id: userId } },
        relations: ["courses", "user"],
      });

      if (!selected) {
        selected = selectedRepo.create({ user, courses });
      } else {
        selected.courses = courses;
      }

      await selectedRepo.save(selected);

      return res.status(200).json({ success: true, selected });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }

  static async getSelectedCourses(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Invalid or missing userId parameter." });
    }

    try {
      const selected = await AppDataSource.getRepository(
        SelectedCourses
      ).findOne({
        where: { user: { id: userId } },
        relations: ["courses"],
      });

      if (!selected) {
        return res
          .status(404)
          .json({ message: "No selected courses found for this user." });
      }

      return res.status(200).json(selected.courses);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: err.message });
    }
  }
  static async getSelectedCoursesForLecturer(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);

  if (!userId) {
    return res.status(400).json({ error: "Invalid or missing userId parameter." });
  }

  try {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "Lecturer") {
      return res.status(403).json({ error: "Access denied. User is not a lecturer." });
    }

    const selectedCourses = await AppDataSource.getRepository(SelectedCourses).find({
      relations: ["courses", "courses.lecturer"],
    });

    const filtered = selectedCourses.filter(entry =>
      entry.courses.some(course => course.lecturer?.id === userId)
    );

    return res.status(200).json(filtered);
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
}
  static async updateSelectedCourses(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds)) {
      return res.status(400).json({ message: "courseIds must be an array" });
    }

    try {
      const selectedRepo = AppDataSource.getRepository(SelectedCourses);
      const courseRepo = AppDataSource.getRepository(Courses);
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Even if empty, this is okay — we will clear selected courses
      const courseEntities = courseIds.length
        ? await courseRepo.findByIds(courseIds)
        : [];

      let selected = await selectedRepo.findOne({
        where: { user: { id: userId } },
        relations: ["courses", "user"],
      });

      if (selected) {
        selected.courses = courseEntities;
        await selectedRepo.save(selected);
      } else {
        selected = selectedRepo.create({
          user: user,
          courses: courseEntities,
        });
        await selectedRepo.save(selected);
      }

      return res.json(selected);
    } catch (error) {
      console.error("Error updating selected courses:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

static async getAllCourses(req: Request, res: Response) {
  try {
    const courseRepo = AppDataSource.getRepository(Courses);
    const courses = await courseRepo.find({ relations: ["lecturer"] });
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

}
