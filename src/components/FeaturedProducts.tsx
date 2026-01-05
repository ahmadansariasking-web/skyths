"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { products, Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
  const navigate = useNavigate();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Our Collection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-6">
            Featured <span className="text-gradient-copper">Wallets</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium leather wallets, each
            one crafted with precision and designed for those who appreciate
            timeless elegance.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/shop")}
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
