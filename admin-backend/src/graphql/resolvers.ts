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
      const selections = await selectedTutorsRepository.find({
        relations: ["tutors"],
      });

      const courses = await courseRepository.find({
        relations: ["lecturer"],
      });

      // Map lecturerId to course info
      const lecturerToCourseMap: Record<number, { id: number; title: string }> =
        {};
      for (const course of courses) {
        if (course.lecturer) {
          lecturerToCourseMap[course.lecturer.id] = {
            id: course.id,
            title: course.title,
          };
        }
      }

      // Group tutors by course
      const courseMap: Record<
        number,
        { id: number; title: string; candidates: any[] }
      > = {};

      for (const selection of selections) {
        const course = lecturerToCourseMap[selection.lecturerId];
        if (!course) continue;

        if (!courseMap[course.id]) {
          courseMap[course.id] = {
            id: course.id,
            title: course.title,
            candidates: [],
          };
        }

        for (const tutor of selection.tutors || []) {
          courseMap[course.id].candidates.push({
            id: tutor.id,
            firstName: tutor.firstName,
            lastName: tutor.lastName,
          });
        }
      }

      // Include all courses, even with no candidates
      const allCourses = await courseRepository.find();

      const result = allCourses.map((course) => ({
        id: course.id,
        title: course.title,
        candidates: courseMap[course.id]?.candidates || [],
      }));

      return result;
    },

    candidatesWithMoreThan3Courses: async () => {
      // Fetch all selectedCourses (candidate's applied courses)
      const selections = await selectedCoursesRepository.find({
        relations: ["user", "courses"],
      });

      // Fetch all selectedTutors (lecturer -> tutors chosen)
      const selectedTutors = await selectedTutorsRepository.find({
        relations: ["tutors"],
      });

      // Fetch all courses (to get lecturer per course)
      const allCourses = await courseRepository.find({
        relations: ["lecturer"],
      });

      // Build a map: lecturerId -> set of tutorIds chosen
      const lecturerToTutorIds = new Map<number, Set<number>>();
      for (const st of selectedTutors) {
        const tutorIds = new Set(st.tutors.map((t) => t.id));
        lecturerToTutorIds.set(st.lecturerId, tutorIds);
      }

      // Build a map: courseId -> lecturerId
      const courseToLecturer = new Map<number, number>();
      for (const course of allCourses) {
        if (course.lecturer) {
          courseToLecturer.set(course.id, course.lecturer.id);
        }
      }

      // Count how many courses each candidate is *actually chosen for*
      const userChosenCourseCount = new Map<number, number>();

      for (const selection of selections) {
        const userId = selection.user?.id;
        if (!userId) continue;

        // For each course the candidate has applied for
        for (const course of selection.courses) {
          const lecturerId = courseToLecturer.get(course.id);
          if (!lecturerId) continue;

          // Check if this candidate is chosen by this lecturer
          const chosenTutorIds = lecturerToTutorIds.get(lecturerId);
          if (chosenTutorIds && chosenTutorIds.has(userId)) {
            userChosenCourseCount.set(
              userId,
              (userChosenCourseCount.get(userId) || 0) + 1
            );
          }
        }
      }

      // Filter users chosen for more than 3 courses
      const over3UserIds = Array.from(userChosenCourseCount.entries())
        .filter(([_, count]) => count > 3)
        .map(([userId]) => userId);

      if (over3UserIds.length === 0) return [];

      // Fetch full user info
      const users = await userRepository.find({
        where: { id: In(over3UserIds), role: "Candidate" },
        relations: ["profile"],
      });

      return users;
    },

    candidatesWithNoCourses: async () => {
      // Same fetching as above
      const selections = await selectedCoursesRepository.find({
        relations: ["user", "courses"],
      });
      const selectedTutors = await selectedTutorsRepository.find({
        relations: ["tutors"],
      });
      const allCourses = await courseRepository.find({
        relations: ["lecturer"],
      });

      // Build lecturer -> chosen tutor IDs map
      const lecturerToTutorIds = new Map<number, Set<number>>();
      for (const st of selectedTutors) {
        const tutorIds = new Set(st.tutors.map((t) => t.id));
        lecturerToTutorIds.set(st.lecturerId, tutorIds);
      }

      // Build course -> lecturer map
      const courseToLecturer = new Map<number, number>();
      for (const course of allCourses) {
        if (course.lecturer) {
          courseToLecturer.set(course.id, course.lecturer.id);
        }
      }

      // Collect all candidates who are chosen for any course
      const chosenCandidates = new Set<number>();
      for (const selection of selections) {
        const userId = selection.user?.id;
        if (!userId) continue;

        for (const course of selection.courses) {
          const lecturerId = courseToLecturer.get(course.id);
          if (!lecturerId) continue;

          const chosenTutorIds = lecturerToTutorIds.get(lecturerId);
          if (chosenTutorIds && chosenTutorIds.has(userId)) {
            chosenCandidates.add(userId);
          }
        }
      }

      // Fetch all candidates
      const allCandidates = await userRepository.find({
        where: { role: "Candidate" },
        relations: ["profile"],
      });

      // Filter candidates who were never chosen for any course
      const noCourseCandidates = allCandidates.filter(
        (candidate) => !chosenCandidates.has(candidate.id)
      );

      return noCourseCandidates;
    },

    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const user = await userRepository.findOne({
        where: { firstName: username },
      });
      if (!user) {
        throw new Error("Invalid username or password");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid username or password");
      }

      if (user.role !== "Admin") {
        throw new Error("Access denied: Only Admin users can log in");
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return token;
    },
  },

  Mutation: {
    updateUser: async (
      _: any,
      {
        id,
        firstName,
        lastName,
        role,
      }: { id: string; firstName?: string; lastName?: string; role?: string }
    ) => {
      const user = await userRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!user) throw new Error("User not found");

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (role !== undefined) user.role = role;

      return await userRepository.save(user);
    },

    createUser: async (
      _: any,
      {
        input,
      }: {
        input: {
          firstName: string;
          lastName: string;
          email: string;
          role: string;
          password: string;
        };
      }
    ) => {
      // Find max existing ID in users tableconst latestUsers = await userRepository.find({
      const latestUsers = await userRepository.find({
        order: { id: "DESC" },
        take: 1,
      });

      const latestUser = latestUsers[0];

      const newId = latestUser ? latestUser.id + 1 : 1; // if no users, start at 1

      // Hash the password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const profile = profileRepository.create({
        about: "",
        pictureURI: "https://mighty.tools/mockmind-api/content/abstract/47.jpg",
        prevRoles: [],
        availability: "",
        skills: [],
        credentials: [],
        agg_selected: 0,
      });

      const newUser = userRepository.create({
        id: newId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: input.role,
        password: hashedPassword,
        isBlocked: false,
        profile, // just assign, don't save separately
      });

      // Save user + profile in one step
      await userRepository.save(newUser);

      // Now create selectedCourses
      const selectedCourses = selectedCoursesRepository.create({
        user: newUser,
        courses: [],
      });

      await selectedCoursesRepository.save(selectedCourses);

      return await userRepository.findOne({
        where: { id: newUser.id },
        relations: ["profile"],
      });
    },

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
