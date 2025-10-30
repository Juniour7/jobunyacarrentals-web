import { Vehicle } from "@/types/vehicle";
import { Button } from "./ui/button";
import { Star, ArrowRight, CircleCheckBig, Sun, Users, Fuel } from "lucide-react";
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
        <div className="absolute top-3 right-3 space-y-2">
          {vehicle.status == 'Available' && (
            <div className="bg-[#dcfce7] text-[#22c55e] rounded-md p-1 flex justify-center items-center gap-1 text-xs">
              <span><CircleCheckBig className="w-3 h-3" /></span>
              Available
            </div>
          )}
          {vehicle.status == 'Booked' && (
            <div className="bg-[#ef4343]/10 text-[#ef4343] rounded-md p-1 flex justify-center items-center gap-1 text-xs">
              <span><CircleCheckBig className="w-3 h-3" /></span>
              Booked
            </div>
          )}
          {vehicle.features?.includes('Sunroof') && (
            <div className="bg-[#fef3c7] text-[#b16e26] rounded-md p-1 flex justify-center items-center gap-1 text-xs">
              <span><Sun className="w-3 h-3" /></span>
              Sunroof
            </div>
          )}
          <div className="bg-[#f3e8ff] text-[#6b3ac1] rounded-md p-1 flex justify-center items-center gap-1 text-xs">
            <span><Users className="w-3 h-3" /></span>
            {vehicle.seats} Seater
          </div>
          <div className="bg-[#dbeafe] text-[#005a7a] rounded-md p-1 flex justify-center items-center gap-1 text-xs">
            <span><Fuel className="w-3 h-3" /></span>
            {vehicle.fuelType}
          </div>
        </div>
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
            Reserve now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
