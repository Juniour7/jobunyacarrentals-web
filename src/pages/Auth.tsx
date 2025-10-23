import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";

const Auth = () => {
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    contact: "",
    licence: "",
    password: "",
    confirmPassword: "",
    agree_terms: false, // must agree to terms
  });
  const [signupLoading, setSignupLoading] = useState(false);

  // ----------------------------
  // LOGIN HANDLER
  // ----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await authAPI.login({
        email: loginData.email,
        password: loginData.password,
      });

      const userData = response.data;

      // Save token and user info
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful!");

      // Redirect based on role
      if (userData.roles === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ----------------------------
  // SIGNUP HANDLER
  // ----------------------------
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!signupData.agree_terms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    setSignupLoading(true);

    try {
      const response = await authAPI.register({
        full_name: signupData.name,
        email: signupData.email,
        phone_number: signupData.contact,
        license_number: signupData.licence,
        password: signupData.password,
        password2: signupData.confirmPassword,
        agree_terms: "True"
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Registration successful!");
        navigate("/customer/dashboard");
      } else {
        toast.success("Registration successful! Please login.");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errors[key].forEach((msg: string) => toast.error(`${key}: ${msg}`));
          } else {
            toast.error(`${key}: ${errors[key]}`);
          }
        });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  // ----------------------------
  // UI / FORM JSX
  // ----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-secondary to-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
            <Car className="w-7 h-7 text-background" />
          </div>
          <span className="font-heading text-2xl font-semibold">EliteMotion</span>
        </Link>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* ---------------------- LOGIN ---------------------- */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="john@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" variant="accent" className="w-full" size="lg" disabled={loginLoading}>
                    {loginLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------------- SIGN UP ---------------------- */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
                <CardDescription>Sign up to start booking premium vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-contact">Phone Number</Label>
                    <Input
                      id="signup-contact"
                      type="text"
                      placeholder="0712345678"
                      value={signupData.contact}
                      onChange={(e) => setSignupData({ ...signupData, contact: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-licence">Driver’s License Number</Label>
                    <Input
                      id="signup-licence"
                      type="text"
                      placeholder="DL123456"
                      value={signupData.licence}
                      onChange={(e) => setSignupData({ ...signupData, licence: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Terms agreement checkbox */}
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="agree_terms"
                      checked={signupData.agree_terms}
                      onChange={(e) => setSignupData({ ...signupData, agree_terms: e.target.checked })}
                      required
                    />
                    <Label htmlFor="agree_terms" className="text-sm text-muted-foreground">
                      I agree to the <Link to="/terms" className="text-accent underline">Terms and Conditions</Link>
                    </Label>
                  </div>

                  <Button type="submit" variant="accent" className="w-full" size="lg" disabled={signupLoading}>
                    {signupLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
