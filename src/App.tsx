import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Fleet from "./pages/Fleet";
import Contact from "./pages/Contact";
import VehicleDetail from "./pages/VehicleDetail";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/auth" element={<Auth />} />
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
