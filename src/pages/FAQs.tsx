import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Orders & Payments",
    question: "What payment methods do you accept?",
    answer: "We accept Bank Transfer, EasyPaisa, and JazzCash. For Bank Transfer, you'll receive our account details after placing your order. For mobile wallets (EasyPaisa/JazzCash), you can send the payment to our registered number provided at checkout."
  },
  {
    category: "Orders & Payments",
    question: "How do I track my order?",
    answer: "Once your order is confirmed, you'll receive a unique Order ID. You can use this ID to track your order status. We'll also send you updates via email and SMS as your order progresses through our fulfillment process."
  },
  {
    category: "Orders & Payments",
    question: "Can I cancel my order?",
    answer: "You can cancel your order within 24 hours of placing it, provided it hasn't entered the production phase. Contact us immediately at info@skyths.com with your Order ID to request cancellation."
  },
  {
    category: "Orders & Payments",
    question: "How long does it take to process my order?",
    answer: "Since each wallet is handcrafted, processing typically takes 3-5 business days. During peak seasons, this may extend to 7-10 days. We'll keep you updated throughout the process."
  },
  {
    category: "Shipping & Delivery",
    question: "Do you deliver across Pakistan?",
    answer: "Yes! We deliver to all major cities and towns across Pakistan. Delivery times vary by location - major cities typically receive orders within 3-5 days, while remote areas may take 5-7 days."
  },
  {
    category: "Shipping & Delivery",
    question: "What are the shipping charges?",
    answer: "We offer FREE shipping on all orders above PKR 5,000. For orders below this amount, a flat shipping fee of PKR 250 is applied. We use reliable courier partners to ensure safe delivery."
  },
  {
    category: "Shipping & Delivery",
    question: "What if I'm not available to receive my order?",
    answer: "Our courier partner will attempt delivery 2-3 times. If you're unavailable, they'll contact you to arrange an alternative delivery time. You can also provide an alternate address or have someone else receive the package on your behalf."
  },
  {
    category: "Products",
    question: "Are your wallets genuine leather?",
    answer: "Absolutely! All Skyths wallets are crafted from 100% genuine, premium quality leather. We source our leather from trusted tanneries and each piece undergoes rigorous quality checks."
  },
  {
    category: "Products",
    question: "How do I care for my leather wallet?",
    answer: "To maintain your wallet's quality: Keep it away from water and direct sunlight. Clean with a soft, dry cloth. Apply leather conditioner every 3-6 months. Avoid overstuffing to maintain its shape."
  },
  {
    category: "Products",
    question: "Do you offer customization?",
    answer: "Yes! We offer personalized engraving and custom color options. Contact us at info@skyths.com with your requirements, and we'll provide a quote. Custom orders typically take an additional 3-5 days."
  },
  {
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unused products in original packaging. If you receive a defective or damaged item, we'll replace it free of charge. Custom/personalized orders are non-returnable."
  },
  {
    category: "Returns & Exchanges",
    question: "How do I initiate a return?",
    answer: "Email us at info@skyths.com with your Order ID, reason for return, and photos of the product. Our team will review and respond within 24-48 hours with return instructions."
  },
  {
    category: "Returns & Exchanges",
    question: "When will I receive my refund?",
    answer: "Once we receive and inspect the returned item, refunds are processed within 5-7 business days. The amount will be credited to your original payment method."
  },
];

const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-gradient-copper">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, orders, shipping, and more.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <div>
                      <span className="text-xs text-primary font-medium uppercase tracking-wider mb-1 block">
                        {faq.category}
                      </span>
                      <span className="font-medium text-lg">{faq.question}</span>
                    </div>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 animate-fade-in">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No FAQs found matching your search.
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQs;
