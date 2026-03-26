import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlelogIn = async (e) => {
    e.preventDefault();
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword ({
      email: email,
      password: password,
    });

    if(error) {
      alert("Login failed: " + error.message)
      setLoading(false);
    } else {
      navigate("/");
    }
  }
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-emerald-100" />
        
        <div className="relative">
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
              <span className="text-white font-black text-xl italic">F</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">Enter your details to access FinanceFlow</p>
          </div>

          <form className="space-y-5" onSubmit={handlelogIn}>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input 
                type="text" 
                placeholder="Enter email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700">Forgot?</button>
              </div>
              <input 
                type="password" 
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
              />
            </div>

            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98]"
                    type="submit"
                    disabled={loading}
                    onClick={handlelogIn}>
                    {loading ? "logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            New to the platform? <Link to="/signup" className="text-emerald-600 font-black hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogIn;