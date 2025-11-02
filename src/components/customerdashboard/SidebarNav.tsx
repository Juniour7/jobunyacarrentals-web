import { Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from "@/components/ui/sidebar";
import { Car, Calendar, FileWarning, Home, User } from "lucide-react";

interface SidebarNavProps {
  activeView: string;
  setActiveView: (v: any) => void;
}

const SidebarNav = ({ activeView, setActiveView }: SidebarNavProps) => (
  <Sidebar className="border-r">
    <div className="py-2 border-b">
      <Link to="/" className="flex justify-center items-center gap-2">
        <img 
              src="/jobunya.png" 
              alt="" 
              className="w-[5rem]"
            />
      </Link>
    </div>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Customer Portal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {[
              { key: "bookings", label: "My Bookings", icon: Calendar },
              { key: "reports", label: "Damage Reports", icon: FileWarning },
              { key: "profile", label: "My Profile", icon: User },
            ].map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  onClick={() => setActiveView(item.key as any)}
                  isActive={activeView === item.key}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <Home className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default SidebarNav;
