import withAuth from "@/lib/withAuth";
import { gql, useQuery } from "@apollo/client";

const GET_CANDIDATE_DATA = gql`
  query GetCandidateData {
    candidatesPerCourse {
      id
      title
      candidates {
        id
        firstName
        lastName
      }
    }

    candidatesWithMoreThan3Courses {
      id
      firstName
      lastName
      role
    }

    candidatesWithNoCourses {
      id
      firstName
      lastName
      role
    }
  }
`;

function CandidatesPage() {
  const { data, loading, error } = useQuery(GET_CANDIDATE_DATA);

  if (loading) return <p className="text-[var(--gray)]">Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-8 min-h-screen space-y-10 text-[var(--black)]">
      {/* Section: Candidates per Course */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Candidates Per Course</h2>
        {data.candidatesPerCourse.map((course: any) => (
          <div
            key={course.id}
            className="bg-white p-4 rounded-lg shadow border border-[var(--border)] mb-6"
          >
            <h3 className="text-lg font-semibold text-gray mb-2">
              {course.title}
            </h3>
            {course.candidates.length > 0 ? (
              <ul className="ml-4 list-disc text-[var(--black)]">
                {course.candidates.map((candidate: any) => (
                  <li key={candidate.id}>
                    {candidate.firstName} {candidate.lastName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ml-4 text-[var(--gray)] italic">No candidates</p>
            )}
          </div>
        ))}
      </section>

      {/* Section: Candidates with More Than 3 Courses */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Candidates Selected for More Than 3 Courses
        </h2>
        <ul className="bg-white p-4 rounded-lg shadow border border-[var(--border)] space-y-1">
          {data.candidatesWithMoreThan3Courses
            .filter((user: any) => user.role === "candidate")
            .map((user: any) => (
              <li key={user.id} className="text-[var(--black)]">
                {user.firstName} {user.lastName}
              </li>
            ))}
          {data.candidatesWithMoreThan3Courses.filter(
            (u: any) => u.role === "candidate"
          ).length === 0 && <p className="italic text-[var(--gray)]">None</p>}
        </ul>
      </section>

      {/* Section: Candidates with No Courses */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Candidates Selected for No Courses
        </h2>
        <ul className="bg-white p-4 rounded-lg shadow border border-[var(--border)] space-y-1">
          {data.candidatesWithNoCourses
            .filter((user: any) => user.role === "candidate")
            .map((user: any) => (
              <li key={user.id} className="text-[var(--black)]">
                {user.firstName} {user.lastName}
              </li>
            ))}
          {data.candidatesWithNoCourses.filter(
            (u: any) => u.role === "candidate"
          ).length === 0 && <p className="italic text-[var(--gray)]">None</p>}
        </ul>
      </section>
    </div>
  );
}

export default withAuth(CandidatesPage);
