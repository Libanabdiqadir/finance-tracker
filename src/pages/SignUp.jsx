import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseclient";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false)
    } else {
      alert("Check your email for the confirmation link!");
      navigate("/")
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 overflow-hidden relative">
        <div className="relative">
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
              <span className="text-white font-black text-xl italic">F</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Start tracking your wealth with FinanceFlow
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-300"
              />
            </div>
            <div className="flex items-center gap-2 ml-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                id="terms"
              />
              <label
                htmlFor="terms"
                className="text-xs text-slate-500 font-medium"
              >
                I agree to the Terms & Conditions
              </label>
            </div>
            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98]"
                    onClick={handleSignUp}>
              Create Account
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-black hover:underline"
            >
              {loading ? "Creating Account..." : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
