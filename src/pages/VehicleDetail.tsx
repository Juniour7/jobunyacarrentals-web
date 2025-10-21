import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Calendar, Users, Gauge, Fuel, Settings, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { vehiclesAPI, bookingsAPI } from "@/services/api";
import { Vehicle } from "@/types/vehicle";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await vehiclesAPI.getById(id!);
        const v = response.data;
        setVehicle({
          id: v.id.toString(),
          name: v.name,
          category: v.car_type,
          pricePerDay: parseFloat(v.daily_rate),
          rating: 4.5,
          image: v.image.startsWith("http") ? v.image : `https://giftmacvane.pythonanywhere.com${v.image}`,
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
        });
      } catch (error) {
        toast.error("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVehicle();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to make a booking");
      navigate("/auth");
      return;
    }

    try {
      await bookingsAPI.create({
        vehicle: parseInt(id!),
        start_date: bookingData.startDate,
        end_date: bookingData.endDate
      });
      toast.success("Booking request submitted successfully!");
      setBookingData({ startDate: "", endDate: "" });
      navigate("/customer-dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Vehicle Not Found</h1>
          <Link to="/fleet">
            <Button variant="accent">Back to Fleet</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <Link to="/fleet" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fleet
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vehicle Image */}
            <div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Vehicle Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold tracking-wider text-accent">
                  {vehicle.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-medium">{vehicle.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
                {vehicle.name}
              </h1>
              
              <div className="flex items-baseline mb-8">
                <span className="text-sm text-muted-foreground mr-2">From</span>
                <span className="text-accent font-bold text-3xl">
                  KES {vehicle.pricePerDay.toLocaleString()}
                </span>
                <span className="text-muted-foreground ml-1">/day</span>
              </div>
              
              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <p className="font-semibold">{vehicle.seats} seater</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                  <Settings className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                    <p className="font-semibold">{vehicle.transmission}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                  <Fuel className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p className="font-semibold">{vehicle.fuelType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                  <Gauge className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mileage</p>
                    <p className="font-semibold">{vehicle.mileage}</p>
                  </div>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="accent" size="lg" className="w-full mb-4" disabled={!vehicle.available}>
                    {vehicle.available ? "Book Now" : "Currently Unavailable"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Book {vehicle.name}</DialogTitle>
                    <DialogDescription>
                      Fill in your details and rental dates to proceed with booking.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={bookingData.startDate}
                          onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={bookingData.endDate}
                          onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                          required
                          min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" variant="accent" className="w-full" size="lg">
                      Submit Booking Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Detailed Specifications */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-bold mb-8">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-accent" />
                  Engine & Performance
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine</span>
                    <span className="font-medium">{vehicle.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Power</span>
                    <span className="font-medium">{vehicle.enginePower}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Torque</span>
                    <span className="font-medium">{vehicle.engineTorque}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Fuel className="w-5 h-5 mr-2 text-accent" />
                  Fuel Economy
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{vehicle.fuelEconomy.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Highway</span>
                    <span className="font-medium">{vehicle.fuelEconomy.highway}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent" />
                  Rental Terms
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Period</span>
                    <span className="font-medium">{vehicle.minimumHirePeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage</span>
                    <span className="font-medium">{vehicle.mileage}</span>
                  </div>
                </div>
              </div>
              
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="p-6 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-2 text-sm">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VehicleDetail;
