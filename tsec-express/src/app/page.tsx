import Link from "next/link";

export default function Home() {
  return (
    <main className="page-bg flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo + Brand */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">TSEC Express</h1>
            <p className="text-slate-500 mt-2 text-base">Smart supply logistics for your campus.</p>
          </div>
        </div>

        {/* Auth card */}
        <div className="auth-card space-y-3">
          <Link href="/login" className="block">
            <button className="btn-primary bg-blue-600 text-white hover:bg-blue-700">
              Sign In
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </Link>
          <Link href="/register" className="block">
            <button className="btn-primary bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-200">
              Create Account
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Thadomal Shahani Engineering College
        </p>
      </div>
    </main>
  );
}
