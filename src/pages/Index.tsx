import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/vehicle";
import { vehiclesAPI } from "@/services/api";
import { ArrowRight, Shield, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehiclesAPI.getAll();
        const apiVehicles = response.data.results.map((v: any) => ({
          id: v.id.toString(),
          name: v.name,
          slug: v.slug,
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

        // Select 3 featured vehicles (first 3 available)
        const featured = apiVehicles
          .filter((v: Vehicle) => v.available)
          .slice(0, 3);

        setFeaturedVehicles(featured);
      } catch (error) {
        toast.error("Failed to load featured vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary to-background lg:min-h-screen flex flex-col justify-center items-center">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Elevate Your Journey
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience unparalleled luxury with our curated fleet of premium vehicles. 
            For discerning clients who demand excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/fleet">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                View Our Fleet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular luxury vehicles, available for immediate rental
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading featured vehicles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          {!loading && featuredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured vehicles available right now.</p>
            </div>
          )}

          <div className="text-center">
            <Link to="/fleet">
              <Button variant="accent" size="lg">
                View Full Fleet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
