"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { 
  InventoryItem, 
  Order, 
  subscribeToAllOrders, 
  subscribeToInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem 
} from "@/lib/orders";
import { AppUser, subscribeToUsers, approveUser } from "@/lib/users";

type TabState = "inventory" | "analytics" | "users";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabState>("inventory");
  
  // Data State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<AppUser[]>([]);

  // Form State
  const [newItem, setNewItem] = useState({ name: "", category: "Stationery", description: "", inStock: 0 });

  useEffect(() => {
    const unsubInv = subscribeToInventory(setInventory);
    const unsubOrd = subscribeToAllOrders(setOrders);
    const unsubUsr = subscribeToUsers(setUsersList);
    return () => { unsubInv(); unsubOrd(); unsubUsr(); };
  }, []);

  // --- Handlers ---
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category) return;
    addInventoryItem(newItem);
    setNewItem({ name: "", category: "Stationery", description: "", inStock: 0 });
  };

  const handleUpdateStock = (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateInventoryItem(id, { inStock: newStock });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this catalog item?")) {
      deleteInventoryItem(id);
    }
  };

  // --- Analytics Derivations ---
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaysDelivered = orders.filter(
    o => o.status === "Delivered" && o.timestamp >= todayStart.getTime()
  );

  const staffDeliveries: Record<string, number> = {};
  todaysDelivered.forEach(o => {
    if (o.staffEmail) {
      staffDeliveries[o.staffEmail] = (staffDeliveries[o.staffEmail] || 0) + 1;
    }
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <main className="page-bg flex min-h-screen font-sans p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Command Center</h1>
              <p className="text-slate-500 mt-1">Manage global inventory, review analytics, and verify university staff.</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <Link href="/profile" className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                My Profile
              </Link>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="flex gap-2">
            {[ 
              { id: "inventory", label: "Inventory CRUD" }, 
              { id: "analytics", label: "Order Analytics" }, 
              { id: "users", label: "User Management" } 
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabState)}
                className={`py-3 px-6 font-bold rounded-t-2xl transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? "bg-white border-purple-600 text-purple-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" 
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Main Content Pane */}
          <div className="bg-white rounded-b-3xl rounded-tr-3xl shadow-sm border border-slate-100 p-8 min-h-[600px] -mt-6 z-10 relative">
            
            {/* Tab A: Inventory Management */}
            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form Col */}
                <div className="lg:col-span-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add New Catalog Item
                  </h3>
                  <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Item Name</label>
                      <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="e.g. Wireless Mouse" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                      <select required value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white">
                        <option value="Stationery">Stationery</option>
                        <option value="IT Accessories">IT Accessories</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Misc">Misc</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none" rows={2} placeholder="Brief description..."></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Stock</label>
                      <input required type="number" min="0" value={newItem.inStock} onChange={e => setNewItem({...newItem, inStock: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors active:scale-[0.98]">Create Item</button>
                  </form>
                </div>

                {/* List Col */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Current Catalog</h3>
                  {inventory.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-500">
                      Inventory is empty. Add a new item.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse bg-white">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Stock</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inventory.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4">
                                <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">{item.category}</span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="inline-flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                  <button onClick={() => handleUpdateStock(item.id, item.inStock, -1)} className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center font-bold pb-0.5">-</button>
                                  <span className="w-8 text-center text-sm font-bold text-slate-800">{item.inStock}</span>
                                  <button onClick={() => handleUpdateStock(item.id, item.inStock, 1)} className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 hover:text-green-500 hover:border-green-200 transition-colors flex items-center justify-center font-bold pb-0.5">+</button>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab B: Order Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Items Delivered Today</p>
                    <p className="text-5xl font-black text-slate-900 mt-2">{todaysDelivered.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 bg-purple-50 text-purple-100 w-32 h-32 rounded-full z-0 group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider relative z-10">Total Active Staff</p>
                    <p className="text-5xl font-black text-purple-700 mt-2 relative z-10">{Object.keys(staffDeliveries).length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">All-time Orders Recorded</p>
                    <p className="text-5xl font-black text-slate-900 mt-2">{orders.length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-900">Today's Staff Delivery Leaderboard</h3>
                  </div>
                  {Object.keys(staffDeliveries).length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-50">
                      No deliveries have been completed today yet.
                    </div>
                  ) : (
                    <div className="p-6 space-y-4 bg-slate-50">
                      {Object.entries(staffDeliveries).sort((a,b) => b[1] - a[1]).map(([email, count], idx) => (
                        <div key={email} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-slate-900">{email}</p>
                              <p className="text-xs text-slate-500">Support Staff Account</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-purple-600">{count}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deliveries</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab C: User Management */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 text-sm flex gap-3 items-start">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p><strong>Note:</strong> Since we are running on the local mocked environment, user logins are automatically allowed right now. This interface demonstrates how User Verification is structured for the database backend.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {usersList.sort((a,b) => b.createdAt - a.createdAt).map(u => (
                    <div key={u.id} className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between ${u.status === "Pending" ? "border-amber-200" : "border-slate-200"}`}>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                            u.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          }`}>
                            {u.status} User
                          </span>
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{u.role}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mt-3 text-lg truncate" title={u.name}>{u.name}</h4>
                        <p className="text-sm text-slate-500 truncate" title={u.email}>{u.email}</p>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        {u.status === "Pending" ? (
                          <button 
                            onClick={() => approveUser(u.id)}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-sm"
                          >
                            Approve Account
                          </button>
                        ) : (
                          <button disabled className="w-full py-2 bg-slate-50 text-slate-400 font-bold rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-200">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            Verified
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
