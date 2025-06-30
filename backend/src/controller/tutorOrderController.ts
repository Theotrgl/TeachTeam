// src/controllers/tutorOrderController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TutorOrder } from "../entity/tutorOrder";

export const getTutorOrder = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const repo = AppDataSource.getRepository(TutorOrder);
    let record = await repo.findOneBy({ userId });

    if (!record) {
      return res.status(200).json({ tutorIds: [] }); // No order saved yet
    }

    return res.json(record);
  } catch (error) {
    console.error("Error fetching tutor order:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const saveTutorOrder = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const { tutorIds } = req.body;

  if (!Array.isArray(tutorIds)) {
    return res.status(400).json({ error: "Invalid tutorIds" });
  }

  try {
    const repo = AppDataSource.getRepository(TutorOrder);
    let record = await repo.findOneBy({ userId });

    if (record) {
      record.tutorIds = tutorIds;
    } else {
      record = repo.create({ userId, tutorIds });
    }

    await repo.save(record);
    return res.json({ success: true, tutorIds: record.tutorIds });
  } catch (error) {
    console.error("Error saving tutor order:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
