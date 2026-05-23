import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/skyths-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, isAuthenticated, user } = useAuth();

  // Get redirect path from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/shop";

  useEffect(() => {
    // If already authenticated, redirect based on role
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "employee") {
        navigate("/employee");
      } else {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLogin && !formData.name) {
      toast.error("Please enter your name");
      return;
    }

    if (!isLogin) {
      const res = await signup(formData.email, formData.password, formData.name);
      if (res.success) {
        toast.success("Account created!", { description: "Check your email to confirm your account." });
      } else {
        toast.error(res.error || "Signup failed");
      }
      return;
    }

    const result = await login(formData.email, formData.password, formData.name);

    if (result.success) {
      if (result.role === "admin") {
        toast.success("Welcome back, Admin!", { description: "Redirecting to Admin Panel..." });
        setTimeout(() => navigate("/admin"), 500);
      } else if (result.role === "employee") {
        toast.success("Welcome, Employee!", { description: "Redirecting to Employee Portal..." });
        setTimeout(() => navigate("/employee"), 500);
      } else {
        toast.success("Welcome back!", { description: "Redirecting..." });
        setTimeout(() => navigate(redirectTo), 500);
      }
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (!res.success) toast.error(res.error || "Google sign-in failed");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Skyths"
            className="w-20 h-20 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="font-serif text-3xl font-bold text-gradient-copper">
            {isLogin ? "Welcome Back" : "Join Skyths"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin
              ? "Sign in to continue shopping"
              : "Create an account to get started"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative animate-fade-in">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Full Name"
                className="pl-10 h-12 bg-card border-border"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email Address"
              className="pl-10 h-12 bg-card border-border"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 h-12 bg-card border-border"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button variant="hero" size="lg" className="w-full">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Toggle */}
        <p className="text-center text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        {/* Back to Home */}
        <Button
          variant="ghost"
          className="w-full mt-6"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Auth;
