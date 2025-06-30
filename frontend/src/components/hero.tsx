import { useAuth } from "@/context/authContext";

const Hero = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="relative py-32 lg:py-36 pt-20">
      <div className="container px-10 mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="text-center lg:text-left max-w-2xl">
          {isLoggedIn ? (
            <h1 className="text-heading-1 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-2">
              Welcome <span className="text-secondary">{user?.firstName}</span>{" "}
            </h1>
          ) : (
            <></>
          )}
          <h1 className="text-heading-1 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold">
            Simplifying <span className="text-secondary">Tutor</span> Selection
          </h1>
          <p className="mt-4 text-lg text-black">
            Finding the right tutor shouldn't be complicated. <br />
            <span className="font-bold">
              Teach<span className="text-primary">Team</span>
            </span>{" "}
            streamlines the selection and hiring of casual tutors.
          </p>

          {/* Buttons */}
          {isLoggedIn ? (
            <></>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="/"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-prime hover:text-gray-100 transition-transform transform hover:scale-105"
              >
                Apply as a Tutor
              </a>
              <a
                href="/login"
                className="bg-secondary text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-gray transition-transform transform hover:scale-105"
              >
                Sign in as Lecturer
              </a>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="TeachTeam Tutors"
            className="w-full rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
