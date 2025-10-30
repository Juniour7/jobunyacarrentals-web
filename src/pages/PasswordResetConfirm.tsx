import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { authAPI } from "@/services/api";
import { toast } from "sonner";

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ new_password: "", new_password2: "" });
  const [loading, setLoading] = useState(false);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uid || !token) {
      toast.error("Invalid reset link");
      return;
    }

    if (passwords.new_password !== passwords.new_password2) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwords.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await authAPI.confirmPasswordReset({
        uid,
        token,
        new_password: passwords.new_password,
        new_password2: passwords.new_password2,
      });
      toast.success("Password reset successful! You can now login with your new password.");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Invalid or expired reset link</p>
            <Button variant="accent" asChild>
              <Link to="/password-reset">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-heading text-center">Set New Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password2">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new_password2"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.new_password2}
                    onChange={(e) => setPasswords({ ...passwords, new_password2: e.target.value })}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" variant="accent" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PasswordResetConfirm;
