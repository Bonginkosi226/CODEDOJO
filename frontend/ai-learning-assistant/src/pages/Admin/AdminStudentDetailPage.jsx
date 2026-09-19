import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Zap, Flame, Clock, AlertTriangle, Target, Dumbbell, FileText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import Spinner from "../../components/common/Spinner";
import AdminNav from "../../components/admin/AdminNav";
import { formatDate, formatDateTime, timeAgo, languageLabel } from "../../components/admin/adminFormat";

const Panel = ({ title, icon: Icon, children }) => (
  <div className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_6px_0_theme(colors.slate.200)] p-6">
    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-700 mb-4">
      {Icon && <Icon size={18} className="text-slate-400" />}
      {title}
    </h3>
    {children}
  </div>
);

const ProgressBar = ({ done, total, color }) => (
  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
    <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
  </div>
);

const AdminStudentDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminService.getStudent(id);
        setData(res.data);
      } catch (err) {
        toast.error(err?.error || "Failed to load this student.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Spinner />;

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto">
        <AdminNav />
        <div className="bg-white border-4 border-slate-200 rounded-[2rem] p-10 text-center">
          <p className="text-slate-600 font-semibold mb-4">Student not found.</p>
          <Link to="/admin/students" className="text-sky-600 font-bold hover:underline">Back to students</Link>
        </div>
      </div>
    );
  }

  const { student, progress, stuck, completedMissions, completedPractice, quizzes, documents } = data;

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/admin/students" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft size={16} /> Back to students
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight">{student.username}</h1>
          <p className="text-slate-500 text-sm">{student.email} · Joined {formatDate(student.joinedAt)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 rounded-2xl text-sm font-black"><Zap size={14} fill="currentColor" /> Level {student.level} · {student.xp} XP</span>
          <span className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-700 rounded-2xl text-sm font-black"><Flame size={14} /> {student.currentStreak}-day streak</span>
          <span className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black"><Clock size={14} /> Active {timeAgo(student.lastActive)}</span>
        </div>
      </div>
      <AdminNav />

      <div className="space-y-6">
        <Panel title="Progress" icon={Target}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["java", "python"].map((language) => {
              const p = progress[language];
              return (
                <div key={language} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-100">
                  <p className="text-lg font-black text-slate-800 mb-4">{languageLabel(language)} track</p>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    <span>Missions</span><span>{p.lessonsCompleted}/{p.lessonsTotal}</span>
                  </div>
                  <ProgressBar done={p.lessonsCompleted} total={p.lessonsTotal} color="from-amber-300 to-amber-400" />
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mt-4 mb-1">
                    <span>Practice</span><span>{p.practiceCompleted}/{p.practiceTotal}</span>
                  </div>
                  <ProgressBar done={p.practiceCompleted} total={p.practiceTotal} color="from-violet-300 to-violet-400" />
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title={`Stuck on (${stuck.length})`} icon={AlertTriangle}>
          {stuck.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Not currently failing anything.</p>
          ) : (
            <div className="space-y-5">
              {stuck.map((item) => (
                <div key={`${item.type}-${item.practiceId || item.lessonId}`} className="p-5 rounded-2xl bg-rose-50/60 border-2 border-rose-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="font-black text-slate-800">{item.title}</p>
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                        {item.type === "mission" ? "Mission" : `Practice · ${item.lessonTitle}`}
                        {languageLabel(item.language) ? ` · ${languageLabel(item.language)}` : ""}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-white border-2 border-rose-100 rounded-full text-sm font-black text-rose-600">
                      {item.attempts} failed attempt{item.attempts === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                    Last submitted code {item.lastAttemptAt ? `· ${formatDateTime(item.lastAttemptAt)}` : ""}
                  </p>
                  <pre className="p-4 bg-slate-900 text-sky-200 text-xs font-mono rounded-2xl overflow-x-auto whitespace-pre-wrap select-text">
                    {item.lastCode || "(no code saved)"}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title={`Missions passed (${completedMissions.length})`} icon={CheckCircle2}>
            {completedMissions.length === 0 ? (
              <p className="text-sm text-slate-400 italic">None yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {completedMissions.map((m) => (
                  <li key={m.lessonId} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-bold text-slate-700">{m.title} <span className="text-slate-400 font-semibold">· {languageLabel(m.language)}</span></span>
                    <span className="text-xs font-bold text-slate-400">{formatDate(m.completedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={`Practice passed (${completedPractice.length})`} icon={Dumbbell}>
            {completedPractice.length === 0 ? (
              <p className="text-sm text-slate-400 italic">None yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {completedPractice.map((p) => (
                  <li key={p.practiceId} className="flex items-center justify-between py-2.5 text-sm gap-3">
                    <span className="font-bold text-slate-700">
                      {p.title}
                      <span className="text-slate-400 font-semibold"> · {p.lessonTitle}{p.failedAttemptsBeforePass > 0 ? ` · ${p.failedAttemptsBeforePass} failed first` : ""}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 shrink-0">{formatDate(p.completedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title={`Quiz scores (${quizzes.length})`} icon={CheckCircle2}>
            {quizzes.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No quizzes yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {quizzes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between py-2.5 text-sm gap-3">
                    <span className="font-bold text-slate-700">
                      {q.title}
                      {q.documentTitle && <span className="text-slate-400 font-semibold"> · {q.documentTitle}</span>}
                    </span>
                    {q.completedAt ? (
                      <span className="font-black text-slate-800 shrink-0">
                        {q.score}/{q.totalQuestions}
                        <span className="text-slate-400 font-semibold"> · {formatDate(q.completedAt)}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 shrink-0">Not taken</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={`Documents uploaded (${documents.length})`} icon={FileText}>
            {documents.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No documents uploaded.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-2.5 text-sm gap-3">
                    <span className="font-bold text-slate-700">{d.title}</span>
                    <span className="text-xs font-bold text-slate-400 shrink-0">{formatDate(d.uploadedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-slate-400 mt-3">Titles only — document contents are private.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDetailPage;
