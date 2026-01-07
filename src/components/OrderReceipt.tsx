import logo from "@/assets/skyths-logo.png";
import { Image as ImageIcon } from "lucide-react";

interface OrderReceiptProps {
  order: {
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
  };
  showPaymentSlip?: boolean;
}

const OrderReceipt = ({ order, showPaymentSlip = false }: OrderReceiptProps) => {
  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      cod: "Cash on Delivery",
      bank: "Bank Transfer",
      easypaisa: "EasyPaisa",
      jazzcash: "JazzCash",
    };
    return methods[method] || method;
  };

  const getPaymentStatusBadge = () => {
    if (order.paymentMethod === "cod") return null;
    if (order.paymentSlip) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
          Payment Slip Uploaded
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
        Awaiting Payment
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-500",
      confirmed: "bg-blue-500/20 text-blue-500",
      processing: "bg-purple-500/20 text-purple-500",
      shipped: "bg-indigo-500/20 text-indigo-500",
      delivered: "bg-green-500/20 text-green-500",
      cancelled: "bg-red-500/20 text-red-500",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden print:shadow-none animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/10 p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Skyths" className="w-16 h-16" />
            <div>
              <h2 className="font-serif text-2xl font-bold">SKYTHS</h2>
              <p className="text-sm text-muted-foreground">Premium Leather Wallets</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Order ID</div>
            <div className="font-mono font-bold text-primary text-lg">{order.orderId}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
            <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Payment: </span>
            <span className="font-medium">{getPaymentMethodName(order.paymentMethod)}</span>
            {getPaymentStatusBadge()}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Customer Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 pb-2 border-b border-border">
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-24 text-muted-foreground">Name:</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-muted-foreground">Email:</span>
                <span className="font-medium">{order.customer.email}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-muted-foreground">Phone 1:</span>
                <span className="font-medium">{order.customer.phone1}</span>
              </div>
              {order.customer.phone2 && (
                <div className="flex">
                  <span className="w-24 text-muted-foreground">Phone 2:</span>
                  <span className="font-medium">{order.customer.phone2}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 pb-2 border-b border-border">
              Delivery Address
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-24 text-muted-foreground">Address:</span>
                <span className="font-medium flex-1">{order.customer.address}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-muted-foreground">City:</span>
                <span className="font-medium">{order.customer.city}</span>
              </div>
              {order.customer.postalCode && (
                <div className="flex">
                  <span className="w-24 text-muted-foreground">Postal:</span>
                  <span className="font-medium">{order.customer.postalCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Slip (for admin/employee view) */}
        {showPaymentSlip && order.paymentSlip && order.paymentMethod !== "cod" && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-500" />
              Payment Slip
              {order.paymentSlipName && (
                <span className="text-xs text-muted-foreground">({order.paymentSlipName})</span>
              )}
            </h4>
            <img
              src={order.paymentSlip}
              alt="Payment slip"
              className="w-full max-h-64 object-contain rounded-lg border border-border bg-background"
            />
          </div>
        )}

        {/* Comments */}
        {order.customer.comments && (
          <div className="mb-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Order Comments:</h4>
            <p className="text-sm text-muted-foreground">{order.customer.comments}</p>
          </div>
        )}

        {/* Products */}
        <div className="mb-8">
          <h3 className="font-serif text-lg font-semibold mb-4 pb-2 border-b border-border">
            Order Items
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                  <div className="font-bold text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-border pt-6">
          <div className="max-w-xs ml-auto space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>Thank you for shopping with Skyths!</p>
          <p>For any queries, contact us at support@skyths.com</p>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
