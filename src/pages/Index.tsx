import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/vehicle";
import { vehiclesAPI } from "@/services/api";
import { ArrowRight, Shield, Clock, Sparkles, Star, CheckCircle2, Users, Award, Search, Calendar, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    startDate: "",
    endDate: "",
    vehicleType: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehiclesAPI.getAll();
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

        const featured = apiVehicles
          .filter((v: Vehicle) => v.available)
          .slice(0, 6);

        setFeaturedVehicles(featured);
      } catch (error) {
        toast.error("Failed to load featured vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.vehicleType) params.append("car_type", searchData.vehicleType);
    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Search */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920" 
            alt="Luxury car background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

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
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Car className="w-4 h-4 text-accent" />
                      Vehicle Type
                    </label>
                    <Select value={searchData.vehicleType} onValueChange={(value) => setSearchData({ ...searchData, vehicleType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
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

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Why Choose Jobunya Cars?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to delivering excellence in every aspect of your rental experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Fully Insured", description: "All our vehicles come with comprehensive insurance coverage for your peace of mind" },
              { icon: Clock, title: "24/7 Support", description: "Round-the-clock assistance whenever you need it, wherever you are" },
              { icon: Sparkles, title: "Premium Fleet", description: "Meticulously maintained luxury vehicles that exceed expectations" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 pb-8">
                    <motion.div 
                      className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    >
                      <item.icon className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
                The Jobunya Experience
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                At Jobunya Cars, we redefine luxury car rental. Our commitment to excellence ensures every journey 
                is extraordinary, from the moment you book to the final mile.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { title: "Premium Fleet", description: "Handpicked luxury vehicles maintained to perfection" },
                  { title: "24/7 Support", description: "Round-the-clock assistance for your peace of mind" },
                  { title: "Flexible Booking", description: "Easy online booking with transparent pricing" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/fleet">
                  <Button variant="accent" size="lg">
                    Explore Our Fleet
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800" 
                alt="Luxury car interior" 
                className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Booking your dream vehicle is simple and straightforward
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { step: "1", title: "Choose Your Vehicle", description: "Browse our premium fleet and select the perfect vehicle for your journey" },
              { step: "2", title: "Book Online", description: "Complete your booking in minutes with our simple online process" },
              { step: "3", title: "Hit the Road", description: "Pick up your vehicle and enjoy an unforgettable driving experience" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8">
                    <motion.div 
                      className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
                    >
                      <span className="text-3xl font-bold text-accent">{item.step}</span>
                    </motion.div>
                    <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
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

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Jobunya Cars
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Business Executive", rating: 5, text: "Exceptional service and stunning vehicles. The Mercedes G-Class exceeded all my expectations. Will definitely book again!" },
              { name: "Michael Chen", role: "Entrepreneur", rating: 5, text: "Professional, reliable, and luxurious. Jobunya made our wedding day even more special with their Range Rover. Highly recommended!" },
              { name: "Emily Rodriguez", role: "Travel Blogger", rating: 5, text: "The booking process was seamless and the 24/7 support gave me peace of mind. The Lexus was immaculate. Five stars!" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920" 
            alt="Luxury car" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-accent/90" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4 text-center text-white"
        >
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Book your premium vehicle today and elevate your journey with Jobunya Cars. 
            Exceptional service, unmatched quality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/fleet">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Our Fleet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-accent">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
