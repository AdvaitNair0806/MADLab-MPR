"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const ROLE_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  professor: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", label: "Professor" },
  staff:     { color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", label: "Support Staff" },
  admin:     { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", label: "Administrator" },
};

export default function Profile() {
  const { user, userRole, mockLogout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUserName(user.email?.split('@')[0] || "Unknown");
    }
  }, [user]);

  const handleLogout = async () => {
    mockLogout();
    router.push("/login");
  };

  const getDashboardRoute = () => {
    if (userRole === "professor") return "/dashboard/professor";
    if (userRole === "staff") return "/dashboard/staff";
    if (userRole === "admin") return "/dashboard/admin";
    return "/";
  };

  const roleConf = ROLE_CONFIG[userRole || ""] || { color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", label: userRole || "Unknown" };

  return (
    <ProtectedRoute>
      <main className="page-bg flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">

          {/* Header nav */}
          <div className="flex items-center justify-between">
            <Link href={getDashboardRoute()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Dashboard
            </Link>
            <span className="text-sm font-black text-slate-900 tracking-tight">TSEC Express</span>
          </div>

          {/* Profile card */}
          <div className="auth-card space-y-6">
            {/* Avatar */}
            <div className="text-center">
              <div className={`mx-auto w-20 h-20 ${roleConf.bg} ${roleConf.color} rounded-2xl flex items-center justify-center text-3xl font-black mb-4 border-2 ${roleConf.border}`}>
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <h1 className="text-xl font-bold text-slate-900">{userName || "User"}</h1>
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${roleConf.bg} ${roleConf.color} uppercase tracking-widest border ${roleConf.border}`}>
                {roleConf.label}
              </span>
            </div>

            {/* Info grid */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="form-label" style={{marginBottom: "0.25rem"}}>Email Address</p>
                <p className="text-slate-800 font-semibold text-sm">{user?.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="form-label" style={{marginBottom: "0.25rem"}}>Account ID</p>
                <p className="text-slate-600 font-mono text-xs truncate">{user?.uid}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => router.push(getDashboardRoute())}
                className="btn-primary bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary bg-red-600 text-white hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
