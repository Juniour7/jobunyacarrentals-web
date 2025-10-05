import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Car } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
              <Car className="w-7 h-7 text-background" />
            </div>
            <span className="font-heading text-xl font-semibold">EliteMotion</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/fleet" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/fleet') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Fleet
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/contact') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
