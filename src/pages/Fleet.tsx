import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { vehiclesAPI } from "@/services/api";
import { toast } from "sonner";
import { Vehicle } from "@/types/vehicle";

const Fleet = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("ALL");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== "ALL") params.car_type = selectedCategory;
        if (transmissionFilter !== "ALL") params.transmission = transmissionFilter;
        if (fuelTypeFilter !== "ALL") params.fuel_type = fuelTypeFilter;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        
        const response = await vehiclesAPI.getAll(params);
        const apiVehicles = response.data.results.map((v: any) => ({
          id: v.id.toString(),
          name: v.name,
          slug: v.slug,
          category: v.car_type,
          status: v.status,
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
  }, [searchTerm, selectedCategory, transmissionFilter, fuelTypeFilter, minPrice, maxPrice]);
  
  const categories = ["ALL", "Sedan", "SUV", "Luxury", "Sports"];
  const transmissions = ["ALL", "Automatic", "Manual"];
  const fuelTypes = ["ALL", "Petrol", "Diesel"];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20">
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
          
          {/* Search and Filter */}
          <div className="space-y-4 mb-12">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map((trans) => (
                    <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          
          {/* Vehicle Grid */}
          {loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
          
          {!loading && vehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No vehicles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Fleet;
