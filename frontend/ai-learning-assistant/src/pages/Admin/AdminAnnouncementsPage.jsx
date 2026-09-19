import React, { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import AdminNav from "../../components/admin/AdminNav";

const TITLE_MAX = 120;
const MESSAGE_MAX = 2000;

const AdminAnnouncementsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const canSend = title.trim().length > 0 && message.trim().length > 0 && !sending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSend) setConfirmOpen(true);
  };

  const handleSend = async () => {
    if (sending) return;
    setSending(true);
    try {
      const res = await adminService.sendAnnouncement(title.trim(), message.trim());
      toast.success(res.message || "Announcement sent.");
      setTitle("");
      setMessage("");
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err?.error || "Failed to send the announcement.");
      setConfirmOpen(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Announcements" subtitle="Send a notification to every student" />
      <AdminNav />

      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_8px_0_theme(colors.slate.200)] p-8 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1rem] bg-amber-100 flex items-center justify-center border-2 border-amber-200 shadow-sm">
            <Megaphone className="w-6 h-6 text-amber-500" strokeWidth={3} />
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Students see this in their Notifications. It goes to all students and can't be recalled.
          </p>
        </div>

        <div>
          <label htmlFor="title" className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            <span>Title</span>
            <span className="text-slate-400">{title.length}/{TITLE_MAX}</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quiz on Friday"
            className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="message" className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            <span>Message</span>
            <span className="text-slate-400">{message.length}/{MESSAGE_MAX}</span>
          </label>
          <textarea
            id="message"
            value={message}
            maxLength={MESSAGE_MAX}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Write your announcement..."
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white resize-y"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSend}
            className="flex items-center gap-2 px-6 h-12 bg-sky-500 hover:bg-sky-600 text-white text-sm font-black uppercase rounded-xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-[4px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} /> Send to all students
          </button>
        </div>
      </form>

      <Modal isOpen={confirmOpen} onClose={() => !sending && setConfirmOpen(false)} title="Send to all students?">
        <p className="text-sm text-slate-600 mb-4">
          This will notify <strong>every student</strong> right away and can't be undone.
        </p>
        <div className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6">
          <p className="font-black text-slate-800 text-sm mb-1">{title.trim()}</p>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{message.trim()}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmOpen(false)}
            disabled={sending}
            className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-5 h-11 bg-sky-500 hover:bg-sky-600 text-white text-sm font-black rounded-xl disabled:opacity-50"
          >
            {sending ? "Sending..." : "Yes, send it"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAnnouncementsPage;
