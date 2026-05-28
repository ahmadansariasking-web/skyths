import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import FAQs from "./pages/FAQs";
import ShippingInfo from "./pages/ShippingInfo";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/OrderTracking";
import { ChatBot } from "@/components/ChatBot";
import IntroAnimation from "@/components/IntroAnimation";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("skyths_intro_seen");
  });

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("skyths_intro_seen", "1");
    setShowIntro(false);
  };

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/shipping-info" element={<ShippingInfo />} />
                <Route path="/track" element={<OrderTracking />} />
                <Route path="/track/:orderId" element={<OrderTracking />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot />
            </BrowserRouter>
            <AnimatePresence mode="wait">
              {showIntro && <IntroAnimation key="intro" onComplete={handleIntroComplete} />}
            </AnimatePresence>
          </CartProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
