// UserController.test.ts
import { UserController } from "../controller/UserController";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";

// Mock bcrypt hash and compare methods
jest.mock("bcrypt", () => ({
  hash: jest.fn(() => Promise.resolve("hashedPassword")),
  compare: jest.fn(() => Promise.resolve(true)),
}));

// Define individual repository method mocks
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockRemove = jest.fn();

// Mock AppDataSource to return the above methods
jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      find: mockFind,
      findOne: mockFindOne,
      create: mockCreate,
      save: mockSave,
      remove: mockRemove,
    })),
  },
}));

// Helper to mock Express response object
const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test("save - successfully registers a user", async () => {
  const controller = new UserController();

  // Step 1: Mock incoming request body with valid registration data
  const req: Partial<Request> = {
    body: {
      email: "test@example.com",
      password: "StrongPass1!",
      firstName: "John",
      lastName: "Doe",
      role: "tutor",
    },
  };

  const res = createMockResponse();

  // Step 2: Simulate no existing user found
  mockFindOne.mockResolvedValueOnce(null);

  // Step 3: Mock create and save behavior of repository
  mockCreate.mockImplementation((x) => x);
  mockSave.mockImplementation((x) => x);

  // Step 4: Invoke controller method
  await controller.save(req as Request, res as Response);

  // Step 5: Assert correct response and data returned
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "User registered successfully",
      user: expect.any(Object),
    })
  );
});

test("save - fails due to invalid email format", async () => {
  const controller = new UserController();

  // Step 1: Simulate request with invalid email
  const req: Partial<Request> = {
    body: {
      email: "invalidemail", // invalid
      password: "StrongPass1!",
      firstName: "Jane",
      lastName: "Doe",
      role: "candidate",
    },
  };

  const res = createMockResponse();

  // Step 2: Ensure no existing user blocks the logic
  mockFindOne.mockResolvedValueOnce(null);

  // Step 3: Run save and assert bad request due to email format
  await controller.save(req as Request, res as Response);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "Invalid email format",
  });
});

test("one - returns user by ID", async () => {
  const controller = new UserController();

  // Step 1: Setup mock user and request with a valid ID
  const mockUser = { id: 1, email: "user@example.com" };
  const req: Partial<Request> = {
    params: { id: "1" },
  };
  const res = createMockResponse();

  // Step 2: Simulate repo returning the user
  mockFindOne.mockResolvedValueOnce(mockUser);

  // Step 3: Invoke controller method
  await controller.one(req as Request, res as Response);

  // Step 4: Assert findOne called with correct parameters and result returned
  expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
  expect(res.json).toHaveBeenCalledWith(mockUser);
});
