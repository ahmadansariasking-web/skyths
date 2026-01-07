import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: `PKR ${product.price.toLocaleString()}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedProducts onAddToCart={handleAddToCart} />
      <Footer />
    </div>
  );
};

export default Index;
