"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("professor");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mockLogin } = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulate registering and logging in immediately
      mockLogin(email, role);
      setSuccess(true);
      setTimeout(() => {
        if (role === "professor") router.push("/dashboard/professor");
        else if (role === "staff") router.push("/dashboard/staff");
        else if (role === "admin") router.push("/dashboard/admin");
        else router.push("/profile");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-bg fixed inset-0 flex items-center justify-center p-6 text-slate-100 overflow-y-auto no-scrollbar relative isolate">
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-sm py-12 flex flex-col h-full min-h-[700px] justify-between">
        
        <div className="space-y-6">
          <Link href="/" className="inline-flex w-10 h-10 bg-slate-800/80 rounded-full items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10 mb-2">
            <svg className="w-5 h-5 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
            <p className="text-slate-400 text-sm mt-2">Join TSEC Express logistics platform.</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-300 text-sm p-4 rounded-2xl border border-red-500/30 flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/20 text-emerald-300 text-sm p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Account created! Redirecting to login...
              </div>
            )}

            <form className="space-y-4 pt-2" onSubmit={handleRegister}>
              <div>
                <label className="form-label text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input text-lg py-2.5"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div>
                <label className="form-label text-[10px]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input text-lg py-2.5"
                  placeholder="name@tsec.edu"
                  required
                />
              </div>

              <div>
                <label className="form-label text-[10px]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input text-lg py-2.5"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="form-label text-[10px]">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input text-lg py-3 appearance-none bg-slate-900 border-white/10 text-white"
                >
                  <option value="professor">Professor / Lab Assistant</option>
                  <option value="staff">Support Staff / Peon</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="btn-primary bg-purple-600 text-white disabled:opacity-50"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating code...</>
                  ) : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pb-safe pt-6">
          <p className="text-center text-sm font-medium text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-bold hover:underline">Log in</Link>
          </p>
        </div>

      </div>
    </main>
  );
}
