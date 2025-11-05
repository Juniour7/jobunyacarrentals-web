import { Car, Mail, Phone, MapPin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
              src="/logo.png" 
              alt="" 
              className="w-[5rem] md:w-[7rem]"
            />
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
              <li className=" text-sm text-background/70">
                <a href="tel:0723565952" className="flex items-center space-x-2 hover:text-[#07b6d5] transition-colors duration-300 ease-in-out">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+254 723 565 952</span>
                </a>
              </li>
              <li className=" text-sm text-background/70">
                <a href="mailto:info@jobunyacarrentals.co.ke" className="flex items-center space-x-2 hover:text-[#07b6d5] transition-colors duration-300 ease-in-out">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@jobunyacarrentals.co.ke</span>
                </a>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-heading text-lg font-semibold mb-4">Follow Us</h4>
              <a 
                href="https://facebook.com/jobunyacarrentals" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-background/70 hover:text-[#07b6d5] transition-colors duration-300 ease-in-out"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-sm text-background/70">
            © 2025 Jobunya Car Rentals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
