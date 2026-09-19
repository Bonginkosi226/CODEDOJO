import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, Megaphone } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/struggles', label: 'Struggles', icon: AlertTriangle },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
];

const AdminNav = () => (
  <div className="flex flex-wrap items-center gap-2 mb-8">
    {links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border-b-4 transition-all duration-150 ${
            isActive
              ? 'bg-sky-400 text-white border-sky-600 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
          }`
        }
      >
        <link.icon size={16} strokeWidth={2.5} />
        {link.label}
      </NavLink>
    ))}
  </div>
);

export default AdminNav;
