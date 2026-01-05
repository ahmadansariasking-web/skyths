"use client";

import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/skyths-logo.png";

const Hero = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, text: "Premium Quality" },
    { icon: Truck, text: "Fast Delivery" },
    { icon: Award, text: "Handcrafted" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Leather texture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              Premium Handcrafted Leather
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Crafted for the{" "}
              <span className="text-gradient-copper">Distinguished</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Experience the art of leather craftsmanship. Each wallet is
              meticulously handcrafted to perfection, designed to last a
              lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate("/shop")}
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate("/about")}
              >
                Our Story
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start">
              {features.map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Logo Animation */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute w-[500px] h-[500px] rounded-full border border-primary/10 animate-spin" style={{ animationDuration: "60s" }} />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 animate-spin" style={{ animationDuration: "45s", animationDirection: "reverse" }} />
            <img
              src={logo}
              alt="Skyths Logo"
              className="w-80 h-80 object-contain drop-shadow-2xl animate-float"
            />
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
