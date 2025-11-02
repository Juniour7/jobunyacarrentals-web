import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Calendar, Users, Gauge, Fuel, Settings, Zap, X, Check, CircleCheckBig } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { vehiclesAPI, bookingsAPI } from "@/services/api";
import { Vehicle } from "@/types/vehicle";
import VehicleCard from "@/components/VehicleCard";

const VehicleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({ startDate: "", endDate: "" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!slug) return;
      try {
        const response = await vehiclesAPI.getBySlug(slug);
        const v = response.data;
        const mainImage = v.image.startsWith("http")
          ? v.image
          : `https://giftmacvane.pythonanywhere.com${v.image}`;

        setVehicle({
          id: v.id.toString(),
          name: v.name,
          status: v.status,
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
          enginePower: "N/A",
          engineTorque: v.engine_torque || "N/A",
          fuelEconomy: { city: "N/A", highway: "N/A" },
          available: v.status === "Available",
          features: v.features ? v.features.split(",").map((f: string) => f.trim()) : [],
          images: v.images || [],
        });

        setSelectedImage(mainImage);

        // Fetch similar vehicles
        const similarResponse = await vehiclesAPI.getAll({ car_type: v.car_type });
        const similar = similarResponse.data.results
          .filter((sv: any) => sv.slug !== slug)
          .slice(0, 3)
          .map((sv: any) => ({
            id: sv.id.toString(),
            slug: sv.slug,
            name: sv.name,
            status: v.status,
            category: sv.car_type,
            pricePerDay: parseFloat(sv.daily_rate),
            rating: 4.5,
            image: sv.image.startsWith("http") ? sv.image : `https://giftmacvane.pythonanywhere.com${sv.image}`,
            seats: sv.seats,
            transmission: sv.transmission,
            fuelType: sv.fuel_type,
            mileage: "Unlimited",
            min_days: sv.min_days ?? 1,
            engine: sv.engine,
            enginePower: "N/A",
            engineTorque: "N/A",
            fuelEconomy: { city: "N/A", highway: "N/A" },
            available: sv.status === "Available",
            features: sv.features ? sv.features.split(",").map((f: string) => f.trim()) : [],
            description: sv.description,
          }));
        setSimilarVehicles(similar);
      } catch (error) {
        toast.error("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [slug]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to make a booking");
      navigate("/auth");
      return;
    }

    if (!vehicle) {
      toast.error("Vehicle data not loaded yet");
      return;
    }

    try {
      await bookingsAPI.create({
        vehicle: parseInt(vehicle.id),
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
      });
      toast.success("Booking request submitted successfully!");
      setBookingData({ startDate: "", endDate: "" });
      navigate("/customer/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
      </div>

    );

  if (!vehicle)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Vehicle Not Found</h1>
          <Link to="/fleet">
            <Button variant="accent">Back to Fleet</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 ">
        <div className="container mx-auto max-w-6xl">
          <Link
            to="/fleet"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fleet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vehicle Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <h1 className="text-4xl font-heading">{vehicle.name} for Hire</h1>
              <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                <motion.img
                  key={selectedImage}
                  src={selectedImage || vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-contain  transition-transform duration-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Thumbnails */}
              {vehicle.images && vehicle.images.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {[vehicle.image, ...vehicle.images.map(img =>
                    img.image.startsWith("http")
                      ? img.image
                      : `https://giftmacvane.pythonanywhere.com${img.image}`
                  )].map((img, index) => (
                    <motion.img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-16 object-contain rounded-lg cursor-pointer border-2 transition-all ${
                        selectedImage === img ? "border-accent scale-105" : "border-transparent hover:opacity-80"
                      }`}
                      onClick={() => setSelectedImage(img)}
                      whileHover={{ scale: 1.05 }}
                    />
                  ))}
                </div>
              )}

              {/* Lightbox Modal */}
              <AnimatePresence>
                {lightboxOpen && (
                  <motion.div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setLightboxOpen(false)}
                      className="absolute top-6 right-6 text-white hover:text-accent transition"
                    >
                      <X className="w-8 h-8" />
                    </button>

                    {/* Enlarged Image */}
                    <motion.img
                      key={selectedImage}
                      src={selectedImage || vehicle.image}
                      alt="Zoomed vehicle"
                      className="max-w-[90%] max-h-[85%] object-contain rounded-lg shadow-2xl"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
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

              <h1 className="font-heading text-xl font-bold mb-4">
                {vehicle.name} Overview
              </h1>

              <p className="text-sm text-[#6c7189] mb-3">{vehicle.description}</p>

              <div className="mb-8">
  <h2 className="font-heading text-xl font-semibold mb-4">{vehicle.name} Details</h2>
  <div className="border border-muted rounded-lg overflow-hidden text-sm">
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Seats</span>
      <span className="font-medium">{vehicle.seats} seater</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Transmission</span>
      <span className="font-medium">{vehicle.transmission}</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Minimum Hire Period</span>
      <span className="font-medium">{vehicle.min_days} days</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Mileage</span>
      <span className="font-medium">{vehicle.mileage}</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Fuel Type</span>
      <span className="font-medium">{vehicle.fuelType}</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Engine</span>
      <span className="font-medium">{vehicle.engine}</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Engine Power</span>
      <span className="font-medium">{vehicle.enginePower}</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Engine Torque</span>
      <span className="font-medium">{vehicle.engineTorque}</span>
    </div>
    <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
      <span className="text-muted-foreground">Fuel Economy</span>
      <span className="font-medium">
        City: {vehicle.fuelEconomy.city} | Highway: {vehicle.fuelEconomy.highway}
      </span>
    </div>
    {vehicle.features.length > 0 && (
      <div className="grid grid-cols-2 even:bg-muted/5 odd:bg-muted px-4 py-2">
        <span className="text-muted-foreground">Features</span>
        <ul className="list-none list-inside text-sm text-muted-foreground">
          {vehicle.features.map((feature, i) => (
            <li key={i} className="text-foreground flex items-center gap-1"><span><CircleCheckBig className="w-3 h-3" /></span>{feature}</li>

          ))}
        </ul>
      </div>
    )}
  </div>
</div>


              <div className="flex items-baseline mb-8">
                <span className="text-sm text-muted-foreground mr-2">From</span>
                <span className="text-accent font-bold text-3xl">
                  KES {vehicle.pricePerDay.toLocaleString()}
                </span>
                <span className="text-muted-foreground ml-1">/day</span>
              </div>

              
              {/* Booking Button */}
              <Button
                variant="accent"
                size="lg"
                className="w-full mb-4"
                disabled={!vehicle.available}
                onClick={() => navigate(`/booking/${vehicle.slug}`)}
              >
                {vehicle.available ? "Reserve Now & Pay Later" : "Currently Reserved"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Vehicles Section */}
      {similarVehicles.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto ">
            <h2 className="font-heading text-3xl font-bold mb-8">Similar Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default VehicleDetail;
