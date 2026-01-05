import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@skyths.com",
      description: "We respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+92 300 1234567",
      description: "Mon-Sat, 9AM-6PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Lahore, Pakistan",
      description: "Main Branch",
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "9:00 AM - 6:00 PM",
      description: "Monday - Saturday",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-gradient-copper">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our products or need assistance with your order? 
              We're here to help. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={info.title}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-primary font-medium">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h2 className="font-serif text-2xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Your name"
                        className="h-12 bg-background border-border"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 bg-background border-border"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        placeholder="+92 300 1234567"
                        className="h-12 bg-background border-border"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input
                        placeholder="How can we help?"
                        className="h-12 bg-background border-border"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-32 bg-background border-border resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
