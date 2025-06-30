import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const router = useRouter();

  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedEmail ||
      !trimmedPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(trimmedPassword)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(trimmedFirstName) || !nameRegex.test(trimmedLastName)) {
      setError("Names should only contain letters.");
      return;
    }

    try {
      const success = await register({
        email: trimmedEmail,
        password: trimmedPassword,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        role,
      } as any);

      if (success) {
        toast.success("Registered successfully!");
        router.push("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed.");
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <>
      <Head>
        <title>Register - TeachTeam</title>
        <meta name="description" content="Register for TeachTeam" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Register
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-black">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background"
                required
              >
                <option value="candidate">Candidate</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Tutor">Tutor</option>
              </select>
            </div>
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Login
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg w-full transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
