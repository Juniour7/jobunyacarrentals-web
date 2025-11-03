import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react"; // 🔄 Added Reset Icon
import { vehiclesAPI } from "@/services/api";
import { toast } from "sonner";
import { Vehicle } from "@/types/vehicle";
import { useLocation } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const Fleet = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Pre-fill filters from homepage query params
  const [selectedCategory, setSelectedCategory] = useState<string>(
    queryParams.get("car_type") || "ANY_CATEGORY"
  );
  const [startDate, setStartDate] = useState(queryParams.get("start_date") || "");
  const [endDate, setEndDate] = useState(queryParams.get("end_date") || "");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("ANY_TRANSMISSION");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("ANY_FUEL");
  const [seatFilter, setSeatFilter] = useState("ANY_SEATS");
  const [availabilityFilter, setAvailabilityFilter] = useState("ANY_AVAILABILITY");

  // Price Range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [priceLimits, setPriceLimits] = useState<[number, number]>([0, 1000]);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const params: any = { page_size: 1000 };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== "ANY_CATEGORY") params.car_type = selectedCategory;
        if (transmissionFilter !== "ANY_TRANSMISSION")
          params.transmission = transmissionFilter;
        if (fuelTypeFilter !== "ANY_FUEL") params.fuel_type = fuelTypeFilter;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

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
          available: v.status === "Available",
          features: v.features ? v.features.split(",").map((f: string) => f.trim()) : [],
        }));

        const prices = apiVehicles.map((v) => v.pricePerDay);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceLimits([minPrice, maxPrice]);

        // Set initial range only once
        setPriceRange((prev) =>
          prev[0] === 0 && prev[1] === 1000 ? [minPrice, maxPrice] : prev
        );

        setAllVehicles(apiVehicles);
        setVehicles(apiVehicles);
      } catch (error) {
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [
    searchTerm,
    selectedCategory,
    transmissionFilter,
    fuelTypeFilter,
    startDate,
    endDate,
  ]);

  // Apply filters locally
  useEffect(() => {
    if (allVehicles.length === 0) return;

    const filtered = allVehicles.filter((v) => {
      const withinPrice =
        v.pricePerDay >= priceRange[0] && v.pricePerDay <= priceRange[1];
      const matchesSeats =
        seatFilter === "ANY_SEATS" || v.seats.toString() === seatFilter;
      const matchesAvailability =
        availabilityFilter === "ANY_AVAILABILITY" ||
        (availabilityFilter === "AVAILABLE" && v.available) ||
        (availabilityFilter === "UNAVAILABLE" && !v.available);

      return withinPrice && matchesSeats && matchesAvailability;
    });

    setVehicles(filtered);
  }, [priceRange, seatFilter, availabilityFilter, allVehicles]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ANY_CATEGORY");
    setTransmissionFilter("ANY_TRANSMISSION");
    setFuelTypeFilter("ANY_FUEL");
    setSeatFilter("ANY_SEATS");
    setAvailabilityFilter("ANY_AVAILABILITY");
    setPriceRange(priceLimits);
    setStartDate("");
    setEndDate("");
  };

  // Group vehicles by category
  const groupedVehicles = vehicles.reduce((acc: Record<string, Vehicle[]>, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {});

  const categoryOrder = [
    "Small Car",
    "Medium Car",
    "Mid-Size Car",
    "SUV Car",
    "Luxury Car",
    "Luxury SUV",
    "Minivan",
    "Passenger Van",
    "Bus",
    "Safari Vehicle",
  ];

  const sortedGroups = Object.entries(groupedVehicles).sort(
    ([a], [b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  const categories = ["ANY_CATEGORY", ...categoryOrder];
  const transmissions = ["ANY_TRANSMISSION", "Automatic", "Manual"];
  const fuelTypes = ["ANY_FUEL", "Petrol", "Diesel", "Hybrid", "Electric"];
  const seatOptions = ["ANY_SEATS", "2", "4", "5", "7", "8", "12"];
  const availabilityOptions = ["ANY_AVAILABILITY", "AVAILABLE", "UNAVAILABLE"];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-4">
              Our Fleet
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of premium vehicles, each meticulously
              maintained for luxury and performance.
            </p>
          </div>

          {/* Filters Section */}
          <div className="space-y-6 mb-12 bg-gray-50 rounded-2xl p-6 shadow-sm">
            {/* Search Bar */}
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

            {/* Filter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Category */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "ANY_CATEGORY" ? "Any Category" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Transmission */}
              <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "ANY_TRANSMISSION" ? "Any Transmission" : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Fuel Type */}
              <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f === "ANY_FUEL" ? "Any Fuel Type" : f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Seats */}
              <Select value={seatFilter} onValueChange={setSeatFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seats" />
                </SelectTrigger>
                <SelectContent>
                  {seatOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "ANY_SEATS" ? "Any Seats" : `${s} Seats`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Availability */}
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a === "ANY_AVAILABILITY"
                        ? "Any Availability"
                        : a === "AVAILABLE"
                        ? "Available"
                        : "Unavailable"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Daily Rate Range (Ksh. {priceRange[0]} – Ksh. {priceRange[1]})
              </label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={priceLimits[0]}
                max={priceLimits[1]}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Ksh. {priceLimits[0]}</span>
                <span>Ksh. {priceLimits[1]}</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg shadow transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Vehicle Display */}
          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
            </div>
          ) : sortedGroups.length > 0 ? (
            sortedGroups.map(([category, cars]) => (
              <div key={category} className="mb-16">
                <h2 className="text-3xl font-bold mb-6 border-b pb-2">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cars.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No vehicles found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Fleet;
