import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Eye,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/skyths-logo.png";
import OrderReceipt from "@/components/OrderReceipt";
import { products as initialProducts, Product } from "@/data/products";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Admin credentials
const ADMIN_EMAIL = "ad@skyths.com";
const ADMIN_PASSWORD = "admin@20206";

type TabType = "dashboard" | "orders" | "products" | "employees" | "analytics" | "settings";

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
  status: string;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  assignedOrders: number;
}

const COLORS = ["#C87533", "#B8860B", "#CD853F", "#D2691E", "#8B4513", "#A0522D"];

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "Ali Hassan", email: "ali@skyths.com", role: "Master Craftsman", status: "active", assignedOrders: 3 },
    { id: "2", name: "Sara Khan", email: "sara@skyths.com", role: "Quality Inspector", status: "active", assignedOrders: 2 },
    { id: "3", name: "Ahmed Ali", email: "ahmed@skyths.com", role: "Packaging Specialist", status: "active", assignedOrders: 4 },
    { id: "4", name: "Fatima Zahra", email: "fatima@skyths.com", role: "Customer Support", status: "active", assignedOrders: 1 },
  ]);

  useEffect(() => {
    const adminAuth = localStorage.getItem("skyths_admin_auth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("skyths_orders") || "[]");
    setOrders(storedOrders);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("skyths_admin_auth", "true");
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("skyths_admin_auth");
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

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success("Product deleted");
  };

  const saveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
      toast.success("Product updated");
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
      toast.success("Product added");
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;

  // Generate revenue data for chart
  const generateRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 200000) + 50000,
      orders: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const revenueData = generateRevenueData();

  const orderStatusData = [
    { name: "Pending", value: pendingOrders, color: "#EAB308" },
    { name: "Processing", value: orders.filter(o => o.status === "processing").length, color: "#3B82F6" },
    { name: "Shipped", value: orders.filter(o => o.status === "shipped").length, color: "#8B5CF6" },
    { name: "Delivered", value: completedOrders, color: "#22C55E" },
    { name: "Cancelled", value: orders.filter(o => o.status === "cancelled").length, color: "#EF4444" },
  ];

  const navItems = [
    { id: "dashboard" as TabType, name: "Dashboard", icon: LayoutDashboard },
    { id: "analytics" as TabType, name: "Analytics", icon: BarChart3 },
    { id: "orders" as TabType, name: "Orders", icon: Receipt },
    { id: "products" as TabType, name: "Products", icon: Package },
    { id: "employees" as TabType, name: "Employees", icon: Users },
    { id: "settings" as TabType, name: "Settings", icon: Settings },
  ];

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <img src={logo} alt="Skyths" className="w-24 h-24 mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-gradient-copper">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card rounded-xl p-8 border border-border space-y-6 shadow-xl">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="admin@skyths.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Sign In to Admin
            </Button>
          </form>

          <div className="flex gap-4 mt-6">
            <Button variant="ghost" className="flex-1" onClick={() => navigate("/")}>
              ← Back to Store
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate("/employee")}>
              Employee Login →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Order Receipt Modal
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="mb-6">
            ← Back to Orders
          </Button>
          <OrderReceipt order={selectedOrder} />
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => window.print()}>
              Print Receipt
            </Button>
            <Button variant="hero" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Product Modal
  const ProductModal = () => {
    const [formData, setFormData] = useState<Partial<Product>>(
      editingProduct || {
        name: "",
        category: "Bifold",
        price: 0,
        description: "",
        stock: 0,
        rating: 5,
        reviews: 0,
        image: "/placeholder.svg",
        featured: false,
      }
    );

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto">
          <h3 className="font-serif text-xl font-bold mb-6">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Bifold</option>
                  <option>Cardholder</option>
                  <option>Long Wallet</option>
                  <option>Travel</option>
                  <option>Money Clip</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (PKR)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Featured</label>
                <select
                  value={formData.featured ? "yes" : "no"}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.value === "yes" })}
                  className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowProductModal(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => saveProduct(formData as Product)}
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Product Modal */}
      {showProductModal && <ProductModal />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Skyths" className="w-12 h-12" />
            <div>
              <h2 className="font-serif font-bold text-lg">SKYTHS</h2>
              <p className="text-xs text-primary font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Admin</div>
              <div className="text-xs text-muted-foreground truncate">ad@skyths.com</div>
            </div>
          </div>
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
              <h1 className="font-serif text-xl font-bold capitalize">{activeTab}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={loadOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">PKR {totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <div className="text-sm text-muted-foreground">Pending Orders</div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{completedOrders}</div>
                  <div className="text-sm text-muted-foreground">Completed Orders</div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-serif text-lg font-semibold mb-6">Revenue Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#C87533"
                        strokeWidth={3}
                        dot={{ fill: "#C87533" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="font-serif text-lg font-semibold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Customer</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Total</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.orderId} className="hover:bg-muted/30">
                          <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                          <td className="px-6 py-4">{order.customer.name}</td>
                          <td className="px-6 py-4 font-medium">PKR {order.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                order.status === "delivered"
                                  ? "bg-green-500/20 text-green-500"
                                  : order.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "bg-blue-500/20 text-blue-500"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                            No orders yet. Orders will appear here when customers make purchases.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Bar Chart */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-lg font-semibold mb-6">Monthly Orders</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="orders" fill="#C87533" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Order Status Pie Chart */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-serif text-lg font-semibold mb-6">Order Status Distribution</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-serif text-lg font-semibold mb-6">Revenue Trend Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#C87533"
                        strokeWidth={3}
                        dot={{ fill: "#C87533", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="animate-fade-in">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold">All Orders</h3>
                  <span className="text-sm text-muted-foreground">{orders.length} orders</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Customer</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Contact</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Items</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Total</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-muted/30">
                          <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                          <td className="px-6 py-4">
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-muted-foreground">{order.customer.city}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div>{order.customer.email}</div>
                            <div className="text-muted-foreground">{order.customer.phone1}</div>
                          </td>
                          <td className="px-6 py-4">{order.items.length} items</td>
                          <td className="px-6 py-4 font-medium">PKR {order.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                              className="bg-background border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="animate-fade-in">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold">Product Inventory</h3>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Product</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Rating</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{product.category}</td>
                          <td className="px-6 py-4 font-medium">
                            PKR {product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.stock < 10
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-green-500/20 text-green-500"
                              }`}
                            >
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {product.rating} ({product.reviews})
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowProductModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-semibold">Employee Management</h3>
                  <Button variant="hero" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-muted/30 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 capitalize">
                          {employee.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {employee.assignedOrders} orders
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground truncate">
                        {employee.email}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Orders for Employees */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="font-serif text-lg font-semibold">Orders Ready for Fulfillment</h3>
                </div>
                <div className="p-6">
                  {orders.filter((o) => o.status === "confirmed" || o.status === "processing")
                    .length > 0 ? (
                    <div className="space-y-4">
                      {orders
                        .filter((o) => o.status === "confirmed" || o.status === "processing")
                        .map((order) => (
                          <div
                            key={order.orderId}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                          >
                            <div>
                              <div className="font-mono font-medium">{order.orderId}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.items.length} items • {order.customer.city}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  order.status === "confirmed"
                                    ? "bg-blue-500/20 text-blue-500"
                                    : "bg-purple-500/20 text-purple-500"
                                }`}
                              >
                                {order.status}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No orders ready for fulfillment
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-serif text-lg font-semibold mb-6">Store Settings</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Name</label>
                      <input
                        type="text"
                        defaultValue="SKYTHS"
                        className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue="info@skyths.com"
                        className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="text"
                        defaultValue="+92 300 1234567"
                        className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Shipping Fee (PKR)</label>
                      <input
                        type="number"
                        defaultValue="250"
                        className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Store Address</label>
                    <textarea
                      defaultValue="Lahore, Pakistan"
                      rows={2}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button variant="hero">Save Settings</Button>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-serif text-lg font-semibold mb-6">Payment Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bank Account Details</label>
                    <textarea
                      defaultValue="Bank: HBL&#10;Account: 1234567890&#10;Title: SKYTHS"
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">EasyPaisa Number</label>
                      <input
                        type="text"
                        defaultValue="0300-1234567"
                        className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">JazzCash Number</label>
                      <input
                        type="text"
                        defaultValue="0300-1234567"
                        className="w-full h-10 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <Button variant="hero">Save Payment Settings</Button>
                </div>
              </div>
            </div>
          )}
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

export default Admin;
