"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { 
  InventoryItem, 
  CartItem, 
  Order, 
  fetchInventoryItems, 
  createOrder, 
  subscribeToProfessorOrders, 
  seedDummyItems 
} from "@/lib/orders";

type TabState = "request" | "orders";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabState>("request");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  
  // Form State
  const [roomNumber, setRoomNumber] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Load Inventory
  const loadInventory = async () => {
    try {
      const items = await fetchInventoryItems();
      setInventory(items);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Listen to Active Orders once user is loaded
  useEffect(() => {
    if (!user?.email) return;
    
    // Subscribe to real-time updates for orders
    const unsubscribe = subscribeToProfessorOrders(user.email, (orders) => {
      setActiveOrders(orders);
    });

    return () => unsubscribe();
  }, [user]);

  // Cart Functions
  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === itemId) {
        const newQ = c.quantity + change;
        return { ...c, quantity: newQ > 0 ? newQ : 0 };
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      await createOrder({
        professorEmail: user.email,
        professorName: user.email.split('@')[0], // Extracting name from mock context
        roomNumber,
        items: cart,
        status: "Pending",
      });
      
      // Reset cart and form
      setCart([]);
      setRoomNumber("");
      setActiveTab("orders"); // Switch to active orders to show new entry
    } catch (err) {
      console.error("Failed to checkout:", err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Seeding
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDummyItems();
      await loadInventory();
    } catch (err) {
      console.error("Seeding failed", err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Render logic
  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["professor"]}>
      <main className="page-bg flex min-h-screen">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center p-6 md:p-8 pb-32 lg:pb-8">
          <div className="w-full max-w-7xl flex flex-col gap-6">

            <header className="dash-header flex flex-col md:flex-row justify-between items-center p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Professor Dashboard</h1>
                <p className="text-slate-500 mt-1">Request classroom supplies and track your orders.</p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="/profile" className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                  Profile
                </Link>
              </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 px-6 md:px-8 pt-6">
              <button
                onClick={() => setActiveTab("request")}
                className={`tab-btn ${
                  activeTab === "request"
                    ? "bg-white border-blue-600 text-blue-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                Request Items
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`tab-btn flex items-center gap-2 ${
                  activeTab === "orders"
                    ? "bg-white border-blue-600 text-blue-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                Active Orders
                {activeOrders.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">{activeOrders.length}</span>
                )}
              </button>
            </div>

            {/* Tab content panel */}
            <div className="p-6 md:p-8 bg-slate-50 rounded-b-3xl min-h-[500px]">
              
              {/* Tab: Request Items */}
              {activeTab === "request" && (
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <input 
                      type="text" 
                      placeholder="Search for markers, projectors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Inventory Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInventory.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
                        No items found matching your search.
                      </div>
                    ) : (
                      filteredInventory.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                              {item.category}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 mt-2">{item.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                            <p className="text-sm font-medium text-slate-400 mt-2">In Stock: {item.inStock || "N/A"}</p>
                          </div>
                          
                          <button 
                            onClick={() => addToCart(item)}
                            className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold rounded-xl border border-slate-100 hover:border-blue-200 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add to Cart
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Active Orders */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {activeOrders.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
                      <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      You don't have any active orders right now.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {activeOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                          {/* Order Header */}
                          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                              <p className="text-xs text-slate-500 font-mono">Order #{order.id.slice(0, 8)}</p>
                              <h3 className="font-bold text-slate-900 mt-1">Room {order.roomNumber}</h3>
                            </div>
                            
                            {/* Status Badge */}
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === "Pending" ? "bg-amber-100 text-amber-700" :
                              order.status === "Accepted" ? "bg-blue-100 text-blue-700" :
                              order.status === "In Transit" ? "bg-purple-100 text-purple-700" :
                              order.status === "Delivered" ? "bg-green-100 text-green-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {order.status}
                            </div>
                          </div>
                          
                          {/* Order Items */}
                          <div className="p-6 bg-slate-50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center tracking-wider">Requested Items</h4>
                            <ul className="space-y-2">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between text-sm items-center">
                                  <span className="text-slate-700 font-medium">{item.name}</span>
                                  <span className="text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono text-xs">x{item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Order Footer - Timeline */}
                          <div className="p-4 border-t border-slate-100 text-center">
                             <div className="w-full flex justify-between items-center text-xs font-semibold text-slate-400 max-w-xs mx-auto">
                                <span className={order.status === "Pending" ? "text-amber-600" : "text-slate-800"}>Pending</span>
                                <span className="flex-1 border-t border-dashed border-slate-200 mx-2"></span>
                                <span className={order.status === "Accepted" ? "text-blue-600" : (["In Transit", "Delivered"].includes(order.status) ? "text-slate-800" : "")}>Accepted</span>
                                <span className="flex-1 border-t border-dashed border-slate-200 mx-2"></span>
                                <span className={order.status === "Delivered" ? "text-green-600" : "text-slate-300"}>Done</span>
                             </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Floating Cart Sidebar (Displays only when items are present and on request tab) */}
        {cart.length > 0 && activeTab === "request" && (
          <aside className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-8 lg:right-8 lg:left-auto lg:w-96 bg-white border-t lg:border border-slate-200 shadow-2xl lg:rounded-3xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Current Request
              </h2>
              <span className="bg-slate-700 px-2 py-1 rounded-lg text-xs font-bold">{totalItemsInCart} items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex-1 pr-4">
                    <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-100">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white rounded-md transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                    </button>
                    <span className="font-bold text-sm text-slate-800 w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-white rounded-md transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-slate-100 bg-white">
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Room Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 504, 3rd Floor Lab"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isCheckingOut || !roomNumber}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex justify-center items-center gap-2"
                >
                  {isCheckingOut ? (
                    <span className="animate-pulse">Placing Request...</span>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </aside>
        )}

      </main>
    </ProtectedRoute>
  );
}
