import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { SelectedCourses } from "../entity/selectedCourses";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private profileRepository = AppDataSource.getRepository(Profile);
  private selectedCoursesRepository =
    AppDataSource.getRepository(SelectedCourses);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const users = await this.userRepository.find();

    return response.json(users);
  }

  /**
   * Retrieves a single user by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.json(user);
  }

  /**
   * Creates a new user in the database
   * @param request - Express request object containing user details in body
   * @param response - Express response object
   * @returns JSON response containing the created user or error message
   */
  async save(request: Request, response: Response) {
    const { email, password, firstName, lastName, role } = request.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return response.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      return response.status(400).json({ message: "User already exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({ message: "Invalid email format" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return response.status(400).json({
        message: "Password must be at least 8 characters long and strong",
      });
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return response
        .status(400)
        .json({ message: "Names must contain only letters" });
    }

    const validRoles = ["candidate", "tutor", "lecturer"];
    if (!validRoles.includes(role)) {
      return response.status(400).json({ message: "Invalid role selected" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const profile = this.profileRepository.create({
        about: "",
        pictureURI: "https://mighty.tools/mockmind-api/content/abstract/47.jpg",
        prevRoles: [],
        availability: "",
        skills: [],
        credentials: [],
        agg_selected: 0,
      });

      const savedProfile = await this.profileRepository.save(profile);
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        profile: savedProfile,
      });

      const savedUser = await this.userRepository.save(user);
      const selectedCourses = this.selectedCoursesRepository.create({
        user: savedUser,
        courses: [],
      });
      await this.selectedCoursesRepository.save(selectedCourses);
      return response.status(201).json({
        message: "User registered successfully",
        user: {
          ...savedUser,
          password: undefined,
          profile: savedProfile,
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      return response.status(500).json({
        message: "Registration failed",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  /**
   * Deletes a user from the database by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if user not found
   */
  async remove(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const userToRemove = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToRemove) {
      return response.status(404).json({ message: "User not found" });
    }

    await this.userRepository.remove(userToRemove);
    return response.json({ message: "User removed successfully" });
  }

  /**
   * Updates an existing user's information
   * @param request - Express request object containing user ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated user or error message
   */
  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { firstName, lastName, email, password, role, profileId } =
      request.body;

    let userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    userToUpdate = Object.assign(userToUpdate, {
      firstName,
      lastName,
      email,
      password,
      role,
      profileId,
    });

    try {
      const updatedUser = await this.userRepository.save(userToUpdate);
      return response.json(updatedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating user", error });
    }
  }

  /**
   * Logs in a user by verifying email and password (plain text comparison)
   * @param request - Express request object containing email and password in body
   * @param response - Express response object
   * @returns JSON response with user data or error message
   */
  async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response
          .status(400)
          .json({ message: "Email and password are required." });
      }

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["profile"],
      });

      if (!user) {
        return response
          .status(401)
          .json({ message: "Invalid email or password" });
      }

      // ✅ Check if the account is blocked
      if (user.isBlocked) {
        return response.status(403).json({
          message: "Account has been blocked",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response
          .status(401)
          .json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      const { password: _removed, ...userWithoutPassword } = user;

      return response.status(200).json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Login error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async currentUser(request: Request, response: Response) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return response.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
      if (!token) {
        return response.status(401).json({ message: "Invalid token format" });
      }

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      ) as { userId: number };

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
        relations: ["profile"],
      });

      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }

      // Exclude password
      const { password: _removed, ...userWithoutPassword } = user;

      return response.json(userWithoutPassword);
    } catch (err) {
      return response.status(401).json({ message: "Invalid or expired token" });
    }
  }
}
