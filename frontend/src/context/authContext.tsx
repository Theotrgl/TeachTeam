import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { userApi, User, profileApi, Profile } from "@/services/api";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  users: User[];
  profiles: Profile[];
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedProfile: Profile) => void;
  register: (newUser: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) return; // Wait until token is available
        if (token) {
          // NOTE: no userApi.setToken here per your request

          // Fetch current user assuming token is valid
          const currentUser = await userApi.getCurrentUser();

          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);

            if (currentUser.profile != null) {
              const userProfile = await profileApi.getProfileById(
                currentUser.profile.id
              );
              setProfile(userProfile || null);
              // console.log(userProfile);
            }
          }
        }

        // Fetch all users and profiles regardless of login state (optional)
        const allUsers = await userApi.getAllUsers();
        const allProfiles = await profileApi.getAllProfiles();

        setUsers(allUsers);
        setProfiles(allProfiles);
      } catch (err: any) {
        setUser(null);
        setProfile(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token"); // Clear invalid token

        if (err.response) {
          const status = err.response.status;

          if (status === 401 || status === 403) {
            console.warn("Token is invalid or expired. Logging out...");

            // Clear token and reset auth state
            localStorage.removeItem("token");
            setUser(null);
            setIsLoggedIn(false);
            setProfile(null);

            // Optional: redirect to login page
            window.location.href = "/login";
          } else {
            console.error("Unexpected error fetching user:", err.response.data);
          }
        } else {
          console.error("Network or unknown error occurred:", err);
        }
      } finally {
        setIsInitialized(true);
      }
    }

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await userApi.loginUser(email, password);
      const { token, user } = response;

      // Store token in localStorage temporarily
      localStorage.setItem("token", token);

      setUser(user);
      setIsLoggedIn(true);

      if (user?.profile != null) {
        const userProfile = await profileApi.getProfileById(user.profile.id);
        setProfile(userProfile || null);
      }

      return true;
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      throw err
      return false;
    }
  };

  const register = async (newUser: Partial<User>): Promise<boolean> => {
    try {
      const createdUser = await userApi.createUser(newUser);

      setUser(createdUser);
      // setIsLoggedIn(true);

      // const userProfile = await profileApi.getProfileById(createdUser.profile.id);
      // setProfile(userProfile || null);

      // Optionally update full user list
      setUsers((prev) => [...prev, createdUser]);

      return true;
    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    // no userApi.clearToken() call here either
  };

  const updateProfile = async (updatedProfile: Profile) => {
    try {
      // Send update to backend
      const savedProfile = await profileApi.updateProfile(
        updatedProfile.id,
        updatedProfile
      );

      // Update current profile state if it matches
      if (profile?.id === savedProfile.id) {
        setProfile(savedProfile);
      }

      // Update profiles list
      setProfiles((prev) =>
        prev.map((p) => (p.id === savedProfile.id ? savedProfile : p))
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      users,
      profiles,
      isLoggedIn,
      login,
      logout,
      updateProfile,
      register,
    }),
    [user, profile, users, profiles, isLoggedIn]
  );

  if (!isInitialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
