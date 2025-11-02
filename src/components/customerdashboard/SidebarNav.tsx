import { Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton
} from "@/components/ui/sidebar";
import { Car, Calendar, FileWarning, Home, User, MessageCircle } from "lucide-react";

interface SidebarNavProps {
  activeView: string;
  setActiveView: (v: any) => void;
}

const SidebarNav = ({ activeView, setActiveView }: SidebarNavProps) => (
  <Sidebar className="border-r">
    <div className="p-6 border-b">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
          <Car className="w-6 h-6 text-background" />
        </div>
        <span className="font-heading text-lg font-semibold">Jobunya Cars</span>
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Support</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default SidebarNav;
