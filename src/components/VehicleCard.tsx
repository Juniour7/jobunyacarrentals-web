import { Vehicle } from "@/types/vehicle";
import { Button } from "./ui/button";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {!vehicle.available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="bg-background px-4 py-2 rounded-md font-medium">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider text-accent">
            {vehicle.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{vehicle.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="font-heading text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
          {vehicle.name} 
        </h3>
        
        <div className="flex items-baseline mb-4">
          <span className="text-sm text-muted-foreground mr-1">From</span>
          <span className="text-accent font-bold text-lg">
            KES {vehicle.pricePerDay.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        
        <Link to={`/vehicle/${vehicle.slug}`}>
          <Button variant="accent" className="w-full group" disabled={!vehicle.available}>
            Explore
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
