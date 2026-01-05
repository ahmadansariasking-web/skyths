"use client";

import { ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, index, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`;
  };

  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-gradient-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 shadow-card hover:shadow-elegant">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <Button
              variant="hero"
              size="icon"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="hero"
              size="icon"
              onClick={() => onAddToCart?.(product)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.originalPrice && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded">
                SALE
              </span>
            )}
            {product.stock < 10 && (
              <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded">
                LOW STOCK
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <span className="text-xs text-primary font-medium uppercase tracking-wider">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="font-serif text-lg font-semibold mt-2 text-foreground group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="outline"
            className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
