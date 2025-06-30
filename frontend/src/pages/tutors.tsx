import Layout from "@/components/layout";
import TutorDragNDrop from "@/components/tutorDragNDrop";
import TutorRanking from "@/components/tutorRanking";
import TutorSelect from "@/components/tutorSelect";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

export default function Tutors() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("select");

  if (user?.role !== "Lecturer") {
    return (
      <Layout>
        <div className="h-[calc(100vh-20vh)] flex flex-col items-center justify-center">
          <strong className="font-bold text-3xl">403</strong>
          <strong className="font-bold text-3xl">Access Restricted</strong>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Wrapper: Column on mobile, Row on larger screens */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar with Tabs */}
          <div className="flex lg:flex-col flex-row overflow-x-auto gap-4 lg:gap-4 w-full lg:w-1/6">
            <button
              className={`py-2 px-4 text-base whitespace-nowrap rounded-full transition-all duration-200 ${
                activeTab === "select"
                  ? "border-primary bg-primary text-white"
                  : "text-gray-600 border border-gray-300"
              } hover:bg-primary hover:text-white`}
              onClick={() => setActiveTab("select")}
            >
              Tutor Select
            </button>
            <button
              className={`py-2 px-4 text-base whitespace-nowrap rounded-full transition-all duration-200 ${
                activeTab === "ranking"
                  ? "border-primary bg-primary text-white"
                  : "text-gray-600 border border-gray-300"
              } hover:bg-primary hover:text-white`}
              onClick={() => setActiveTab("ranking")}
            >
              Tutor Ranking
            </button>
                        <button
              className={`py-2 px-4 text-base whitespace-nowrap rounded-full transition-all duration-200 ${
                activeTab === "selected"
                  ? "border-primary bg-primary text-white"
                  : "text-gray-600 border border-gray-300"
              } hover:bg-primary hover:text-white`}
              onClick={() => setActiveTab("selected")}
            >
              Selected Tutors
            </button>
          </div>

          {/* Right Content Area */}
          <div className="w-full">
            <div className="mt-4 lg:mt-0">
              {activeTab === "select" && <TutorSelect />}
              {activeTab === "ranking" && <TutorDragNDrop />}
              {activeTab === "selected" && <TutorRanking />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
