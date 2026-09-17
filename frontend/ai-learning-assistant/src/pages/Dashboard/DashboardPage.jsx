import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Data_getDashboardData", data);

        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
      <div className="text-center ">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-600 text-sm">No dashboard data available.</p>
      </div>
    </div>
  );
}


        const stats = [
  {
    label: "Documents",
    value: dashboardData.overview.totalDocuments,
    icon: FileText,
    gradient: "from-blue-400 to-sky-500",
    shadowColor: "shadow-blue-500/25",
    accent: "text-blue-500"
  },
  {
    label: "Flashcards",
    value: dashboardData.overview.totalFlashcards,
    icon: BookOpen,
    gradient: "from-purple-400 to-fuchsia-500",
    shadowColor: "shadow-purple-500/25",
    accent: "text-purple-500"
  },
  {
    label: "Quizzes",
    value: dashboardData.overview.totalQuizzes,
    icon: BrainCircuit,
    gradient: "from-emerald-400 to-teal-500",
    shadowColor: "shadow-emerald-500/25",
    accent: "text-emerald-500"
  },
];

  return (
    <div className="min-h-screen">
  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

  <div className="relative max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
        Dashboard
      </h1>
      <p className="text-slate-500 text-sm">
        Track your learning progress and activity
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-white border-4 border-slate-200 rounded-[2rem] p-6 shadow-[0_6px_0_theme(colors.slate.200)] hover:shadow-[0_2px_0_theme(colors.slate.200)] hover:translate-y-[4px] transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className={`text-4xl font-black ${stat.accent} tracking-tight mb-1`}>
                {stat.value}
              </span>
              <span className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <div
              className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white border-2 border-white/20 shadow-[0_4px_0_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon size={32} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Activity Section */}
    <div className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_8px_0_theme(colors.slate.200)] p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-[1rem] bg-amber-100 flex items-center justify-center border-2 border-amber-200 shadow-sm">
          <Clock className="w-6 h-6 text-amber-500" strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          Recent Adventures
        </h3>
      </div>

      {dashboardData?.recentActivity &&
      (dashboardData.recentActivity.documents?.length > 0 ||
        dashboardData.recentActivity.quizzes?.length > 0 ||
        dashboardData.recentActivity.lessons?.length > 0) ? (
        <div className="space-y-3">
          {[
            ...(dashboardData.recentActivity.documents || []).map((doc) => ({
              id: doc._id,
              description: doc.title,
              timestamp: doc.lastAccessed,
              link: `/documents/${doc._id}`,
              type: "document",
            })),
            ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
              id: quiz._id,
              description: quiz.title,
              timestamp: quiz.lastAttempted,
              link: `/quizzes/${quiz._id}`,
              type: "quiz",
            })),
            ...(dashboardData.recentActivity.lessons || []).map((lesson) => ({
              id: lesson.id,
              description: `${lesson.title} (${lesson.language === "python" ? "Python" : "Java"})`,
              timestamp: lesson.completedAt,
              link: `/arcade`,
              type: "lesson",
            })),
          ]
            .sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            )
            .map((activity, index) => (
              <div
                key={activity.id || index}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div
                      className={`w-3 h-3 rounded-full shadow-[0_2px_0_rgba(0,0,0,0.1)] ${
                        activity.type === "document"
                          ? "bg-sky-400"
                          : activity.type === "lesson"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                    />
                    <p className="text-[15px] font-bold text-slate-800 truncate">
                      {activity.type === "document"
                        ? "Studied Scroll: "
                        : activity.type === "lesson"
                        ? "Completed Mission: "
                        : "Attempted Challenge: "}
                      <span className="text-slate-500 font-semibold">
                        {activity.description}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs font-bold text-slate-400 pl-6 uppercase tracking-wider">
                    {new Date(activity.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                {activity.link && (
                  <a
                    href={activity.link}
                    className="ml-4 px-5 py-2.5 text-sm font-black text-white bg-slate-800 hover:bg-slate-700 active:translate-y-[2px] rounded-xl shadow-[0_4px_0_theme(colors.slate.900)] active:shadow-none transition-all duration-150 whitespace-nowrap"
                  >
                    GO
                  </a>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600">
            No recent activity yet.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Start learning to see your progress here
          </p>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default DashboardPage;
