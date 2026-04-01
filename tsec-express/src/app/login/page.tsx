"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mockLogin } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 700));

      let role = "professor";
      if (email.includes("admin")) role = "admin";
      else if (email.includes("staff")) role = "staff";
      else if (email.includes("prof") || email.includes("professor")) role = "professor";

      mockLogin(email, role);

      if (role === "professor") router.push("/dashboard/professor");
      else if (role === "staff") router.push("/dashboard/staff");
      else if (role === "admin") router.push("/dashboard/admin");
      else router.push("/profile");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-bg flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Brand mark */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">TSEC Express</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-6">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue.</p>
        </div>

        {/* Card */}
        <div className="auth-card space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@tsec.edu"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label" style={{marginBottom: 0}}>Password</label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Signing in...</>
              ) : "Sign In"}
            </button>
          </form>

          {/* Quick-fill demo hints */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 mb-2">Quick fill — Demo accounts</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {["prof@tsec.edu", "staff@tsec.edu", "admin@tsec.edu"].map(hint => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setEmail(hint)}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors font-mono"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </main>
  );
}
