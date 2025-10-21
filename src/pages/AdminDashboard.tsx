import { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Car, Users, BarChart3, LogOut, Home, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { vehicles } from "@/data/vehicles";

// Mock user data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", bookings: 3, status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", bookings: 1, status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", bookings: 5, status: "active" }
];

// Mock bookings data
type BookingStatus = 'active' | 'completed' | 'cancelled';

interface AdminBooking {
  id: string;
  userId: string;
  userName: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
}

const mockBookingsData: AdminBooking[] = [
  { id: "1", userId: "1", userName: "John Doe", vehicleName: "Mercedes-Benz G-Class", vehicleImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80", startDate: "2025-10-25", endDate: "2025-10-30", totalPrice: 225000, status: "active" },
  { id: "2", userId: "2", userName: "Jane Smith", vehicleName: "BMW X7", vehicleImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", startDate: "2025-10-22", endDate: "2025-10-24", totalPrice: 90000, status: "active" },
  { id: "3", userId: "3", userName: "Bob Johnson", vehicleName: "Range Rover Sport", vehicleImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80", startDate: "2025-10-15", endDate: "2025-10-20", totalPrice: 200000, status: "completed" },
  { id: "4", userId: "1", userName: "John Doe", vehicleName: "Toyota Land Cruiser V8", vehicleImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", startDate: "2025-10-10", endDate: "2025-10-12", totalPrice: 70000, status: "completed" },
  { id: "5", userId: "3", userName: "Bob Johnson", vehicleName: "Porsche Cayenne", vehicleImage: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", startDate: "2025-10-28", endDate: "2025-11-02", totalPrice: 225000, status: "active" },
];

// Mock stats
const mockStats = {
  totalVehicles: vehicles.length,
  availableVehicles: vehicles.filter(v => v.available).length,
  totalUsers: mockUsers.length,
  activeBookings: 7,
  revenue: 1250000,
  monthlyRevenue: 450000
};

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<'overview' | 'vehicles' | 'users' | 'bookings'>('overview');
  const [vehicleData, setVehicleData] = useState({
    name: "",
    category: "",
    pricePerDay: "",
    seats: ""
  });
  const [bookings, setBookings] = useState(mockBookingsData);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vehicle added successfully!");
    setVehicleData({ name: "", category: "", pricePerDay: "", seats: "" });
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    toast.success("Booking status updated successfully!");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-background" />
              </div>
              <span className="font-heading text-lg font-semibold">EliteMotion</span>
            </Link>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView('overview')} isActive={activeView === 'overview'}>
                      <BarChart3 className="w-4 h-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView('vehicles')} isActive={activeView === 'vehicles'}>
                      <Car className="w-4 h-4" />
                      <span>Vehicle Inventory</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView('users')} isActive={activeView === 'users'}>
                      <Users className="w-4 h-4" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView('bookings')} isActive={activeView === 'bookings'}>
                      <Calendar className="w-4 h-4" />
                      <span>Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/">
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/auth">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="font-heading text-2xl font-bold">
                  {activeView === 'overview' ? 'Dashboard Overview' : activeView === 'vehicles' ? 'Vehicle Inventory' : activeView === 'users' ? 'User Management' : 'Bookings Management'}
                </h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {activeView === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.totalVehicles}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {mockStats.availableVehicles} available
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.activeBookings}</div>
                      <p className="text-sm text-muted-foreground mt-2">Current rentals</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.totalUsers}</div>
                      <p className="text-sm text-muted-foreground mt-2">Registered customers</p>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent">
                        KES {mockStats.revenue.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        This month: KES {mockStats.monthlyRevenue.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeView === 'vehicles' && (
              <div className="space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">Add New Vehicle</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new vehicle to add to your fleet.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddVehicle} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Vehicle Name</Label>
                        <Input
                          id="name"
                          placeholder="Mercedes-Benz G-Class"
                          value={vehicleData.name}
                          onChange={(e) => setVehicleData({...vehicleData, name: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          placeholder="LUXURY"
                          value={vehicleData.category}
                          onChange={(e) => setVehicleData({...vehicleData, category: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price per Day (KES)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="45000"
                          value={vehicleData.pricePerDay}
                          onChange={(e) => setVehicleData({...vehicleData, pricePerDay: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seats">Seats</Label>
                        <Input
                          id="seats"
                          type="number"
                          placeholder="5"
                          value={vehicleData.seats}
                          onChange={(e) => setVehicleData({...vehicleData, seats: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <Button type="submit" variant="accent" className="w-full">
                        Add Vehicle
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="grid gap-4">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                              <CardTitle className="font-heading text-xl">{vehicle.name}</CardTitle>
                              <CardDescription className="mt-2">
                                {vehicle.category} • {vehicle.seats} seats
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={vehicle.available ? 'default' : 'destructive'}>
                            {vehicle.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Price per Day:</span>
                          <span className="text-lg font-bold text-accent">
                            KES {vehicle.pricePerDay.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'users' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {mockUsers.map((user) => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-heading text-xl">{user.name}</CardTitle>
                            <CardDescription className="mt-2">{user.email}</CardDescription>
                          </div>
                          <Badge variant="default">{user.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Bookings:</span>
                          <span className="font-semibold">{user.bookings}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'bookings' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <img
                              src={booking.vehicleImage}
                              alt={booking.vehicleName}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                              <CardTitle className="font-heading text-xl">{booking.vehicleName}</CardTitle>
                              <CardDescription className="mt-2">
                                Customer: {booking.userName}
                              </CardDescription>
                              <CardDescription className="mt-1">
                                {booking.startDate} to {booking.endDate}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={booking.status === 'active' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Total:</span>
                            <span className="text-lg font-bold text-accent">
                              KES {booking.totalPrice.toLocaleString()}
                            </span>
                          </div>
                          <Select
                            value={booking.status}
                            onValueChange={(value) => handleUpdateBookingStatus(booking.id, value as BookingStatus)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
