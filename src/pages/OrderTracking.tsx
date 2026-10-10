import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock, CheckCircle, Package, Truck, Home, XCircle, Loader2, Search, Radio, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Seo from "@/components/Seo";

const STAGES = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const statusIndex = (s: string) => {
  const i = STAGES.findIndex((x) => x.key === s);
  return i === -1 ? 0 : i;
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [myOrders, setMyOrders] = useState<Array<{ order_number: string; status: string; total: number; created_at: string }>>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setMyOrders([]);
      return;
    }
    supabase
      .from("orders")
      .select("order_number,status,total,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setMyOrders((data as any) ?? []));
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    setNotFound(false);
    setOrder(null);
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let active = true;

    const load = async () => {
      const { data, error } = await supabase
        .rpc("get_order_tracking", { _order_number: orderId })
        .maybeSingle();
      if (!active) return;
      if (error || !data) {
        setNotFound(true);
        setOrder(null);
      } else {
        setOrder(data);
        setNotFound(false);
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `order_number=eq.${orderId}` },
        () => {
          // Reload via RPC to keep PII-safe fields only
          load();
          toast.success("Order status updated");
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };

  }, [orderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/track/${searchInput.trim()}`);
  };

  const currentStage = order ? statusIndex(order.status) : 0;
  const isCancelled = order?.status === "cancelled";
  const isAwaitingVerification = order?.status === "awaiting_verification";

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Track Your Order - Real-Time Status | Skyths"
        description="Track your Skyths order in real time. Enter your unique Order ID to see exactly where your handcrafted leather wallet is."
        path="/track"
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-serif text-4xl font-bold mb-2">
              <span className="text-gradient-copper">Track Your Order</span>
            </h1>
            <p className="text-muted-foreground">Real-time status updates as your order moves.</p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8 animate-fade-in">
            <Input
              placeholder="Enter Order ID (e.g. SKY-XXXX-XXXX)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-12 bg-card"
            />
            <Button type="submit" variant="hero" size="lg">
              <Search className="h-4 w-4 mr-2" /> Track
            </Button>
          </form>

          {loading && (
            <div className="text-center py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
              Loading order...
            </div>
          )}

          {!loading && (!orderId || notFound) && (
            <div className="space-y-6">
              {notFound && (
                <div className="text-center py-10 bg-card border border-destructive/30 rounded-xl">
                  <XCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                  <p className="font-medium mb-1">Order not found</p>
                  <p className="text-sm text-muted-foreground px-4">
                    We couldn't find an order with that ID. Double-check the ID
                    {isAuthenticated ? " or pick one from your recent orders below." : ", or sign in to see your orders."}
                  </p>
                </div>
              )}

              {!notFound && !orderId && (
                <div className="text-center py-10 text-muted-foreground bg-card border border-border rounded-xl">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Enter your order ID above to see live status.</p>
                </div>
              )}

              {isAuthenticated && myOrders.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
                  <h2 className="font-serif text-xl font-semibold mb-4">Your recent orders</h2>
                  <div className="divide-y divide-border">
                    {myOrders.map((o) => (
                      <button
                        key={o.order_number}
                        onClick={() => navigate(`/track/${o.order_number}`)}
                        className="w-full flex items-center justify-between py-3 hover:bg-muted/40 px-2 -mx-2 rounded-lg transition-colors text-left"
                      >
                        <div>
                          <div className="font-mono text-sm font-semibold">{o.order_number}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(o.created_at).toLocaleDateString()} · PKR {Number(o.total).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                            {o.status.replace(/_/g, " ")}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isAuthenticated && myOrders.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  You have no orders yet.{" "}
                  <Link to="/shop" className="text-primary underline">Start shopping</Link>
                </div>
              )}

              {!isAuthenticated && (
                <div className="text-center">
                  <Button asChild variant="outline">
                    <Link to="/auth">Sign in to see your orders</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {!loading && order && (
            <div className="space-y-6 animate-fade-in">
              {/* Header card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</div>
                    <div className="font-mono text-lg font-bold">{order.order_number}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Placed {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                    <Radio className="h-3 w-3 animate-pulse" /> Live tracking
                  </div>
                </div>
              </div>

              {/* Status banners */}
              {isCancelled && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-destructive" />
                  <div>
                    <div className="font-semibold">This order was cancelled</div>
                    {order.tracking_note && (
                      <div className="text-sm text-muted-foreground">{order.tracking_note}</div>
                    )}
                  </div>
                </div>
              )}

              {isAwaitingVerification && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm">
                  Awaiting payment verification. Our team is reviewing your slip.
                </div>
              )}

              {/* Progress */}
              {!isCancelled && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-serif text-xl font-semibold mb-6">Progress</h2>
                  <div className="relative">
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                    <div
                      className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-700"
                      style={{
                        width: `calc((100% - 2.5rem) * ${currentStage / (STAGES.length - 1)})`,
                      }}
                    />
                    <div className="relative grid grid-cols-5 gap-2">
                      {STAGES.map((s, i) => {
                        const Icon = s.icon;
                        const done = i <= currentStage;
                        const active = i === currentStage;
                        return (
                          <div key={s.key} className="flex flex-col items-center text-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                done
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-border text-muted-foreground"
                              } ${active ? "ring-4 ring-primary/20 scale-110" : ""}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div
                              className={`mt-2 text-xs font-medium ${
                                done ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {s.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {order.tracking_note && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
                      <span className="font-medium">Update from our team: </span>
                      {order.tracking_note}
                    </div>
                  )}
                </div>
              )}

              {/* Items */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-serif text-xl font-semibold mb-4">Items</h2>
                <div className="space-y-3">
                  {(order.items as any[]).map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × PKR {item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="font-bold text-primary">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">PKR {Number(order.total).toLocaleString()}</span>
                </div>
              </div>

            </div>

          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
