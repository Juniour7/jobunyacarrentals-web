import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Car, Calendar, FileWarning, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { bookingsAPI } from "@/services/api";
import { Booking } from "@/types/vehicle";

// Mock data
const mockBookings = [
  {
    id: "1",
    vehicleName: "Mercedes-Benz G-Class",
    vehicleImage: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400",
    startDate: "2025-10-10",
    endDate: "2025-10-15",
    totalPrice: 225000,
    status: 'active' as const
  },
  {
    id: "2",
    vehicleName: "Range Rover Vogue",
    vehicleImage: "https://images.unsplash.com/photo-1606611013016-969607c2c9ab?q=80&w=400",
    startDate: "2025-09-20",
    endDate: "2025-09-25",
    totalPrice: 225000,
    status: 'completed' as const
  }
];

const mockReports: Array<{
  id: string;
  bookingId: string;
  vehicleName: string;
  description: string;
  dateReported: string;
  status: 'pending' | 'reviewed' | 'resolved';
}> = [
  {
    id: "1",
    bookingId: "2",
    vehicleName: "Range Rover Vogue",
    description: "Minor scratch on rear bumper from parking",
    dateReported: "2025-09-24",
    status: 'reviewed'
  }
];

const CustomerDashboard = () => {
  const [activeView, setActiveView] = useState<'bookings' | 'reports'>('bookings');
  const [reportData, setReportData] = useState({ bookingId: "", description: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Damage report submitted successfully!");
    setReportData({ bookingId: "", description: "" });
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
              <SidebarGroupLabel>Customer Portal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView('bookings')} isActive={activeView === 'bookings'}>
                      <Calendar className="w-4 h-4" />
                      <span>My Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView('reports')} isActive={activeView === 'reports'}>
                      <FileWarning className="w-4 h-4" />
                      <span>Damage Reports</span>
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
                  {activeView === 'bookings' ? 'My Bookings' : 'Damage Reports'}
                </h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {activeView === 'bookings' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">No bookings yet</p>
                      <Link to="/fleet">
                        <Button variant="accent">Browse Vehicles</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <img
                                src={booking.vehicle_image}
                                alt={booking.vehicle_name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div>
                                <CardTitle className="font-heading text-xl">{booking.vehicle_name}</CardTitle>
                                <CardDescription className="mt-2">
                                  {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Cost:</span>
                            <span className="text-lg font-bold text-accent">
                              KES {parseFloat(booking.total_price).toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeView === 'reports' && (
              <div className="space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="accent">Submit Damage Report</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">Report Vehicle Damage</DialogTitle>
                      <DialogDescription>
                        Describe any damage to the vehicle during your rental period.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitReport} className="space-y-4">
                      <div>
                        <Label htmlFor="booking">Related Booking</Label>
                        <select
                          id="booking"
                          className="w-full mt-2 px-3 py-2 border rounded-md"
                          value={reportData.bookingId}
                          onChange={(e) => setReportData({...reportData, bookingId: e.target.value})}
                          required
                        >
                          <option value="">Select a booking</option>
                          {bookings.map((booking) => (
                            <option key={booking.id} value={booking.id}>
                              {booking.vehicle_name} - {new Date(booking.start_date).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the damage in detail..."
                          value={reportData.description}
                          onChange={(e) => setReportData({...reportData, description: e.target.value})}
                          required
                          className="mt-2 min-h-[120px]"
                        />
                      </div>
                      <Button type="submit" variant="accent" className="w-full">
                        Submit Report
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="grid gap-6">
                  {mockReports.map((report) => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-heading text-xl">{report.vehicleName}</CardTitle>
                            <CardDescription className="mt-2">
                              Reported on {new Date(report.dateReported).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge 
                            variant={
                              report.status === 'pending' 
                                ? 'destructive' 
                                : 'default'
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
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

export default CustomerDashboard;
