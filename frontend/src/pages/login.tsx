import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Strong password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      isValid = false;
    }

    if (!isValid) return;

    try {
      const success = await login(email, password);

      if (success) {
        toast.success("Successfully Logged In!");
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <strong>Already Signed In!!</strong>
        </>
      ) : (
        <>
          <Head>
            <title>Login - TeachTeam</title>
            <meta name="description" content="Login to TeachTeam" />
          </Head>

          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
              <h1 className="text-3xl font-bold mb-6 text-center text-black">
                Login
              </h1>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center font-medium">
                  {error === "Account has been blocked"
                    ? "Your account has been blocked. Please contact support."
                    : error}
                </div>
              )}
              {emailError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {emailError}
                </div>
              )}
              {passwordError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-black text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-black text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-border rounded-lg w-full py-2 px-3 text-black bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-primary hover:underline font-semibold"
                    >
                      Register here
                    </a>
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg w-full transition"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
