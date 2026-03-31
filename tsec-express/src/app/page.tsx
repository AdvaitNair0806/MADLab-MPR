import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white text-slate-800 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">TSEC Express</h1>
          <p className="text-sm text-slate-500">Your campus, simplified.</p>
        </div>

        <div className="space-y-4 pt-4">
          <Link href="/login" className="block w-full">
            <button className="w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-[0.98]">
              Login
            </button>
          </Link>
          
          <Link href="/register" className="block w-full">
            <button className="w-full px-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 border-2 border-transparent hover:border-blue-200 rounded-xl transition-all active:scale-[0.98]">
              Register New Account
            </button>
          </Link>
        </div>
        
      </div>
      
      <div className="mt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Thadomal Shahani Engineering College
      </div>
    </main>
  );
}
