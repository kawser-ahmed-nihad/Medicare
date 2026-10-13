import { LogOut } from "lucide-react";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import useBadgeCounts from "../hooks/useBadgeCounts";
import { getNavItems, formatBadge } from "./navItems";

const Sidebar = ({ handleLogout }) => {
  const { user } = useAuth();
  const badges = useBadgeCounts();
  const navItems = getNavItems(user?.role);

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 bg-white lg:block">
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-[#EEF3F8] px-7">
        <Link to="/" className="flex items-center gap-1">
          <img className="h-9 w-9" src="/logo-icon-bg.svg" alt="Logo" />
          <h1 className="text-xl font-bold">Medicare</h1>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex h-[calc(100vh-72px)] flex-col px-3 py-6">
        <nav className="scrollbar-hide space-y-4 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const count = item.badgeKey ? badges[item.badgeKey] : 0;

            return (
              <NavLink
                to={item.to}
                key={item.to}
                end={item.end}
                className={({ isActive }) => `
                  group relative flex w-full cursor-pointer items-center gap-3 rounded-[9px] px-3 py-3 text-left text-[13px] transition-all duration-200
                  ${isActive ? "bg-[#EAF4FF] font-medium text-[#0066FE]" : "text-[#244775] hover:bg-[#F5F9FD] hover:text-[#0878F9]"}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-3 top-1/2 h-10 w-[3px] -translate-y-1/2 rounded-r-full bg-[#0878F9]" />}

                    <Icon size={19} strokeWidth={isActive ? 1.9 : 1.6} className="shrink-0" />
                    <span className="flex-1">{item.label}</span>

                    {count > 0 && (
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF4962] px-1 text-[10px] font-semibold text-white">
                        {formatBadge(count)}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-[#EDF2F7] pt-2">
          <button
            className="flex w-full cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;