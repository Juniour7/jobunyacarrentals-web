import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/admindashboard/SidebarNav";
import OverviewSection from "@/components/admindashboard/OverviewSection";
import VehiclesSection from "@/components/admindashboard/VehiclesSection";
import UserSection from "@/components/admindashboard/UsersSection";
import BookingSection from "@/components/admindashboard/BookingsSection";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<'overview' | 'vehicles' | 'users' | 'bookings'>('overview');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav activeView={activeView} onChange={setActiveView} />
        <main className="flex-1">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <h1 className="font-heading text-2xl font-bold capitalize">
                {activeView === 'overview'
                  ? 'Dashboard Overview'
                  : activeView === 'vehicles'
                  ? 'Vehicle Inventory'
                  : activeView === 'users'
                  ? 'User Management'
                  : 'Bookings Management'}
              </h1>
            </div>
          </header>

          <div className="p-6">
            {activeView === "overview" && <OverviewSection />}
            {activeView === "vehicles" && <VehiclesSection />}
            {activeView === "users" && <UserSection />}
            {activeView === "bookings" && <BookingSection />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
