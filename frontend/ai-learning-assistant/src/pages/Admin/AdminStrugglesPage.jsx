import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import AdminNav from "../../components/admin/AdminNav";
import { languageLabel } from "../../components/admin/adminFormat";

const barColor = (rate) => (rate < 0.5 ? "from-rose-400 to-orange-400" : rate < 0.8 ? "from-amber-300 to-amber-400" : "from-emerald-300 to-emerald-400");

const AdminStrugglesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getStruggles();
        setItems(res.data || []);
      } catch (err) {
        toast.error(err?.error || "Failed to load struggle data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Struggles"
        subtitle="Missions and practice problems ranked by lowest pass rate, then most failed attempts"
      />
      <AdminNav />

      {items.length === 0 ? (
        <div className="bg-white border-4 border-slate-200 rounded-[2rem] p-10 text-center text-sm text-slate-500">
          No attempts recorded yet — struggle data appears once students start submitting code.
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item) => {
            const percent = Math.round(item.passRate * 100);
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_6px_0_theme(colors.slate.200)] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.type === "mission" ? "bg-amber-100 text-amber-600" : "bg-violet-100 text-violet-600"}`}>
                      {item.type === "mission" ? <Target size={20} /> : <Dumbbell size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 leading-tight">{item.title}</h3>
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                        {item.type === "mission" ? "Mission" : `Practice · ${item.lessonTitle}`}
                        {languageLabel(item.language) ? ` · ${languageLabel(item.language)}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-2xl font-black text-slate-800">{item.avgFailedAttempts.toFixed(1)}</p>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Avg failed attempts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800">{item.completed}/{item.attempted}</p>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Passed / tried</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest mb-1">
                    <span className="text-slate-400">Pass rate</span>
                    <span className={percent < 50 ? "text-rose-500" : "text-slate-600"}>{percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className={`h-full bg-gradient-to-r ${barColor(item.passRate)}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                    Currently stuck ({item.stuckStudents.length})
                  </p>
                  {item.stuckStudents.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">Nobody is stuck on this right now.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {item.stuckStudents.map((s) => (
                        <Link
                          key={s.id}
                          to={`/admin/students/${s.id}`}
                          className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border-2 border-rose-100 rounded-full text-sm font-bold text-rose-700 transition-colors"
                        >
                          {s.username}
                          <span className="px-2 py-0.5 bg-white rounded-full text-[11px] font-black text-rose-500">
                            {s.attempts} attempt{s.attempts === 1 ? "" : "s"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminStrugglesPage;
