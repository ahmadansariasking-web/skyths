import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  LogOut,
  Menu,
  X,
  Eye,
  Printer,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/skyths-logo.png";
import OrderReceipt from "@/components/OrderReceipt";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone1: string;
    phone2?: string;
    address: string;
    city: string;
    postalCode?: string;
    comments?: string;
  };
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentSlip?: string | null;
  paymentSlipName?: string | null;
  status: string;
  createdAt: string;
}

const Employee = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirect if not authenticated as employee
    if (!isAuthenticated || user?.role !== "employee") {
      navigate("/auth");
      return;
    }
    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("skyths_orders") || "[]");
    setOrders(storedOrders);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("skyths_orders", JSON.stringify(updatedOrders));
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const orderStats = {
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    awaiting_verification: orders.filter(o => o.status === "awaiting_verification").length,
  };

  // Show loading if not authenticated yet
  if (!isAuthenticated || user?.role !== "employee") {
    return null;
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <img src={logo} alt="Skyths" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-gradient-copper">Employee Portal</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage orders</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card rounded-xl p-6 border border-border space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="employee@skyth.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Sign In
            </Button>
          </form>

          <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/")}>
            ← Back to Store
          </Button>
        </div>
      </div>
    );
  }

  // Order Receipt View
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
              ← Back to Orders
            </Button>
            <Button variant="hero" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
          <div ref={printRef}>
            <OrderReceipt order={selectedOrder} showPaymentSlip={true} />
          </div>
          <div className="mt-6 p-6 bg-card rounded-xl border border-border">
            <h3 className="font-serif font-semibold mb-4">Update Order Status</h3>
            <div className="flex flex-wrap gap-2">
              {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={selectedOrder.status === status ? "hero" : "outline"}
                  size="sm"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.orderId, status);
                    setSelectedOrder({ ...selectedOrder, status });
                  }}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Skyths" className="w-10 h-10" />
            <div>
              <h2 className="font-serif font-bold">SKYTHS</h2>
              <p className="text-xs text-muted-foreground">Employee Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <div className="px-4 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Filter Orders
          </div>
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "pending", label: "Pending", count: orderStats.pending },
            { id: "confirmed", label: "Confirmed", count: orderStats.confirmed },
            { id: "processing", label: "Processing", count: orderStats.processing },
            { id: "shipped", label: "Shipped", count: orderStats.shipped },
            { id: "delivered", label: "Delivered", count: orderStats.delivered },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-sm ${activeFilter === filter.id ? "" : "text-muted-foreground"}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="font-serif text-xl font-bold">Order Management</h1>
            </div>
            <Button variant="outline" size="sm" onClick={loadOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{orderStats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{orderStats.processing}</div>
                  <div className="text-xs text-muted-foreground">Processing</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{orderStats.shipped}</div>
                  <div className="text-xs text-muted-foreground">Shipped</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{orderStats.delivered}</div>
                  <div className="text-xs text-muted-foreground">Delivered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                {activeFilter === "all" ? "All Orders" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Orders`}
              </h3>
              <span className="text-sm text-muted-foreground">{filteredOrders.length} orders</span>
            </div>
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 md:p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold">{order.orderId}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            order.status === "delivered"
                              ? "bg-green-500/20 text-green-500"
                              : order.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : order.status === "cancelled"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Customer</span>
                          <span className="font-medium">{order.customer.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Phone</span>
                          <span className="font-medium">{order.customer.phone1}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">City</span>
                          <span className="font-medium">{order.customer.city}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Total</span>
                          <span className="font-medium">PKR {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted rounded text-xs">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Employee;
