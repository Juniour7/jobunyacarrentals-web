import { Menu, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const DashboardHeader = ({ title, onLogout }: { title: string; onLogout: () => void }) => (
  <header className="border-b bg-background sticky top-0 z-10">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <h1 className="font-heading text-xl md:text-2xl font-bold">{title}</h1>
      </div>
      <Button variant="ghost" size="sm" onClick={onLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  </header>
);

export default DashboardHeader;
