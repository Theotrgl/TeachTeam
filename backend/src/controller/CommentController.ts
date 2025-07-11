import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Comments } from "../entity/Comments";

export class CommentController {
  private commentRepository = AppDataSource.getRepository(Comments);

  async all(request: Request, response: Response) {
    const comments = await this.commentRepository.find();
    return response.json(comments);
  }

  async getByLecturerTutor(request: Request, response: Response) {
    const { lecturerId, tutorId } = request.query;
    const comments = await this.commentRepository.find({
      where: {
        lecturer_id: Number(lecturerId),
        tutor_id: Number(tutorId),
      },
    });
    return response.json(comments);
  }

  async save(request: Request, response: Response) {
    const { lecturer_id, tutor_id, comment } = request.body;

    const newComment = this.commentRepository.create({
      lecturer_id,
      tutor_id,
      comment,
    });

    const existing = await this.commentRepository.findOne({
      where: { lecturer_id, tutor_id },
    });

    if (existing) {
      await this.commentRepository.remove(existing);
    }

    const savedComment = await this.commentRepository.save(newComment);
    return response.status(201).json(savedComment);
  }
}
