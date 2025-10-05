import { Car, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-heading text-xl font-semibold">EliteMotion</span>
            </div>
            <p className="text-sm text-background/70">
              Premium self-drive and chauffeured car rentals for discerning clients who demand excellence.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-background/70 hover:text-background transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/fleet" className="text-sm text-background/70 hover:text-background transition-colors">
                  Fleet
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-background/70 hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="text-sm text-background/70 hover:text-background transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="text-sm text-background/70 hover:text-background transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-background/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-background/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@elitemotion.co.ke</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-sm text-background/70">
            © 2025 EliteMotion Car Hire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
