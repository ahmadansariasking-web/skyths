import { Truck, Clock, MapPin, Package, Shield, CreditCard, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ShippingInfo = () => {
  const { settings } = useSiteSettings();
  const deliveryZones = [
    { zone: "Major Cities", cities: "Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad", time: "2-3 days" },
    { zone: "Other Cities", cities: "Multan, Peshawar, Quetta, Sialkot, Gujranwala", time: "3-5 days" },
    { zone: "Remote Areas", cities: "Rural areas and smaller towns", time: "5-7 days" },
  ];

  const shippingFeatures = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On all orders above PKR 5,000. Standard shipping fee of PKR 250 applies below this amount."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Orders are processed within 24-48 hours. Handcrafted items may take 3-5 business days."
    },
    {
      icon: Shield,
      title: "Secure Packaging",
      description: "Every wallet is carefully packaged in our premium gift box with protective materials."
    },
    {
      icon: MapPin,
      title: "Nationwide Delivery",
      description: "We deliver to all cities and towns across Pakistan through our trusted courier partners."
    },
  ];

  const paymentMethods = [
    {
      name: "Bank Transfer",
      description: "Transfer directly to our bank account. Details provided after order confirmation.",
      processingTime: "Verified within 24 hours"
    },
    {
      name: "EasyPaisa",
      description: "Send payment to our registered EasyPaisa number. Screenshot required for confirmation.",
      processingTime: "Instant verification"
    },
    {
      name: "JazzCash",
      description: "Pay through JazzCash mobile wallet. Quick and convenient option.",
      processingTime: "Instant verification"
    },
  ];

  const orderStages = [
    { stage: "Order Placed", description: "Your order has been received and is awaiting payment confirmation." },
    { stage: "Payment Confirmed", description: "Payment verified. Your order is now in the production queue." },
    { stage: "Crafting", description: "Our artisans are handcrafting your wallet with care and precision." },
    { stage: "Quality Check", description: "Your wallet is being inspected to ensure it meets our standards." },
    { stage: "Packed", description: "Your order is carefully packaged and ready for dispatch." },
    { stage: "Shipped", description: "Your package is on its way! Track it with your Order ID." },
    { stage: "Delivered", description: "Your order has been delivered. Enjoy your new Skyths wallet!" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Shipping & <span className="text-gradient-copper">Delivery</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about how we deliver your premium leather wallets safely to your doorstep.
          </p>
        </div>
      </section>

      {/* Shipping Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingFeatures.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Delivery <span className="text-gradient-copper">Zones</span>
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Zone</th>
                  <th className="px-6 py-4 text-left font-medium">Coverage</th>
                  <th className="px-6 py-4 text-left font-medium">Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{zone.zone}</td>
                    <td className="px-6 py-4 text-muted-foreground">{zone.cities}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {zone.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-muted-foreground mt-6">
            * Delivery times are estimates and may vary during peak seasons or due to unforeseen circumstances.
          </p>
        </div>
      </section>

      {/* Order Tracking Stages */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Order <span className="text-gradient-copper">Journey</span>
          </h2>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
            <div className="space-y-8">
              {orderStages.map((item, index) => (
                <div key={index} className={`relative flex items-center gap-6 md:gap-12 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="font-serif font-semibold text-lg mb-2">{item.stage}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Payment <span className="text-gradient-copper">Methods</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{method.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                <span className="text-xs text-primary font-medium">{method.processingTime}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 md:p-12 text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Need Help With Your Order?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Our customer support team is available to assist you with any shipping or delivery queries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+923001234567"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5" />
                +92 300 1234567
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShippingInfo;
