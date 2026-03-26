import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Receipt, History, LogOut } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      queryClient.clear();
      navigate("/login");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Add Expense", path: "/add-expense", icon: <PlusCircle size={20} /> },
    { name: "Add Income", path: "/add-income", icon: <Receipt size={20} /> },
    { name: "Transactions", path: "/transactions", icon: <History size={20} /> },
  ];

  return (
    <nav className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col p-6 text-slate-300 border-r border-slate-800">
      
      <div className="flex items-center gap-3 mb-10 px-2">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">F</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">FinanceFlow</h1>
        </Link>
      </div>

      <ul className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "hover:bg-slate-800 hover:text-white text-slate-400"
                }`}
              >
                <span className={isActive ? "text-emerald-500" : "text-slate-500"}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-slate-800 pt-6">
        <button 
          onClick={handleLogOut}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;