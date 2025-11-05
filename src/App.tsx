import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Fleet from "./pages/Fleet";
import Contact from "./pages/Contact";
import VehicleDetail from "./pages/VehicleDetail";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import EmailVerification from "./pages/EmailVerification";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BackToTop from "./components/BackToTop";
import WhatsAppSupport from "./components/WhatsAppSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <BackToTop />
        <Routes>
          <Route path="/" element={<><Index /><WhatsAppSupport /></>} />
          <Route path="/fleet" element={<><Fleet /><WhatsAppSupport /></>} />
          <Route path="/contact" element={<><Contact /><WhatsAppSupport /></>} />
          <Route path="/vehicle/:slug" element={<><VehicleDetail /><WhatsAppSupport /></>} />
          <Route path="/booking/:slug" element={<><Booking /><WhatsAppSupport /></>} />
          <Route path="/auth" element={<><Auth /><WhatsAppSupport /></>} />
          <Route path="/password-reset" element={<><PasswordResetRequest /><WhatsAppSupport /></>} />
          <Route path="/password-reset-confirm" element={<><PasswordResetConfirm /><WhatsAppSupport /></>} />
          <Route path="/verify-email/:uid/:token" element={<><EmailVerification /><WhatsAppSupport /></>} />
          <Route path="/customer/dashboard" element={<ProtectedRoute role='customer'><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
