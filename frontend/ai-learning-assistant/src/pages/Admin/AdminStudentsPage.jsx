import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import AdminNav from "../../components/admin/AdminNav";
import { timeAgo } from "../../components/admin/adminFormat";

const PAGE_SIZE = 15;

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("lastActive");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debounce the search box so we don't query on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminService.getStudents({
          search: debouncedSearch,
          sort,
          order,
          page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) setResult(res.data);
      } catch (err) {
        if (!cancelled) toast.error(err?.error || "Failed to load students.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, sort, order, page]);

  const toggleSort = (field) => {
    if (sort === field) {
      setOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSort(field);
      setOrder("desc");
    }
    setPage(1);
  };

  const SortHeader = ({ field, children, className = "" }) => (
    <th className={`px-4 py-3 text-left ${className}`}>
      <button
        onClick={() => toggleSort(field)}
        className={`flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest transition-colors ${
          sort === field ? "text-sky-600" : "text-slate-400 hover:text-slate-700"
        }`}
      >
        {children}
        {sort === field && (order === "desc" ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}
      </button>
    </th>
  );

  const students = result?.students || [];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Students" subtitle="Search, sort, and open a student to see where they're stuck" />
      <AdminNav />

      <div className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_8px_0_theme(colors.slate.200)] p-6">
        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full h-11 pl-11 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Student</th>
                <SortHeader field="level">Level</SortHeader>
                <SortHeader field="xp">XP</SortHeader>
                <SortHeader field="lessons">Lessons (Java / Python)</SortHeader>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Practice</th>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Streak</th>
                <SortHeader field="lastActive">Last active</SortHeader>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/admin/students/${s.id}`)}
                  className="border-b border-slate-100 hover:bg-sky-50/60 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-800 text-sm">{s.username}</p>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">{s.level}</td>
                  <td className="px-4 py-3 text-sm font-black text-amber-600">{s.xp}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">
                    {s.lessons.total}
                    <span className="text-slate-400 font-semibold"> ({s.lessons.java} / {s.lessons.python})</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">{s.practiceCompleted}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">{s.currentStreak}d</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-500">{timeAgo(s.lastActive)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && <div className="py-8"><Spinner /></div>}
          {!loading && students.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-10">
              {debouncedSearch ? "No students match your search." : "No students yet."}
            </p>
          )}
        </div>

        {result && result.total > 0 && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {result.total} student{result.total === 1 ? "" : "s"} · Page {result.page} of {result.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                disabled={page >= result.totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentsPage;
