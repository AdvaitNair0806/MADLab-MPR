"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Order, subscribeToAllOrders, updateOrderStatus } from "@/lib/orders";
import dynamic from "next/dynamic";

// Map must be dynamically loaded because Leaflet uses Window object
const CampusMap = dynamic(() => import("@/components/CampusMap"), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-100 rounded-2xl animate-pulse text-slate-400 font-medium border border-slate-200">
      Loading Delivery Map...
    </div>
  )
});

export default function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((allOrders) => {
      setOrders(allOrders);
    });
    return () => unsubscribe();
  }, []);

  // Staff sees all "Pending" requests and "In Transit" requests assigned to them
  const pendingOrders = orders.filter(o => o.status === "Pending");
  const myTransitOrders = orders.filter(o => o.status === "In Transit" && o.staffEmail === user?.email);

  const queue = [...myTransitOrders, ...pendingOrders]; // Show accepted ones at the top

  const handleAccept = (orderId: string) => {
    if (!user?.email) return;
    updateOrderStatus(orderId, "In Transit", user.email);
  };

  const handleDeliver = (orderId: string) => {
    updateOrderStatus(orderId, "Delivered");
  };

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <main className="page-bg flex min-h-screen font-sans p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* Header */}
          <header className="dash-header flex flex-col md:flex-row justify-between items-center p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Support Staff Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage logistics requests and track deliveries across campus.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/profile" className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm inline-block">
                Profile
              </Link>
            </div>
          </header>
          
          {/* Main Grid: Queue & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* Left Col: Request Queue */}
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
              <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-bold text-lg">Active Queue</h3>
                <span className="bg-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">{queue.length} Tasks</span>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-slate-50">
                {queue.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p>No active requests right now.</p>
                    <p className="text-sm mt-1">Check back later or take a break!</p>
                  </div>
                ) : (
                  queue.map(order => (
                    <div key={order.id} className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm hover:shadow transition-shadow overflow-hidden group">
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                            order.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-xs font-mono text-slate-400">#{order.id.slice(0, 6)}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg">Room {order.roomNumber}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">Requested by {order.professorName}</p>
                      </div>
                      
                      <div className="p-4 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Items Needed:</p>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-slate-700">
                              <span>- {item.name}</span>
                              <span className="font-bold text-slate-500">x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-white border-t border-slate-100">
                        {order.status === "Pending" ? (
                          <button 
                            onClick={() => handleAccept(order.id)}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2"
                          >
                            Accept Request
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDeliver(order.id)}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2"
                          >
                            Mark as Delivered
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Col: Map View */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col min-h-[500px]">
              <div className="mb-4">
                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  TSEC Campus Logistics Map
                </h3>
                <p className="text-slate-500 text-sm mt-1">Navigate delivery and pickup points across campus.</p>
              </div>
              <div className="flex-1 w-full rounded-2xl overflow-hidden relative isolate z-0">
                <CampusMap />
              </div>
            </div>

          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
