import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "@/components/admindashboard/SidebarNav";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import OverviewSection from "@/components/admindashboard/OverviewSection";
import VehiclesSection from "@/components/admindashboard/VehiclesSection";
import UserSection from "@/components/admindashboard/UsersSection";
import BookingSection from "@/components/admindashboard/BookingsSection";
import DamageReportsSection from "@/components/admindashboard/DamageReportsSection";
import LocationsSection from "@/components/admindashboard/LocationsSection";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<'overview' | 'vehicles' | 'users' | 'bookings' | 'reports' | 'locations'>('overview');

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.clear();
      window.location.href = "/";
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav activeView={activeView} onChange={setActiveView} />
        <main className="flex-1">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <h1 className="font-heading text-xl md:text-2xl font-bold capitalize">
                  {activeView === 'overview'
                    ? 'Dashboard Overview'
                    : activeView === 'vehicles'
                    ? 'Vehicle Inventory'
                    : activeView === 'users'
                    ? 'User Management'
                    : activeView === 'reports'
                    ? 'Damage Reports'
                    : activeView === 'locations'
                    ? 'Locations Management'
                    : 'Bookings Management'}
                </h1>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          <div className="p-6">
            {activeView === "overview" && <OverviewSection />}
            {activeView === "vehicles" && <VehiclesSection />}
            {activeView === "users" && <UserSection />}
            {activeView === "bookings" && <BookingSection />}
            {activeView === "reports" && <DamageReportsSection />}
            {activeView === "locations" && <LocationsSection />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
