import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/features/authSlice";
import { Zap, LogOut, ShieldCheck } from "lucide-react";

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-[60] bg-white border-b-[3px] border-stone-900 no-print">
      <nav className="flex items-center justify-between max-w-[1440px] mx-auto px-10 py-5 text-stone-900 no-print">
        {/* --- Branding: Fixed Top Left --- */}
        <Link
          to="/"
          className="flex items-center gap-4 group shrink-0 no-print"
        >
          <div className="p-2.5 bg-emerald-700 border-2 border-stone-900 rounded-xl text-white shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none no-print">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className=" no-print font-black text-2xl tracking-tighter uppercase italic">
            Resume<span className="text-emerald-700">AI</span>
          </span>
        </Link>

        {/* --- User Controls: Top Right --- */}
        <div className="flex items-center gap-10">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 no-print">
                Verified Engineer
              </span>
            </div>
            <p className="text-sm font-black text-stone-900 uppercase tracking-tight">
              {user?.name || "Anonymous Designer"}
            </p>
          </div>

          <button
            onClick={logoutUser}
            className="flex items-center gap-3 bg-stone-900 text-white px-8 py-3 rounded-xl border-2 border-stone-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(5,150,105,0.4)] hover:bg-emerald-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
          >
            <LogOut size={14} strokeWidth={3} />
            <span className="no-print max-sm:hidden">Terminate Session</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
