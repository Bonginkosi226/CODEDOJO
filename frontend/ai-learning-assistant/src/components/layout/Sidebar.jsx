import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { 
  LayoutDashboard, 
  FileText, 
  User, 
  LogOut, 
  BrainCircuit, 
  BookOpen, 
  Gamepad2,
  Trophy,
  Bell,
  ChevronLeft,
  ChevronRight,
  X 
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isRetracted, setIsRetracted] = React.useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/arcade", icon: Gamepad2, text: "Arcade" },
    { to: "/leaderboard", icon: Trophy, text: "Leaderboard" },
    { to: "/notifications", icon: Bell, text: "Notifications" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl border-r-2 border-slate-200/80 z-50 
        md:relative md:shrink-0 md:flex md:flex-col md:translate-x-0
        transition-all duration-300 ease-in-out ${
          isRetracted ? "md:w-20" : "md:w-64"
        } w-64 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Toggle Expand/Retract (Desktop only) */}
        <button
          onClick={() => setIsRetracted(!isRetracted)}
          className="hidden md:flex absolute -right-3.5 top-8 w-7 h-7 bg-white border-2 border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-800 hover:shadow-md transition-all z-50"
        >
          {isRetracted ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo Section */}
        <div className={`flex items-center ${isRetracted ? 'justify-center' : 'justify-between'} h-20 px-4 border-b-2 border-slate-100`}>
          <div className={`flex items-center ${isRetracted ? 'justify-center' : 'gap-3'} group cursor-pointer hover:-translate-y-1 transition-transform`}>
            <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-400 shadow-[0_4px_0_theme(colors.orange.600)]">
              <BrainCircuit size={24} strokeWidth={3} className="text-white relative top-[1px]" />
            </div>
            {!isRetracted && (
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300">
                CODEDOJO
              </h1>
            )}
          </div>

          {!isRetracted && (
            <button
              onClick={toggleSidebar}
              className="md:hidden text-slate-500 hover:text-slate-800"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-x-hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => { if(window.innerWidth < 768) toggleSidebar(); }}
              title={isRetracted ? link.text : ""}
              className={({ isActive }) =>
                `group flex items-center ${isRetracted ? 'justify-center' : 'gap-4 px-4'} py-3.5 text-[15px] font-bold rounded-2xl transition-all duration-150 ${
                  isActive
                    ? "bg-sky-400 text-white border-b-4 border-sky-600 shadow-sm translate-y-[-2px] hover:-translate-y-1 hover:border-b-[6px]"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 hover:-translate-y-1 border-b-4 border-transparent hover:border-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={20}
                    strokeWidth={2.5}
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  />
                  {!isRetracted && (
                    <span className="whitespace-nowrap">{link.text}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t-2 border-slate-100 overflow-x-hidden">
          <button
            onClick={handleLogout}
            title={isRetracted ? "Logout" : ""}
            className={`group flex items-center ${isRetracted ? 'justify-center p-3.5' : 'justify-center gap-3 w-full px-4 py-3.5'} text-[15px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-400 hover:text-white border-b-4 border-rose-200 hover:border-rose-600 rounded-2xl transition-all duration-150 active:translate-y-[2px] active:border-b-[2px]`}
          >
            <LogOut
              size={20}
              strokeWidth={3}
              className={`shrink-0 transition-transform duration-200 ${isRetracted ? '' : 'group-hover:-translate-x-1'}`}
            />
            {!isRetracted && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
