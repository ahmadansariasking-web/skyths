import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";

const Index = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
    toast.success(`${product.name} added to cart!`, {
      description: `PKR ${product.price.toLocaleString()}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartItems.length} />
      <Hero />
      <FeaturedProducts onAddToCart={handleAddToCart} />
      <Footer />
    </div>
  );
};

export default Index;
