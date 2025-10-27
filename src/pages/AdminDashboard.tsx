import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "@/components/admindashboard/SidebarNav";
import { Menu } from "lucide-react";
import OverviewSection from "@/components/admindashboard/OverviewSection";
import VehiclesSection from "@/components/admindashboard/VehiclesSection";
import UserSection from "@/components/admindashboard/UsersSection";
import BookingSection from "@/components/admindashboard/BookingsSection";
import DamageReportsSection from "@/components/admindashboard/DamageReportsSection";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<'overview' | 'vehicles' | 'users' | 'bookings' | 'reports'>('overview');

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
                    : 'Bookings Management'}
                </h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {activeView === "overview" && <OverviewSection />}
            {activeView === "vehicles" && <VehiclesSection />}
            {activeView === "users" && <UserSection />}
            {activeView === "bookings" && <BookingSection />}
            {activeView === "reports" && <DamageReportsSection />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
