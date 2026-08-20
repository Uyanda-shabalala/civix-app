import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { to: "/ward", label: "My Ward" },
  { to: "/board", label: "Board" },
  { to: "/reports", label: "My Reports" },
];

export default function NavBar() {
  const { signOut } = useAuth();

  return (
    <header className="max-w-2xl mx-auto px-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center text-white text-xs font-extrabold">
            ✓
          </div>
          <span className="font-bold text-brand-ink tracking-tight">CIVIX</span>
        </div>
        <button onClick={signOut} className="text-xs text-brand-muted hover:text-brand-ink">
          Log out
        </button>
      </div>

      <nav className="flex gap-5 mt-4 border-b border-brand-line">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `pb-2.5 text-sm font-semibold ${
                isActive
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-brand-muted"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
