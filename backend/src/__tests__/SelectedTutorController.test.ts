// __tests__/selectedTutorController.test.ts
import { Request, Response } from "express";
import {
  getSelectedTutorsByLecturer,
  createSelectedTutors,
  getUniqueTutors,
} from "../controller/SelectTutorController";
import { AppDataSource } from "../data-source";

// Mocks for dependencies
jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

// Common mock functions for Express response
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));
const mockResponse = () => ({
  status: mockStatus,
  json: mockJson,
});

describe("SelectedTutorController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to prevent cross-contamination
  });

  test("getSelectedTutorsByLecturer - returns selected tutors", async () => {
    // Step 1: Mock Express request with lecturerId param
    const req = { params: { lecturerId: "1" } } as unknown as Request;
    const res = mockResponse() as unknown as Response;

    // Step 2: Mock the database call to return a dummy selected tutor entry
    const mockFindOne = jest.fn().mockResolvedValue({
      id: 1,
      lecturerId: 1,
      tutors: [{ id: 101, name: "Tutor A" }],
    });

    // Step 3: Inject mocked repository into controller
    (AppDataSource.getRepository as jest.Mock).mockReturnValueOnce({
      findOne: mockFindOne,
    });

    // Step 4: Call the controller function
    await getSelectedTutorsByLecturer(req, res);

    // Step 5: Assertions – check that the database and response handlers were called correctly
    expect(mockFindOne).toHaveBeenCalledWith({
      where: { lecturerId: 1 },
      relations: ["tutors", "tutors.profile"],
    });
    expect(mockJson).toHaveBeenCalledWith({
      id: 1,
      lecturerId: 1,
      tutors: [{ id: 101, name: "Tutor A" }],
    });
  });

  test("createSelectedTutors - saves new entry", async () => {
    // Step 1: Mock request body with lecturer ID and tutor IDs
    const req = {
      body: { lecturerId: 1, tutorIds: [101, 102] },
    } as Request;
    const res = mockResponse() as unknown as Response;

    // Step 2: Mock UserRepo findByIds to return dummy tutor entities
    const mockFindByIds = jest.fn().mockResolvedValue([
      { id: 101 },
      { id: 102 },
    ]);

    // Step 3: Mock SelectedTutorRepo's create and save functions
    const mockCreate = jest.fn().mockReturnValue({
      lecturerId: 1,
      tutors: [{ id: 101 }, { id: 102 }],
    });
    const mockSave = jest.fn();

    // Step 4: Inject mocked repositories into controller (order matters)
    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce({ findByIds: mockFindByIds }) // for userRepo
      .mockReturnValueOnce({ create: mockCreate, save: mockSave }); // for selectedTutorRepo

    // Step 5: Call the controller function
    await createSelectedTutors(req, res);

    // Step 6: Assertions
    expect(mockSave).toHaveBeenCalledWith({
      lecturerId: 1,
      tutors: [{ id: 101 }, { id: 102 }],
    });
    expect(mockStatus).toHaveBeenCalledWith(201);
  });

  test("getUniqueTutors - returns tutors filtered by lecturer", async () => {
    // Step 1: Mock request param with lecturerId
    const req = { params: { lecturerId: "2" } } as unknown as Request;
    const res = mockResponse() as unknown as Response;

    // Step 2: Mock selectedCoursesRepo to return courses with various lecturers
    const mockFindCourses = jest.fn().mockResolvedValue([
      {
        user: { id: 1, role: "candidate" },
        courses: [{ lecturer: { id: 2 } }],
      },
      {
        user: { id: 2, role: "candidate" },
        courses: [{ lecturer: { id: 3 } }], // This one should be ignored
      },
    ]);

    // Step 3: Mock userRepo to return tutors with profile data
    const mockFindTutors = jest.fn().mockResolvedValue([
      { id: 1, profile: { about: "Hello" } },
    ]);

    // Step 4: Inject mocked repositories in the order they are called
    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce({ find: mockFindCourses }) // for SelectedCourses
      .mockReturnValueOnce({ find: mockFindTutors }); // for Users

    // Step 5: Call the controller function
    await getUniqueTutors(req, res);

    // Step 6: Assertions
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith([
      { id: 1, profile: { about: "Hello" } },
    ]);
  });
});
