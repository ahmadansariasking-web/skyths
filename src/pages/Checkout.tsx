import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Building2, ArrowLeft, CheckCircle, Truck, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderReceipt from "@/components/OrderReceipt";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentSlip, setPaymentSlip] = useState<string | null>(null);
  const [paymentSlipName, setPaymentSlipName] = useState<string>("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone1: "",
    phone2: "",
    address: "",
    city: "",
    postalCode: "",
    comments: "",
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue checkout");
      navigate("/auth?redirect=/checkout");
    }
  }, [isAuthenticated, navigate]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;

  const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKY-${timestamp}-${random}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentSlip(reader.result as string);
        setPaymentSlipName(file.name);
        toast.success("Payment slip uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validation
    if (!formData.name || !formData.email || !formData.phone1 || !formData.address || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check payment slip for non-COD payments
    if (paymentMethod !== "cod" && !paymentSlip) {
      toast.error("Please upload payment slip for verification");
      return;
    }

    // Check stock availability
    const outOfStock = cartItems.find((item) => item.stock < item.quantity);
    if (outOfStock) {
      toast.error(`Sorry, ${outOfStock.name} is out of stock`);
      return;
    }

    setIsProcessing(true);

    const orderId = generateOrderId();
    const status = paymentMethod === "cod" ? "pending" : "awaiting_verification";

    const { error } = await supabase.from("orders").insert({
      order_number: orderId,
      user_id: user?.id,
      customer: {
        name: formData.name,
        email: formData.email,
        phone1: formData.phone1,
        phone2: formData.phone2,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        comments: formData.comments,
      },
      items: cartItems as any,
      subtotal,
      shipping,
      total,
      payment_method: paymentMethod,
      payment_slip: paymentSlip,
      payment_slip_name: paymentSlipName,
      status,
    });

    if (error) {
      setIsProcessing(false);
      toast.error("Failed to place order", { description: error.message });
      return;
    }

    const order = {
      orderId,
      customer: {
        name: formData.name, email: formData.email, phone1: formData.phone1,
        phone2: formData.phone2, address: formData.address, city: formData.city,
        postalCode: formData.postalCode, comments: formData.comments,
      },
      items: cartItems, subtotal, shipping, total,
      paymentMethod, paymentSlip, paymentSlipName, status,
      createdAt: new Date().toISOString(),
    };

    setOrderData(order);
    setOrderComplete(true);
    setIsProcessing(false);
    clearCart();

    toast.success("Order placed successfully!", {
      description: `Track your order: ${orderId}`,
    });
  };

  const paymentMethods = [
    { id: "cod", name: "Cash on Delivery", icon: Truck, description: "Pay when you receive" },
    { id: "bank", name: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
    { id: "easypaisa", name: "EasyPaisa", icon: Wallet, description: "Mobile wallet payment" },
    { id: "jazzcash", name: "JazzCash", icon: CreditCard, description: "Mobile wallet payment" },
  ];

  if (orderComplete && orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto animate-scale-in">
              <div className="text-center mb-8">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-muted-foreground">
                  Thank you for your order. Your order ID is{" "}
                  <span className="text-primary font-bold">{orderData.orderId}</span>
                </p>
              </div>

              <OrderReceipt order={orderData} />

              <div className="flex justify-center gap-4 mt-8">
                <Button variant="outline" onClick={() => navigate("/shop")}>
                  Continue Shopping
                </Button>
                <Button variant="hero" onClick={() => window.print()}>
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products before checkout.</p>
            <Button variant="hero" onClick={() => navigate("/shop")}>
              Go to Shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>

          <h1 className="font-serif text-4xl font-bold mb-8 animate-fade-in">
            <span className="text-gradient-copper">Checkout</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Customer Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Info */}
                <div className="bg-card rounded-xl p-6 border border-border animate-fade-in">
                  <h2 className="font-serif text-xl font-semibold mb-6">Personal Information</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Your full name"
                        className="h-12 bg-background"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 bg-background"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number 1 <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="+92 300 1234567"
                        className="h-12 bg-background"
                        value={formData.phone1}
                        onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number 2</label>
                      <Input
                        placeholder="+92 321 7654321"
                        className="h-12 bg-background"
                        value={formData.phone2}
                        onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div
                  className="bg-card rounded-xl p-6 border border-border animate-fade-in"
                  style={{ animationDelay: "100ms" }}
                >
                  <h2 className="font-serif text-xl font-semibold mb-6">Delivery Address</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Address <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        placeholder="House/Building number, Street name, Area"
                        className="min-h-24 bg-background resize-none"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City <span className="text-destructive">*</span>
                        </label>
                        <Input
                          placeholder="City name"
                          className="h-12 bg-background"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Postal Code</label>
                        <Input
                          placeholder="Postal code"
                          className="h-12 bg-background"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Order Comments</label>
                      <Textarea
                        placeholder="Any special instructions for your order..."
                        className="min-h-24 bg-background resize-none"
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div
                  className="bg-card rounded-xl p-6 border border-border animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <h2 className="font-serif text-xl font-semibold mb-6">Payment Method</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <method.icon className={`h-6 w-6 mb-2 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">{method.description}</div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "cod" && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-500">Cash on Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered to your doorstep. Please make sure to have the exact amount ready.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Bank Account Details:</h4>
                      <p className="text-sm text-muted-foreground">
                        Bank: HBL (Habib Bank Limited)<br />
                        Account Title: Skyths Leather<br />
                        Account Number: 1234-5678-9012-3456<br />
                        IBAN: PK00HABB1234567890123456
                      </p>
                    </div>
                  )}

                  {(paymentMethod === "easypaisa" || paymentMethod === "jazzcash") && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">{paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"} Details:</h4>
                      <p className="text-sm text-muted-foreground">
                        Account Title: Skyths Leather<br />
                        Account Number: 0300-1234567
                      </p>
                    </div>
                  )}

                  {/* Payment Slip Upload for non-COD */}
                  {paymentMethod !== "cod" && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Upload className="h-4 w-4 text-primary" />
                        Upload Payment Slip <span className="text-destructive">*</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please transfer the amount and upload the payment slip/screenshot for verification.
                      </p>
                      <div className="flex flex-col gap-3">
                        <label className="relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors ${paymentSlip ? "border-green-500 bg-green-500/10" : "border-border hover:border-primary/50"}`}>
                            {paymentSlip ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-green-500 font-medium">{paymentSlipName}</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Click to upload payment slip</span>
                              </>
                            )}
                          </div>
                        </label>
                        {paymentSlip && (
                          <div className="relative">
                            <img
                              src={paymentSlip}
                              alt="Payment slip"
                              className="w-full max-h-48 object-contain rounded-lg border border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setPaymentSlip(null);
                                setPaymentSlipName("");
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 border border-border sticky top-32 animate-fade-in">
                  <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-border mb-6" />

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
