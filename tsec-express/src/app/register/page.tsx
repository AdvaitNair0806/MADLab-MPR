"use client";

import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("student");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden p-8 space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500">Join the TSEC Express platform</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1 text-sm text-left">
            <label className="block font-medium text-slate-700">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              placeholder="John Doe" 
              required
            />
          </div>

          <div className="space-y-1 text-sm text-left">
            <label className="block font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              placeholder="you@tsec.edu" 
              required
            />
          </div>

          <div className="space-y-1 text-sm text-left">
            <label className="block font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              placeholder="••••••••" 
              required
            />
          </div>

          <div className="space-y-1 text-sm text-left">
            <label className="block font-medium text-slate-700">User Role</label>
            <div className="relative">
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white text-slate-900"
                required
              >
                <option value="student" disabled className="text-slate-400">Select Role</option>
                <option value="professor">Professor</option>
                <option value="staff">Support Staff</option>
                <option value="admin">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 bg-blue-600 text-white font-semibold rounded-xl px-4 py-3 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <div className="pt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
