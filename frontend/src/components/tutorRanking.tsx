import { useAuth } from "@/context/authContext";
import { useTutor } from "@/context/tutorContext";
import { JSX, useMemo } from "react";

export default function TutorRanking(): JSX.Element {
  const { tutors } = useTutor();
  const { profiles } = useAuth();

  const rankedTutors = useMemo(() => {
    const enriched = [...tutors].map((tutor) => {
      const profile = tutor.profile;
      return {
        ...tutor,
        aggSelected: profile?.agg_selected || 0,
      };
    });

    return enriched.sort((a, b) => b.aggSelected - a.aggSelected);
  }, [tutors, profiles]);

  const maxSelected = rankedTutors[0]?.aggSelected ?? 0;
  const minSelected = rankedTutors[rankedTutors.length - 1]?.aggSelected ?? 0;

  const mostSelectedTutors = rankedTutors.filter(
    (tutor) => tutor.aggSelected === maxSelected
  );
  const leastSelectedTutors = rankedTutors.filter(
    (tutor) => tutor.aggSelected === minSelected
  );

  return (
    <div className="space-y-8">
      {/* Section 1: Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Selected Tutors</h2>
        <p className="text-gray-600">Visual breakdown of tutor selections</p>
      </div>

      {/* Section 2: Ranking Table with color indicators */}
      <div className="overflow-x-auto rounded-2xl shadow bg-white">
        <table className="min-w-full table-fixed">
          <thead className="bg-primary text-white sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-sm">#</th>
              <th className="px-4 py-3 text-left text-sm">Tutor</th>
              <th className="px-4 py-3 text-left text-sm">Selections</th>
            </tr>
          </thead>
          <tbody>
            {rankedTutors.map((tutor, index) => {
              const percent =
                maxSelected > 0 ? (tutor.aggSelected / maxSelected) * 100 : 0;
              const bgColor =
                tutor.aggSelected === maxSelected
                  ? "bg-green-400"
                  : tutor.aggSelected === minSelected
                  ? "bg-red-400"
                  : "bg-blue-400";

              return (
                <tr
                  key={tutor.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {tutor.firstName} {tutor.lastName}
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 ${bgColor} rounded-full`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <span className="whitespace-nowrap font-mono tabular-nums">
                      {tutor.aggSelected}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section 3: Summary */}
      <div className="bg-white p-4 rounded-2xl shadow text-gray-700 text-sm space-y-2">
        <p>
          <strong>Most selected tutor(s):</strong>{" "}
          {mostSelectedTutors
            .map((t) => `${t.firstName} ${t.lastName}`)
            .join(", ")}{" "}
          ({maxSelected} selection{maxSelected !== 1 ? "s" : ""})
        </p>
        <p>
          <strong>Least selected tutor(s):</strong>{" "}
          {leastSelectedTutors
            .map((t) => `${t.firstName} ${t.lastName}`)
            .join(", ")}{" "}
          ({minSelected} selection{minSelected !== 1 ? "s" : ""})
        </p>
      </div>
    </div>
  );
}
