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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const VehiclesSection = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicleSlug, setDeleteVehicleSlug] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState({
    name: "",
    model: "",
    car_type: "",
    description: "",
    seats: "",
    transmission: "",
    fuel_type: "",
    daily_rate: "",
    status: "Available",
    features: "",
    min_days: "1",
    engine: "",
    engine_torque: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  
  Object.entries(vehicleData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Append images
  if (imageFile) {
    formData.append("image", imageFile);
  }
  if (additionalImages) {
    Array.from(additionalImages).forEach((img) => {
      formData.append("images", img);
    });
  }

  try {
    if (editingVehicle) {
      await vehiclesAPI.update(editingVehicle.slug, formData);
      toast.success("Vehicle updated successfully!");
    } else {
      await vehiclesAPI.create(formData);
      toast.success("Vehicle added successfully!");
    }
    setIsDialogOpen(false);
    resetForm();
    loadVehicles();
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to save vehicle");
  }
};


  const handleEdit = (vehicle: Vehicle) => {
  setEditingVehicle(vehicle);
  setVehicleData({
    name: vehicle.name || "",
    model: vehicle.engine || "",
    car_type: vehicle.category || "",
    description: vehicle.description || "",
    seats: vehicle.seats?.toString() || "1",
    transmission: vehicle.transmission || "",
    fuel_type: vehicle.fuelType || "",
    daily_rate: vehicle.pricePerDay?.toString() || "0",
    status: vehicle.available ? "Available" : "Unavailable",
    features: vehicle.features?.join(", ") || "",
    min_days: vehicle.min_days?.toString() || "1",
    engine: vehicle.engine || "",
    engine_torque: vehicle.engine_torque || "",
  });
  setIsDialogOpen(true);
};


  const handleDelete = async () => {
    if (!deleteVehicleSlug) return;
    try {
      await vehiclesAPI.delete(deleteVehicleSlug);
      toast.success("Vehicle deleted successfully!");
      setDeleteVehicleSlug(null);
      loadVehicles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const resetForm = () => {
    setVehicleData({
      name: "",
      model: "",
      car_type: "",
      description: "",
      seats: "",
      transmission: "",
      fuel_type: "",
      daily_rate: "",
      status: "Available",
      features: "",
    });
    setImageFile(null);
    setAdditionalImages(null);
    setEditingVehicle(null);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Vehicle Name</Label>
                <Input id="name" value={vehicleData.name} onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" value={vehicleData.model} onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="car_type">Car Type</Label>
                <Select value={vehicleData.car_type} onValueChange={(value) => setVehicleData({ ...vehicleData, car_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="seats">Seats</Label>
                <Input id="seats" type="number" value={vehicleData.seats} onChange={(e) => setVehicleData({ ...vehicleData, seats: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={vehicleData.transmission} onValueChange={(value) => setVehicleData({ ...vehicleData, transmission: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select value={vehicleData.fuel_type} onValueChange={(value) => setVehicleData({ ...vehicleData, fuel_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="min_days">Minimum Hire Days</Label>
    <Input
      id="min_days"
      type="number"
      value={vehicleData.min_days}
      onChange={(e) => setVehicleData({ ...vehicleData, min_days: e.target.value })}
      required
    />
  </div>
</div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="engine">Engine</Label>
    <Input
      id="engine"
      value={vehicleData.engine}
      onChange={(e) => setVehicleData({ ...vehicleData, engine: e.target.value })}
    />
  </div>
  <div>
    <Label htmlFor="engine_torque">Engine Torque</Label>
    <Input
      id="engine_torque"
      value={vehicleData.engine_torque}
      onChange={(e) => setVehicleData({ ...vehicleData, engine_torque: e.target.value })}
    />
  </div>
</div>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily_rate">Daily Rate (KES)</Label>
                <Input id="daily_rate" type="number" value={vehicleData.daily_rate} onChange={(e) => setVehicleData({ ...vehicleData, daily_rate: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={vehicleData.status} onValueChange={(value) => setVehicleData({ ...vehicleData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Booked">Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={vehicleData.description} onChange={(e) => setVehicleData({ ...vehicleData, description: e.target.value })} rows={3} />
            </div>

            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input id="features" value={vehicleData.features} onChange={(e) => setVehicleData({ ...vehicleData, features: e.target.value })} placeholder="Air conditioning, Bluetooth, Rear Camera" />
            </div>

            <div>
              <Label htmlFor="image">Main Vehicle Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>

            <div>
              <Label htmlFor="additional-images">Additional Images (optional)</Label>
              <Input 
                id="additional-images" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => setAdditionalImages(e.target.files)} 
              />
              <p className="text-xs text-muted-foreground mt-1">You can select multiple images</p>
            </div>

            <Button type="submit" variant="accent" className="w-full">
              {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
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
                    <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 object-contain rounded-lg" />
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
                  <div>
                    <span className="text-sm text-muted-foreground">Price per Day:</span>
                    <span className="text-lg font-bold text-accent ml-2">KES {vehicle.pricePerDay.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteVehicleSlug(vehicle.slug)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteVehicleSlug} onOpenChange={(open) => !open && setDeleteVehicleSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehiclesSection;
