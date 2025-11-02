import { useEffect, useState } from "react";
import { toast } from "sonner";
import { vehiclesAPI } from "@/services/api";
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const VehiclesSection = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicleSlug, setDeleteVehicleSlug] = useState<string | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [existingMainImage, setExistingMainImage] = useState<string | null>(
    null
  );
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<
    string[]
  >([]);

  // 🔽 Filters
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

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
    engine_power: "",
    color: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(
    null
  );

  const loadVehicles = async () => {
    try {
      const response = await vehiclesAPI.getAll();
      const apiVehicles = response.data.results.map((v: any) => ({
        id: v.id.toString(),
        slug: v.slug,
        name: v.name,
        model: v.model,
        category: v.car_type,
        color: v.color,
        description: v.description || "",
        pricePerDay: parseFloat(v.daily_rate),
        rating: 4.5,
        image: v.image,
        seats: v.seats,
        transmission: v.transmission,
        fuelType: v.fuel_type,
        mileage: "Unlimited",
        minimumHirePeriod: "1 day",
        engine: v.model,
        engine_power: v.engine_power,
        engine_torque: v.engine_torque,
        fuelEconomy: { city: "N/A", highway: "N/A" },
        available: v.status === "Available",
        features: v.features
          ? v.features.split(",").map((f: string) => f.trim())
          : [],
        images: v.images || [],
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
    setSaving(true);
    const formData = new FormData();

    Object.entries(vehicleData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (additionalImages) {
      Array.from(additionalImages).forEach((file) => {
        formData.append("images", file);
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
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);

    setVehicleData({
      name: vehicle.name || "",
      model: vehicle.model || "",
      car_type: vehicle.category || "",
      description: vehicle.description || "",
      seats: vehicle.seats?.toString() || "1",
      transmission: vehicle.transmission || "",
      fuel_type: vehicle.fuelType || "",
      daily_rate: vehicle.pricePerDay?.toString() || "0",
      status: vehicle.available ? "Available" : "Booked",
      features: vehicle.features?.join(", ") || "",
      min_days: vehicle.min_days?.toString() || "1",
      engine: vehicle.engine || "",
      engine_torque: vehicle.engine_torque || "",
      engine_power: vehicle.engine_power || "",
      color: vehicle.color || "",
    });

    setExistingMainImage(vehicle.image || null);
    setExistingAdditionalImages(
      vehicle.images ? vehicle.images.map((img: any) => img.image) : []
    );

    setImageFile(null);
    setAdditionalImages(null);
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
      min_days: "1",
      engine: "",
      engine_torque: "",
      engine_power: "",
      color: "",
    });
    setImageFile(null);
    setAdditionalImages(null);
    setEditingVehicle(null);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // 🔍 Apply filters
  const filteredVehicles = vehicles.filter((v) => {
    const matchesName = v.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "Available" && v.available) ||
      (statusFilter === "Booked" && !v.available);
    const matchesType =
      typeFilter === "ALL" || v.category === typeFilter;
    return matchesName && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-9 w-48"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Booked">Booked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="Small Car">Small Car</SelectItem>
              <SelectItem value="Medium Car">Medium Car</SelectItem>
              <SelectItem value="Mid-Size Car">Mid-Size Car</SelectItem>
              <SelectItem value="SUV Car">SUV Car</SelectItem>
              <SelectItem value="Luxury Car">Luxury Car</SelectItem>
              <SelectItem value="Luxury SUV">Luxury SUV</SelectItem>
              <SelectItem value="Minivan">Minivan</SelectItem>
              <SelectItem value="Passenger Van">Passenger Van</SelectItem>
              <SelectItem value="Bus">Bus</SelectItem>
              <SelectItem value="Safari Vehicle">Safari Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Add Vehicle Dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="w-4 h-4 mr-2" /> Add Vehicle
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
            </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="name">Vehicle Name</Label>
      <Input
        id="name"
        value={vehicleData.name}
        onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
        required
      />
    </div>
    <div>
      <Label htmlFor="model">Model (Year)</Label>
      <Input
        id="model"
        value={vehicleData.model}
        onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="car_type">Car Type</Label>
      <Select
        value={vehicleData.car_type}
        onValueChange={(value) => setVehicleData({ ...vehicleData, car_type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Small Car">Small Car</SelectItem>
          <SelectItem value="Medium Car">Medium Car</SelectItem>
          <SelectItem value="Mid-Size Car">Mid-Size Car</SelectItem>
          <SelectItem value="SUV Car">SUV Car</SelectItem>
          <SelectItem value="Luxury Car">Luxury Car</SelectItem>
          <SelectItem value="Luxury SUV">Luxury SUV</SelectItem>
          <SelectItem value="Minivan">Minivan</SelectItem>
          <SelectItem value="Passenger Van">Passenger Van</SelectItem>
          <SelectItem value="Bus">Bus</SelectItem>
          <SelectItem value="Safari Vehicle">Safari Vehicle</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label htmlFor="color">Color</Label>
      <Input
        id="color"
        value={vehicleData.color}
        onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
        placeholder="e.g. Black, White"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="seats">Seats</Label>
      <Input
        id="seats"
        type="number"
        value={vehicleData.seats}
        onChange={(e) => setVehicleData({ ...vehicleData, seats: e.target.value })}
        required
      />
    </div>
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
      <Label htmlFor="transmission">Transmission</Label>
      <Select
        value={vehicleData.transmission}
        onValueChange={(value) => setVehicleData({ ...vehicleData, transmission: value })}
      >
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
      <Select
        value={vehicleData.fuel_type}
        onValueChange={(value) => setVehicleData({ ...vehicleData, fuel_type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select fuel type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Petrol">Petrol</SelectItem>
          <SelectItem value="Diesel">Diesel</SelectItem>
          <SelectItem value="Hybrid">Hybrid</SelectItem>
          <SelectItem value="Electric">Electric</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="engine">Engine</Label>
      <Input
        id="engine"
        value={vehicleData.engine}
        onChange={(e) => setVehicleData({ ...vehicleData, engine: e.target.value })}
        placeholder="e.g. 1.5L Petrol I4"
      />
    </div>
    <div>
      <Label htmlFor="engine_power">Engine Power</Label>
      <Input
        id="engine_power"
        value={vehicleData.engine_power}
        onChange={(e) => setVehicleData({ ...vehicleData, engine_power: e.target.value })}
        placeholder="e.g. 150 HP"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="engine_torque">Engine Torque</Label>
      <Input
        id="engine_torque"
        value={vehicleData.engine_torque}
        onChange={(e) => setVehicleData({ ...vehicleData, engine_torque: e.target.value })}
        placeholder="e.g. 155 Nm"
      />
    </div>
    <div>
      <Label htmlFor="daily_rate">Daily Rate (KES)</Label>
      <Input
        id="daily_rate"
        type="number"
        value={vehicleData.daily_rate}
        onChange={(e) => setVehicleData({ ...vehicleData, daily_rate: e.target.value })}
        required
      />
    </div>
  </div>

  <div>
    <Label htmlFor="status">Status</Label>
    <Select
      value={vehicleData.status}
      onValueChange={(value) => setVehicleData({ ...vehicleData, status: value })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Available">Available</SelectItem>
        <SelectItem value="Booked">Booked</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div>
    <Label htmlFor="description">Description</Label>
    <Textarea
      id="description"
      value={vehicleData.description}
      onChange={(e) => setVehicleData({ ...vehicleData, description: e.target.value })}
      rows={3}
    />
  </div>

  <div>
    <Label htmlFor="features">Features (comma-separated)</Label>
    <Input
      id="features"
      value={vehicleData.features}
      onChange={(e) => setVehicleData({ ...vehicleData, features: e.target.value })}
      placeholder="Air conditioning, Bluetooth, Rear Camera"
    />
  </div>

  <div>
  <Label htmlFor="image">Main Vehicle Image</Label>
  <Input
    id="image"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0] || null;
      setImageFile(file);
    }}
    required={!editingVehicle}
  />

  {/* ✅ If editing, show existing image unless replaced */}
  {imageFile ? (
    <div className="mt-2">
      <img
        src={URL.createObjectURL(imageFile)}
        alt="New Preview"
        className="w-full max-h-64 object-cover rounded-md border"
      />
    </div>
  ) : (
    existingMainImage && (
      <div className="mt-2">
        <img
          src={existingMainImage}
          alt="Current Vehicle Image"
          className="w-full max-h-64 object-cover rounded-md border"
        />
      </div>
    )
  )}
</div>



  <div>
    <Label htmlFor="additional-images">Additional Images (optional)</Label>
    <Input
      id="additional-images"
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => {
  if (!e.target.files) return;
  const newFiles = Array.from(e.target.files);
  setAdditionalImages((prev) => {
    if (!prev) return e.target.files;
    const merged = [...Array.from(prev), ...newFiles];

    // Convert back to FileList-like structure (FormData accepts arrays)
    const dataTransfer = new DataTransfer();
    merged.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  });
}}
    />
    {(existingAdditionalImages.length > 0 || additionalImages?.length) && (
  <div className="mt-2 grid grid-cols-3 gap-2">
    {/* ✅ Existing images */}
    {existingAdditionalImages.map((url, idx) => (
      <div key={`existing-${idx}`} className="relative">
        <img src={url} alt={`Existing ${idx + 1}`} className="w-full h-24 object-cover rounded-md border" />
        <button
          type="button"
          onClick={() =>
            setExistingAdditionalImages((prev) => prev.filter((_, i) => i !== idx))
          }
          className="absolute top-1 right-1 bg-black/50 text-white rounded-full px-1 text-xs"
        >
          ✕
        </button>
      </div>
    ))}

    {/* ✅ Newly added images */}
    {additionalImages &&
      Array.from(additionalImages).map((file, idx) => (
        <div key={`new-${idx}`} className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-24 object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={() => {
              const files = Array.from(additionalImages);
              files.splice(idx, 1);
              const dt = new DataTransfer();
              files.forEach((f) => dt.items.add(f));
              setAdditionalImages(dt.files);
            }}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full px-1 text-xs"
          >
            ✕
          </button>
        </div>
      ))}
  </div>
)}


    <p className="text-xs text-muted-foreground mt-1">You can upload multiple images</p>
  </div>

  <Button
  type="submit"
  variant="accent"
  className="w-full flex items-center justify-center"
  disabled={saving}
>
  {saving ? (
    <>
      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
      {editingVehicle ? "Updating..." : "Adding..."}
    </>
  ) : (
    editingVehicle ? "Update Vehicle" : "Add Vehicle"
  )}
</Button>
</form>


          </DialogContent>
        </Dialog>
      </div>

      {/* Vehicle Cards */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No vehicles found matching filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="p-3">
                <div className="flex justify-between items-start">
                  <Badge variant={vehicle.available ? "default" : "destructive"}>
                    {vehicle.available ? "Available" : "Unavailable"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(vehicle)}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteVehicleSlug(vehicle.slug)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {vehicle.category} • {vehicle.seats} seats
                  </CardDescription>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    KES {vehicle.pricePerDay.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-accent">/ day</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteVehicleSlug}
        onOpenChange={(open) => !open && setDeleteVehicleSlug(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehiclesSection;
