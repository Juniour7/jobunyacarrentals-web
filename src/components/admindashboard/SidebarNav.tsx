import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Car, Users, BarChart3, LogOut, Home, Calendar, FileWarning } from "lucide-react";
import {authAPI} from '@/services/api'
import { toast } from "sonner";

interface Props {
  activeView: string;
  onChange: (view: "overview" | "vehicles" | "users" | "bookings" | "reports") => void;
}

const handleLogout = async () => {
  try {
    await authAPI.logout();
    localStorage.removeItem('token'); // your token key
    localStorage.removeItem('user');  // user info
    // Axios header is dynamically set, no need to delete here
    window.location.href = "/";
    toast.success("Logged out successfully!");
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Failed to logout");
  }
};

const SidebarNav = ({ activeView, onChange }: Props) => (
  <Sidebar className="border-r">
    <div className="p-6 border-b">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
          <Car className="w-6 h-6 text-background" />
        </div>
        <span className="font-heading text-lg font-semibold">Jobunya Cars</span>
      </Link>
    </div>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onChange("overview")} isActive={activeView === "overview"}>
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onChange("vehicles")} isActive={activeView === "vehicles"}>
                <Car className="w-4 h-4" />
                <span>Vehicles</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onChange("users")} isActive={activeView === "users"}>
                <Users className="w-4 h-4" />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onChange("bookings")} isActive={activeView === "bookings"}>
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onChange("reports")} isActive={activeView === "reports"}>
                <FileWarning className="w-4 h-4" />
                <span>Damage Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default SidebarNav;
