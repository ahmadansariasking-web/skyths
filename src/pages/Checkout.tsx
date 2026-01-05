import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Building2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, Product } from "@/data/products";
import OrderReceipt from "@/components/OrderReceipt";

interface CartItem extends Product {
  quantity: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Demo cart items
  const [cartItems] = useState<CartItem[]>([
    { ...products[0], quantity: 1 },
    { ...products[1], quantity: 2 },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    address: "",
    city: "",
    postalCode: "",
    comments: "",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;

  const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKY-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone1 || !formData.address || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check stock availability
    const outOfStock = cartItems.find((item) => item.stock < item.quantity);
    if (outOfStock) {
      toast.error(`Sorry, ${outOfStock.name} is out of stock`);
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = generateOrderId();
    const order = {
      orderId,
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
      items: cartItems,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage for demo
    const existingOrders = JSON.parse(localStorage.getItem("skyths_orders") || "[]");
    localStorage.setItem("skyths_orders", JSON.stringify([...existingOrders, order]));

    setOrderData(order);
    setOrderComplete(true);
    setIsProcessing(false);

    toast.success("Order placed successfully!", {
      description: `Your order ID is ${orderId}`,
    });
  };

  const paymentMethods = [
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
                  <div className="grid sm:grid-cols-3 gap-4">
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
