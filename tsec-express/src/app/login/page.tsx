import Link from "next/link";

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden p-8 space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to your TSEC Express account</p>
        </div>

        <form className="space-y-4">
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
            <div className="flex justify-end pt-1">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-xs">Forgot password?</a>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-blue-600 text-white font-semibold rounded-xl px-4 py-3 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="pt-4 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
