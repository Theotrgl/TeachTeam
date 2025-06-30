import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust this to match your backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or use a global in-memory state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profile?: Profile;
  // Ensure these are consistent with what's used in the backend:
  position: string;
  username: string;
  password: string;
  profile_idt: number;
  profileId: number,
  createdAt: Date,
  updatedAt: Date,
}

export interface Profile {
  id: number;
  about: string;
  pictureURI: string;
  prevRoles: Array<{ title: string; description: string }>;
  availability: string;
  skills: Array<string>;
  credentials: Array<string>;
  agg_selected: number;
}

export interface Course {
  id: number;
  title: string;
  code: string;
  desc: string;
  lecturer: User;
  role: string;
}

export interface SelectedCourse {
  id: number;
  user: User;
  courses: Course[];
}

export interface SelectedTutors {
  id: number;
  lecturerId: number;
  tutors: User[];
}
export const userApi = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (user: Partial<User>) => {
    const response = await api.post("/users", user);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  loginUser: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/current-user");
    return response.data;
  },
};

export const profileApi = {
  getAllProfiles: async () => {
    const response = await api.get("/profiles");
    return response.data;
  },

  getProfileById: async (id: number) => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  createProfile: async (user: Partial<User>) => {
    const response = await api.post("/profiles", user);
    return response.data;
  },

  updateProfile: async (id: number, user: Partial<User>) => {
    const response = await api.put(`/profiles/${id}`, user);
    return response.data;
  },

  deleteProfile: async (id: number) => {
    const response = await api.delete(`/profiles/${id}`);
    return response.data;
  },
  getProfilesByTutorIds: async (tutorIds: number[]): Promise<Profile[]> => {
    const ids = tutorIds.join(",");
    const response = await api.get(`/profiles/by-tutor-ids?ids=${ids}`);
    return response.data;
  },
};

export const selectedCoursesApi = {
  // Save selected courses for a user
  saveSelectedCourses: async (userId: number, courseIds: number[]) => {
    const response = await api.post("/selectedCourses", {
      userId,
      courseIds,
    });
    return response.data;
  },

  getSelectedCoursesByUser: async (userId: number): Promise<Course[]> => {
    const response = await api.get(`/selectedCourses/${userId}`);
    return response.data;
  },
  getSelectedCoursesByLecturer: async (
    userId: number
  ): Promise<SelectedCourse[]> => {
    const response = await api.get(`/selectedCourses/lecturer/${userId}`);
    return response.data;
  },

  updateUserSelectedCourses: async (userId: number, courses: Course[]) => {
    const courseIds = courses.map((course) => course.id);
    const response = await api.put(`/selectedCourses/${userId}`, { courseIds });
    return response.data;
  },

  getAllCourses: async () => {
    const response = await api.get("/courses");
    return response.data;
  },
};

export const selectedTutorsApi = {
  // Save selected tutors for a lecturer
  getSelectedTutorsByLecturer: async (
    lecturerId: number
  ): Promise<SelectedTutors> => {
    const response = await api.get(`/selectedTutors/lecturer/${lecturerId}`);
    return response.data;
  },

  updateSelectedTutors: async (
    id: number,
    data: { lecturerId: number; tutorIds: number[] }
  ) => {
    const response = await api.put(`/selectedTutors/${id}`, data);
    return response.data;
  },

  createSelectedTutors: async (data: {
    lecturerId: number;
    tutorIds: number[];
  }) => {
    const response = await api.post("/selectedTutors", data);
    return response.data;
  },

  getUniqueTutors: async (lecturerId: number): Promise<User[]> => {
    const response = await api.get(`/uniqueTutors/${lecturerId}`);
    return response.data;
  },
};

export const tutorOrderApi = {
  getTutorOrder: async (userId: number): Promise<{ tutorIds: number[] }> => {
    const response = await api.get(`/tutor-order/${userId}`);
    return response.data;
  },

  saveTutorOrder: async (userId: number, tutorIds: number[]) => {
    const response = await api.post(`/tutor-order/${userId}`, { tutorIds });
    return response.data;
  },
};