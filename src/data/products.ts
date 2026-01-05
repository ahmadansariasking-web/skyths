import wallet1 from "@/assets/wallet-1.jpg";
import wallet2 from "@/assets/wallet-2.jpg";
import wallet3 from "@/assets/wallet-3.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Bifold Wallet",
    description: "Handcrafted premium full-grain leather bifold wallet with multiple card slots and a spacious bill compartment.",
    price: 4500,
    originalPrice: 5500,
    image: wallet1,
    category: "Bifold",
    stock: 15,
    featured: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Minimalist Cardholder",
    description: "Sleek black leather cardholder for the modern professional. Ultra-slim design fits perfectly in any pocket.",
    price: 2500,
    image: wallet2,
    category: "Cardholder",
    stock: 23,
    featured: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    name: "Executive Long Wallet",
    description: "Premium cognac tan leather long wallet with brass zipper. Perfect for those who carry everything in style.",
    price: 6500,
    originalPrice: 7500,
    image: wallet3,
    category: "Long Wallet",
    stock: 8,
    featured: true,
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "4",
    name: "Heritage Trifold",
    description: "Traditional trifold design with modern craftsmanship. Features RFID blocking technology.",
    price: 5000,
    image: wallet1,
    category: "Trifold",
    stock: 12,
    featured: false,
    rating: 4.6,
    reviews: 78,
  },
  {
    id: "5",
    name: "Slim Money Clip",
    description: "Ultra-thin leather money clip wallet. Perfect blend of minimalism and functionality.",
    price: 3000,
    image: wallet2,
    category: "Money Clip",
    stock: 20,
    featured: false,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: "6",
    name: "Vintage Travel Wallet",
    description: "Spacious travel wallet with passport holder and multiple currency compartments.",
    price: 7500,
    image: wallet3,
    category: "Travel",
    stock: 5,
    featured: true,
    rating: 4.9,
    reviews: 34,
  },
];

export const categories = ["All", "Bifold", "Cardholder", "Long Wallet", "Trifold", "Money Clip", "Travel"];
