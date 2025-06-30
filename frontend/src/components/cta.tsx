const Cta = () => {
  return (
    <section className="bg-gray-200 relative py-32 lg:py-36 pt-20">
      <div className="container px-10 mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">

      <div className="w-full lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="TeachTeam Tutors"
            className="w-full rounded-lg shadow-xl"
          />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-right max-w-2xl">
          <h1 className="text-heading-1 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold">
            Ready to find your <span className="text-secondary">Tutor</span>?
          </h1>

          {/* Buttons */}
          <div className="mt-6 flex justify-end sm:flex-row gap-4">
            <a
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-prime hover:text-gray-100 transition-transform transform hover:scale-105"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="bg-secondary text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-gray transition-transform transform hover:scale-105"
            >
              Browse Tutors
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
