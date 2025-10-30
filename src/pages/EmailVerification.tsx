import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const uid = searchParams.get("uid");
      const token = searchParams.get("token");

      if (!uid || !token) {
        toast.error("Invalid verification link");
        setVerifying(false);
        return;
      }

      try {
        await authAPI.verifyEmail({ uid, token });
        setSuccess(true);
        toast.success("Email verified successfully! You can now login.");
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      } catch (error: any) {
        setSuccess(false);
        toast.error(error.response?.data?.detail || "Email verification failed");
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
          {verifying ? (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-accent mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold mb-2">Verifying Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address...</p>
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold mb-2">Email Verified!</h1>
              <p className="text-muted-foreground mb-6">
                Your email has been successfully verified. Redirecting to login...
              </p>
              <Button onClick={() => navigate("/auth")} variant="default" className="w-full">
                Go to Login
              </Button>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold mb-2">Verification Failed</h1>
              <p className="text-muted-foreground mb-6">
                The verification link is invalid or has expired. Please try signing up again.
              </p>
              <Button onClick={() => navigate("/auth")} variant="default" className="w-full">
                Back to Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
