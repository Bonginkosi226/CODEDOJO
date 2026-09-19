import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, CheckCircle2, UserX, Clock, Info } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import AdminNav from "../../components/admin/AdminNav";
import { timeAgo } from "../../components/admin/adminFormat";

const DOT = { mission: "bg-amber-400", practice: "bg-violet-400", quiz: "bg-emerald-400" };

const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getOverview();
        setData(res.data);
      } catch (err) {
        toast.error(err?.error || "Failed to load the overview.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <div className="text-center p-8">Could not load the overview.</div>;

  const stats = [
    { label: "Active (7 days)", value: data.activeStudents, icon: UserCheck, gradient: "from-emerald-400 to-teal-500", accent: "text-emerald-500" },
    { label: "Total Students", value: data.totalStudents, icon: Users, gradient: "from-blue-400 to-sky-500", accent: "text-blue-500" },
    { label: "Missions Passed (7 days)", value: data.missionsPassedLast7Days, icon: CheckCircle2, gradient: "from-purple-400 to-fuchsia-500", accent: "text-purple-500" },
    { label: "Inactive 7+ Days", value: data.inactiveStudents, icon: UserX, gradient: "from-amber-400 to-orange-500", accent: "text-amber-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Teacher Dashboard" subtitle="See how your students are doing in CodeDojo" />
      <AdminNav />

      <div className="mb-8 p-4 bg-sky-50 border-2 border-sky-100 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-sky-800">
          This shows activity in CodeDojo only, not overall module understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-4 border-slate-200 rounded-[2rem] p-6 shadow-[0_6px_0_theme(colors.slate.200)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={`text-4xl font-black ${stat.accent} tracking-tight mb-1`}>{stat.value}</span>
                <span className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white border-2 border-white/20 shadow-[0_4px_0_rgba(0,0,0,0.1)]`}>
                <stat.icon size={32} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_8px_0_theme(colors.slate.200)] p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-[1rem] bg-amber-100 flex items-center justify-center border-2 border-amber-200 shadow-sm">
            <Clock className="w-6 h-6 text-amber-500" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
        </div>

        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No student activity yet.</p>
        ) : (
          <div className="space-y-3">
            {data.recentActivity.map((item, index) => (
              <Link
                key={`${item.studentId}-${item.at}-${index}`}
                to={`/admin/students/${item.studentId}`}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${DOT[item.type] || "bg-slate-400"}`} />
                  <p className="text-[15px] font-bold text-slate-800 truncate">
                    {item.username}
                    <span className="text-slate-500 font-semibold"> — {item.description}</span>
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">{timeAgo(item.at)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
