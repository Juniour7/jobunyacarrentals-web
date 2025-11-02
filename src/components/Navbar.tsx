import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Car, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface User {
  roles: "admin" | "customer";
  [key: string]: any;
}

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Determine dashboard link and label
  const dashboardLink = user
    ? user.roles === "admin"
      ? "/admin/dashboard"
      : "/customer/dashboard"
    : "/auth";

  const dashboardLabel = user ? "Dashboard" : "Login";

  const isHomePage = location.pathname === "/";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled || !isHomePage 
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="" 
              className="w-[5rem] md:w-[7rem]"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors",
                isActive('/') 
                  ? scrolled || !isHomePage ? 'text-foreground' : 'text-background font-semibold'
                  : scrolled || !isHomePage ? 'text-muted-foreground hover:text-foreground' : 'text-background/80 hover:text-background'
              )}
            >
              Home
            </Link>
            <Link 
              to="/fleet" 
              className={cn(
                "text-sm font-medium transition-colors",
                isActive('/fleet') 
                  ? scrolled || !isHomePage ? 'text-foreground' : 'text-background font-semibold'
                  : scrolled || !isHomePage ? 'text-muted-foreground hover:text-foreground' : 'text-background/80 hover:text-background'
              )}
            >
              Fleet
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "text-sm font-medium transition-colors",
                isActive('/contact') 
                  ? scrolled || !isHomePage ? 'text-foreground' : 'text-background font-semibold'
                  : scrolled || !isHomePage ? 'text-muted-foreground hover:text-foreground' : 'text-background/80 hover:text-background'
              )}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to={dashboardLink} className="hidden md:block bg-white rounded-md">
              <Button variant="ghost" size="sm">{dashboardLabel}</Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden bg-white">
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors py-2",
                      isActive('/') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/fleet" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors py-2",
                      isActive('/fleet') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Fleet
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors py-2",
                      isActive('/contact') ? 'text-accent font-semibold' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Contact
                  </Link>
                  <Link 
                    to={dashboardLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="pt-4 border-t"
                  >
                    <Button variant="default" className="w-full">{dashboardLabel}</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
