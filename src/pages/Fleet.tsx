import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { vehiclesAPI } from "@/services/api";
import { toast } from "sonner";
import { Vehicle } from "@/types/vehicle";

const Fleet = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehiclesAPI.getAll();
        const apiVehicles = response.data.results.map((v: any) => ({
          id: v.id.toString(),
          name: v.name,
          category: v.car_type,
          pricePerDay: parseFloat(v.daily_rate),
          rating: 4.5,
          image: v.image,
          seats: v.seats,
          transmission: v.transmission,
          fuelType: v.fuel_type,
          mileage: "Unlimited",
          minimumHirePeriod: "1 day",
          engine: v.model,
          enginePower: "N/A",
          engineTorque: "N/A",
          fuelEconomy: { city: "N/A", highway: "N/A" },
          available: v.status === "Available",
          features: v.features ? v.features.split(',').map((f: string) => f.trim()) : []
        }));
        setVehicles(apiVehicles);
      } catch (error) {
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);
  
  const categories = ["ALL", ...Array.from(new Set(vehicles.map(v => v.category)))];
  
  const filteredVehicles = selectedCategory === "ALL" 
    ? vehicles 
    : vehicles.filter(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-4">
              Our Fleet
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of premium vehicles, each meticulously maintained 
              to ensure the highest standards of luxury and performance.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Vehicle Grid */}
          {loading ? (
            <div className="text-center py-12">Loading vehicles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No vehicles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Fleet;
