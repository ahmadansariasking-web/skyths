import { Award, Heart, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import logo from "@/assets/skyths-logo.png";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We use only the finest full-grain leather sourced from trusted suppliers.",
    },
    {
      icon: Heart,
      title: "Handcrafted with Love",
      description: "Every wallet is meticulously crafted by skilled artisans with years of experience.",
    },
    {
      icon: Shield,
      title: "Built to Last",
      description: "Our products are designed to withstand daily use and age beautifully over time.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We stand behind every product we sell.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <img src={logo} alt="Skyths" className="w-24 h-24 mx-auto mb-6" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient-copper">Skyths</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Skyths is a premium leather wallet brand dedicated to crafting exceptional 
              accessories that combine timeless elegance with modern functionality. 
              Founded with a passion for quality craftsmanship, we believe every detail matters.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24 animate-fade-in">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <img src={logo} alt="Skyths Logo" className="w-48 h-48 opacity-80" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-xl blur-2xl" />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                Our <span className="text-gradient-copper">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Skyths was born from a simple idea: create leather wallets that 
                  people would be proud to carry for years. In a world of mass-produced 
                  accessories, we saw an opportunity to bring back the art of traditional 
                  leather craftsmanship.
                </p>
                <p>
                  Our journey began in a small workshop where we experimented with 
                  different leather grades, stitching techniques, and designs. Today, 
                  we continue that legacy of innovation while staying true to our 
                  commitment to quality.
                </p>
                <p>
                  Each Skyths wallet tells a story of dedication, skill, and attention 
                  to detail. From selecting the perfect hide to the final burnished edge, 
                  we pour our passion into every piece.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-24">
            <h2 className="font-serif text-3xl font-bold text-center mb-12 animate-fade-in">
              Our <span className="text-gradient-copper">Values</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-card rounded-xl p-6 border border-border text-center hover:border-primary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border animate-fade-in">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-serif text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Wallet Designs</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Genuine Leather</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
