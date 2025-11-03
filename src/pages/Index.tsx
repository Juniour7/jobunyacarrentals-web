import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/vehicle";
import { vehiclesAPI } from "@/services/api";
import { ArrowRight, Calendar, Car, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// Landing Page Components
import WhyChooseUs from "@/components/landing-page/WhyChooseUs";
import TheExperience from "@/components/landing-page/TheExperience";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Testimonials from "@/components/landing-page/Testimonials";
import Cta from "@/components/landing-page/Cta";

const Index = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    startDate: "",
    endDate: "",
    vehicleType: "",
  });

  // Featured vehicle slugs
  const FEATURED_SLUGS = [
    "mercedes-benz-gle",
    "toyota-land-cruiser-v8-lc200-diesel",
    "mazda-cx5-petrol",
    "range-rover-vogue-1",
    "mazda-atenza-diesel",
    "lexus-rx-300",
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehiclesAPI.getAll();
        const apiVehicles = response.data.results.map((v: any) => ({
          id: v.id.toString(),
          name: v.name,
          slug: v.slug,
          category: v.car_type,
          description: v.description || "",
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
          features: v.features ? v.features.split(",").map((f: string) => f.trim()) : [],
        }));

        const featured = FEATURED_SLUGS
          .map((slug) => apiVehicles.find((v: any) => v.slug === slug))
          .filter(Boolean);

        setFeaturedVehicles(featured);
      } catch (error) {
        toast.error("Failed to load featured vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Navigate to fleet page with filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.vehicleType) params.append("car_type", searchData.vehicleType);
    if (searchData.startDate) params.append("start_date", searchData.startDate);
    if (searchData.endDate) params.append("end_date", searchData.endDate);
    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920"
          >
            <source src="https://res.cloudinary.com/dxvzdn2ao/video/upload/v1761888707/2229697-uhd_3840_2160_30fps_q9t8mg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto text-center max-w-5xl px-4 pt-32 pb-20"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
          >
            Experience Luxury on Every Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg"
          >
            Premium vehicles, exceptional service, unforgettable experiences
          </motion.p>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Card className="max-w-4xl mx-auto shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Pick-up Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      Pick-up Date
                    </label>
                    <Input
                      type="date"
                      value={searchData.startDate}
                      onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full"
                    />
                  </div>

                  {/* Drop-off Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      Drop-off Date
                    </label>
                    <Input
                      type="date"
                      value={searchData.endDate}
                      onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                      min={searchData.startDate || new Date().toISOString().split("T")[0]}
                      className="w-full"
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Car className="w-4 h-4 text-accent" />
                      Vehicle Type
                    </label>
                    <Select
                      value={searchData.vehicleType}
                      onValueChange={(value) => setSearchData({ ...searchData, vehicleType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Small Car">Small Car</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="accent" 
                    size="lg" 
                    className="w-full mt-6"
                    onClick={handleSearch}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Available Vehicles
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Experience */}
      <TheExperience />

      {/* How It Works */}
      <HowItWorks />

      {/* Featured Vehicles */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular luxury vehicles, available for immediate rental
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-muted border-t-accent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
            >
              {featuredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/fleet">
                <Button className="w-full md:w-auto" variant="accent" size="lg">
                  View Full Fleet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <Cta />

      <Footer />
    </div>
  );
};

export default Index;
