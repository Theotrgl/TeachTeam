import { AppDataSource } from "../data-source";
import { Profile } from "../entity/Profile";
import { Courses } from "../entity/Courses";
import { User } from "../entity/User";
import { Comments } from "../entity/Comments";
import { PrevRoles } from "../entity/prevRoles";
import { SelectedCourses } from "../entity/selectedCourses";
import { SelectedTutors } from "../entity/selectedTutors";
import { TutorOrder } from "../entity/tutorOrder";
import { In } from "typeorm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "default_secret";

const profileRepository = AppDataSource.getRepository(Profile);
const courseRepository = AppDataSource.getRepository(Courses);
const userRepository = AppDataSource.getRepository(User);
const commentsRepository = AppDataSource.getRepository(Comments);
const prevRolesRepository = AppDataSource.getRepository(PrevRoles);
const selectedCoursesRepository = AppDataSource.getRepository(SelectedCourses);
const selectedTutorsRepository = AppDataSource.getRepository(SelectedTutors);
const tutorOrderRepository = AppDataSource.getRepository(TutorOrder);

export const resolvers = {
  Query: {
    profiles: async () => await profileRepository.find(),
    profile: async (_: any, { id }: { id: string }) => {
      return await profileRepository.findOne({ where: { id: parseInt(id) } });
    },
    courses: async () =>
      await courseRepository.find({ relations: ["lecturer"] }),
    course: async (_: any, { id }: { id: string }) => {
      return await courseRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["lecturer"],
      });
    },
    users: async () => await userRepository.find({ relations: ["profile"] }),
    user: async (_: any, { id }: { id: string }) => {
      return await userRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["profile"],
      });
    },
    selectedCourses: async () =>
      await selectedCoursesRepository.find({ relations: ["courses", "user"] }),
    selectedTutors: async () =>
      await selectedTutorsRepository.find({ relations: ["tutors"] }),
    tutorOrders: async () => await tutorOrderRepository.find(),
    comments: async () => await commentsRepository.find(),
    prevRoles: async () => await prevRolesRepository.find(),
    candidatesPerCourse: async () => {
      const selections = await selectedCoursesRepository.find({
        relations: ["courses", "user"],
      });

      const courseMap: Record<
        string,
        { id: number; title: string; candidates: any[] }
      > = {};

      for (const selection of selections) {
        const user = selection.user;
        const isCandidate = user?.role === "candidate";
        if (!isCandidate) continue;

        for (const course of selection.courses || []) {
          if (!courseMap[course.id]) {
            courseMap[course.id] = {
              id: course.id,
              title: course.title,
              candidates: [],
            };
          }

          courseMap[course.id].candidates.push({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        }
      }

      // Fetch all courses to include courses with no candidates
      const allCourses = await courseRepository.find();

      const result = allCourses.map((course) => ({
        id: course.id,
        title: course.title,
        candidates: courseMap[course.id]?.candidates || [],
      }));

      return result;
    },

    candidatesWithMoreThan3Courses: async () => {
      const selections = await selectedCoursesRepository.find({
        relations: ["user", "courses"],
      });

      console.log("Total selection entries:", selections.length);

      const userCourseCount: Record<number, number> = {};

      for (const selection of selections) {
        const userId = selection.user?.id;
        if (!userId) continue;
        const courseCount = selection.courses?.length || 0;
        userCourseCount[userId] = (userCourseCount[userId] || 0) + courseCount;
      }

      const over3UserIds = Object.entries(userCourseCount)
        .filter(([_, count]) => count > 3)
        .map(([id]) => parseInt(id));

      console.log("User IDs with more than 3 courses:", over3UserIds);

      if (over3UserIds.length === 0) return [];

      const result = await userRepository.find({
        where: {
          id: In(over3UserIds),
          role: "candidate",
        },
        relations: ["profile"],
      });

      console.log("Candidates with more than 3 courses found:", result.length);
      return result;
    },

    candidatesWithNoCourses: async () => {
      const selections = await selectedCoursesRepository.find({
        relations: ["user", "courses"],
      });

      const selectedUserIds = new Set<number>();

      for (const selection of selections) {
        const userId = selection.user?.id;
        const courseCount = selection.courses?.length || 0;
        if (userId && courseCount > 0) {
          selectedUserIds.add(userId);
        }
      }

      console.log(
        "User IDs with at least one course:",
        Array.from(selectedUserIds)
      );

      const allCandidates = await userRepository.find({
        where: { role: "candidate" },
        relations: ["profile"],
      });

      const result = allCandidates.filter(
        (user) => !selectedUserIds.has(user.id)
      );

      console.log("Candidates with no courses found:", result.length);

      return result;
    },
    login: async (
      _parent: unknown,
      args: { username: string; password: string }
    ): Promise<string> => {
      const { username, password } = args;

      // Here username is actually email
      const user = await userRepository.findOne({ where: { firstName: username } });
      if (!user) throw new Error("Invalid credentials");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error("Invalid credentials");

      return jwt.sign(
        { id: user.id, email: user.firstName, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
    },
  },

  Mutation: {
    createProfile: async (_: any, args: any) => {
      const profile = profileRepository.create(args);
      return await profileRepository.save(profile);
    },
    updateProfile: async (
      _: any,
      { id, ...args }: { id: string } & Partial<Profile>
    ) => {
      await profileRepository.update(id, args);
      return await profileRepository.findOne({ where: { id: parseInt(id) } });
    },
    deleteProfile: async (_: any, { id }: { id: string }) => {
      const result = await profileRepository.delete(id);
      return result.affected !== 0;
    },

    createCourse: async (_: any, args: any) => {
      const course = courseRepository.create(args);
      return await courseRepository.save(course);
    },
    updateCourse: async (
      _: any,
      { id, ...args }: { id: string } & Partial<Courses>
    ) => {
      await courseRepository.update(id, args);
      return await courseRepository.findOne({ where: { id: parseInt(id) } });
    },
    deleteCourse: async (_: any, { id }: { id: string }) => {
      const result = await courseRepository.delete(id);
      return result.affected !== 0;
    },

    assignLecturerToCourse: async (
      _: any,
      { courseId, lecturerId }: { courseId: string; lecturerId: string }
    ) => {
      const course = await courseRepository.findOne({
        where: { id: parseInt(courseId) },
      });
      const lecturer = await userRepository.findOne({
        where: { id: parseInt(lecturerId) },
      });
      if (!course || !lecturer) throw new Error("Course or Lecturer not found");
      course.lecturer = lecturer;
      return await courseRepository.save(course);
    },

    blockUser: async (_: any, { userId }: { userId: string }) => {
      const user = await userRepository.findOne({
        where: { id: parseInt(userId) },
      });
      if (!user) throw new Error("User not found");
      user.isBlocked = true;
      return await userRepository.save(user);
    },

    unblockUser: async (_: any, { userId }: { userId: string }) => {
      const user = await userRepository.findOne({
        where: { id: parseInt(userId) },
      });
      if (!user) throw new Error("User not found");
      user.isBlocked = false;
      return await userRepository.save(user);
    },
  },
};
