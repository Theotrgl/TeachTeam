import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useState } from "react";

export function NavBar() {
  const { logout, isLoggedIn, profile, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div className="w-full z-50 h-20 bg-background sticky top-0 shadow-md">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <a
              className="font-semibold text-xl transition-all transform hover:scale-110 duration-300"
              href="/"
            >
              Teach<span className="text-primary">Team</span>
            </a>

            <div
              className="md:hidden items-center cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {/* Hamburger to X Animation */}
              <div
                className={`w-6 h-0.5 bg-black mb-1 transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-black mb-1 transition-opacity duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-black transition-transform duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></div>
            </div>

            {isLoggedIn ? (
              <ul className="hidden md:flex gap-x-6 text-black">
                {user?.role === "Lecturer" && (
                  <li className="p-3 transition-transform transform hover:scale-115">
                    <a href="/tutors">Tutors</a>
                  </li>
                )}
                {user?.role === "candidate" && (
                  <li className="p-3 transition-transform transform hover:scale-115">
                    <a href="/course-select">Courses</a>
                  </li>
                )}
                <a href="/profile">
                  <img
                    src={profile?.pictureURI}
                    alt="profile"
                    className="w-12 h-12 bg-black-300 rounded-full transition-transform transform hover:scale-115"
                  />
                </a>
                <li className="p-3 bg-primary hover:bg-prime transition-transform transform hover:scale-115 rounded-full text-white">
                  <button onClick={() => handleLogout()}>Sign Out</button>
                </li>
              </ul>
            ) : (
              <ul className="hidden md:flex gap-x-6 text-black">
                <li className="p-3 transition-transform transform hover:scale-115">
                  <a className="hover:text-gray " href="/login">
                    Sign In
                  </a>
                </li>
                <li className="p-3 bg-primary hover:bg-prime transition-transform transform hover:scale-115 rounded-full text-white">
                  <a href="/register">Sign Up</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Expands from the navbar) */}
      <div
        className={`fixed inset-x-0 top-20 z-50 bg-background transition-all duration-500 shadow-md border-b border-border ${
          isMobileMenuOpen ? "h-42" : "h-0 overflow-hidden"
        }`}
      >
        <div
          className={`flex gap-5 items-center justify-center space-y-6 py-6 transition-all duration-500 transform z-40${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[-20vh]"
          }`}
        >
          {isLoggedIn ? (
            <>
              {user?.role === "Lecturer" && (
                <a
                  href="/tutors"
                  className="text-black hover:text-gray transition-transform transform hover:scale-110 mt-6"
                >
                  Tutors
                </a>
              )}
              {user?.role === "candidate" && (
                <a
                  href="/course-select"
                  className="text-black hover:text-gray transition-transform transform hover:scale-110 mt-6"
                >
                  Courses
                </a>
              )}
              <a href="/profile">
                <img
                  src={profile?.pictureURI}
                  alt="profile"
                  className="w-12 h-12 bg-black-300 rounded-full mt-6"
                />
              </a>
              <button
                onClick={handleLogout}
                className="bg-primary hover:bg-prime p-3 rounded-full text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="p-3 text-black hover:text-gray transition-transform transform hover:scale-115 mt-6"
              >
                Sign In
              </a>
              <a
                href="/"
                className="bg-primary hover:bg-prime p-3 rounded-full text-white"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
