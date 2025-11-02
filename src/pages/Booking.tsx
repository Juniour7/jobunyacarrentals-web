import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Calendar, FileText, Loader2 } from "lucide-react";
import { vehiclesAPI, bookingsAPI, locationsAPI } from "@/services/api";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
}

const Booking = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        // Fetch vehicle
        const vehicleResponse = await vehiclesAPI.getBySlug(slug);
        const v = vehicleResponse.data;
        const mainImage = v.image.startsWith("http")
          ? v.image
          : `https://giftmacvane.pythonanywhere.com${v.image}`;

        setVehicle({
          id: v.id.toString(),
          name: v.name,
          model: v.model || "", 
         color: v.color || "",
          slug: v.slug,
          category: v.car_type,
          description: v.description,
          pricePerDay: parseFloat(v.daily_rate),
          rating: 4.5,
          image: mainImage,
          seats: v.seats,
          transmission: v.transmission,
          fuelType: v.fuel_type,
          mileage: "Unlimited",
          min_days: v.min_days ?? 1,
          engine: v.engine,
          engine_power: v.engine_power,
          engine_torque: v.engine_torque,
          fuelEconomy: { city: "N/A", highway: "N/A" },
          available: v.status === "Available",
          features: v.features ? v.features.split(",").map((f: string) => f.trim()) : [],
          status: v.status,
        });

        // Fetch locations
        const locationsResponse = await locationsAPI.getAll();
        setLocations(locationsResponse.data);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate || !vehicle) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days * vehicle.pricePerDay : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to make a booking");
      navigate("/auth");
      return;
    }

    if (!vehicle) return;

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days < vehicle.min_days) {
      toast.error(`Minimum rental period is ${vehicle.min_days} days`);
      return;
    }

    setSubmitting(true);

    try {
      await bookingsAPI.create({
        vehicle: parseInt(vehicle.id),
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        pickup_location: parseInt(bookingData.pickupLocation),   // snake_case for backend
        dropoff_location: parseInt(bookingData.dropoffLocation),
      });
      toast.success("Booking reservation successful! We'll contact you shortly.");
      navigate("/customer/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Vehicle Not Found</h1>
          <Button variant="accent" asChild>
            <Link to="/fleet">Back to Fleet</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto max-w-5xl">
          <Link
            to={`/vehicle/${vehicle.slug}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicle Details
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-heading font-bold mb-8">Complete Your Reservation</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Rental Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Pick-up Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={bookingData.startDate}
                            onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">Drop-off Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={bookingData.endDate}
                            onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                            required
                            min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <CardTitle className="font-heading flex items-center gap-2 text-lg">
                          <MapPin className="w-5 h-5" />
                          Location Details
                        </CardTitle>
                        <div>
                          <Label htmlFor="pickupLocation">Pick-up Location</Label>
                          <Select 
                            value={bookingData.pickupLocation} 
                            onValueChange={(value) => setBookingData({ ...bookingData, pickupLocation: value })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select pick-up location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id.toString()}>
                                  {location.name} - {location.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="dropoffLocation">Drop-off Location</Label>
                          <Select 
                            value={bookingData.dropoffLocation} 
                            onValueChange={(value) => setBookingData({ ...bookingData, dropoffLocation: value })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select drop-off location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id.toString()}>
                                  {location.name} - {location.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" className="w-full">
                              <FileText className="w-4 h-4 mr-2" />
                              View Terms & Conditions
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-heading text-2xl">Rental Terms & Conditions</DialogTitle>
                              <DialogDescription>
                                Please read our rental policy carefully before proceeding
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                              <div>
                                <h3 className="font-semibold mb-2">1. Rental Agreement</h3>
                                <p className="text-muted-foreground">
                                  By reserving a vehicle, you agree to comply with all terms and conditions outlined in this agreement.
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">2. Driver Requirements</h3>
                                <p className="text-muted-foreground">
                                  Driver must be at least 23 years old with a valid driver's license held for a minimum of 2 years.
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">3. Payment Terms</h3>
                                <p className="text-muted-foreground">
                                  Full payment is required at the time of vehicle collection. We accept cash, credit cards, and bank transfers.
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">4. Damage Policy</h3>
                                <p className="text-muted-foreground">
                                  The renter is responsible for any damage to the vehicle during the rental period. All damages must be reported immediately.
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">5. Cancellation Policy</h3>
                                <p className="text-muted-foreground">
                                  Cancellations made 48 hours before pick-up date will receive a full refund. Late cancellations may incur charges.
                                </p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">6. Return Policy</h3>
                                <p className="text-muted-foreground">
                                  Vehicle must be returned with the same fuel level as at pickup. Late returns will incur additional charges.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <Button 
                        type="submit" 
                        variant="accent" 
                        size="lg" 
                        className="w-full mt-6"
                        disabled={submitting || !vehicle.available || !bookingData.pickupLocation || !bookingData.dropoffLocation}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Reserve Now & Pay Later"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-heading">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-20 h-16 object-contain rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{vehicle.name}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Rate</span>
                        <span className="font-medium">KES {vehicle.pricePerDay.toLocaleString()}</span>
                      </div>
                      {bookingData.startDate && bookingData.endDate && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Number of Days</span>
                            <span className="font-medium">
                              {Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t">
                            <span className="font-semibold">Total Amount</span>
                            <span className="font-bold text-accent text-lg">
                              KES {total.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-secondary/50 p-3 rounded-lg text-sm">
                      <p className="text-muted-foreground">
                        <strong>Note:</strong> Payment is due upon vehicle collection. Your reservation will be confirmed after we review your request.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
