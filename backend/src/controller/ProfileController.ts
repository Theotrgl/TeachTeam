import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Profile } from "../entity/Profile";

export class ProfileController {
  private profileRepository = AppDataSource.getRepository(Profile);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const profiles = await this.profileRepository.find();

    return response.json(profiles);
  }

  /**
   * Retrieves a single user by their ID
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const profile = await this.profileRepository.findOne({
      where: { id },
    });

    if (!profile) {
      return response.status(404).json({ message: "Profile not found" });
    }
    return response.json(profile);
  }

  /**
   * Creates a new user in the database
   * @param request - Express request object containing user details in body
   * @param response - Express response object
   * @returns JSON response containing the created user or error message
   */
  async save(request: Request, response: Response) {
    const { about, pictureURI, prevRoles, availability, credentials, skills } =
      request.body;

    const profile = Object.assign(new Profile(), {
      about,
      pictureURI,
      prevRoles,
      availability,
      credentials,
      skills,
    });

    try {
      const savedProfile = await this.profileRepository.save(profile);
      return response.status(201).json(savedProfile);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating user", error });
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
    const profileToRemove = await this.profileRepository.findOne({
      where: { id },
    });

    if (!profileToRemove) {
      return response.status(404).json({ message: "Profile not found" });
    }

    await this.profileRepository.remove(profileToRemove);
    return response.json({ message: "Profile removed successfully" });
  }

  /**
   * Updates an existing user's information
   * @param request - Express request object containing user ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated user or error message
   */
  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { about, pictureURI, prevRoles, availability, credentials, skills, agg_selected } =
      request.body;

    let profileToUpdate = await this.profileRepository.findOne({
      where: { id },
    });

    if (!profileToUpdate) {
      return response.status(404).json({ message: "Profile not found" });
    }

    profileToUpdate = Object.assign(profileToUpdate, {
      about,
      pictureURI,
      prevRoles,
      availability,
      credentials,
      skills,
      agg_selected
    });

    try {
      const updatedProfile = await this.profileRepository.save(profileToUpdate);
      return response.json(updatedProfile);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating profile", error });
    }
  }
}
