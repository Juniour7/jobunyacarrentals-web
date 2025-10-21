import { useEffect, useState } from "react";
import { toast } from "sonner";
import { vehiclesAPI } from "@/services/api";
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const VehiclesSection = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState({ name: "", category: "", pricePerDay: "", seats: "" });

  const loadVehicles = async () => {
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
        features: v.features ? v.features.split(",").map((f: string) => f.trim()) : [],
      }));
      setVehicles(apiVehicles);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Vehicle added successfully!");
              setVehicleData({ name: "", category: "", pricePerDay: "", seats: "" });
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Vehicle Name</Label>
              <Input id="name" value={vehicleData.name} onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={vehicleData.category} onChange={(e) => setVehicleData({ ...vehicleData, category: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="price">Price per Day (KES)</Label>
              <Input id="price" type="number" value={vehicleData.pricePerDay} onChange={(e) => setVehicleData({ ...vehicleData, pricePerDay: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="seats">Seats</Label>
              <Input id="seats" type="number" value={vehicleData.seats} onChange={(e) => setVehicleData({ ...vehicleData, seats: e.target.value })} required />
            </div>
            <Button type="submit" variant="accent" className="w-full">
              Add Vehicle
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <div className="grid gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div>
                      <CardTitle>{vehicle.name}</CardTitle>
                      <CardDescription>
                        {vehicle.category} • {vehicle.seats} seats
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={vehicle.available ? "default" : "destructive"}>
                    {vehicle.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price per Day:</span>
                  <span className="text-lg font-bold text-accent">KES {vehicle.pricePerDay.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclesSection;
