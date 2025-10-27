import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Car, Calendar, FileWarning, LogOut, Home, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { bookingsAPI, userAPI, damageReportAPI } from "@/services/api";
import { Booking } from "@/types/vehicle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {authAPI} from '@/services/api'



const CustomerDashboard = () => {
  const [activeView, setActiveView] = useState<'bookings' | 'reports' | 'profile'>('bookings');
  const [reportData, setReportData] = useState({ bookingId: "", description: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password2: ""
  });
  const [damageReports, setDamageReports] = useState<any[]>([]);

  const getFullImageUrl = (image: string) => image.startsWith("http") ? image : `https://giftmacvane.pythonanywhere.com${image}`;

  const handleLogout = async () => {
  try {
    await authAPI.logout();
    localStorage.removeItem('token'); // your token key
    localStorage.removeItem('user');  // user info
    // Axios header is dynamically set, no need to delete here
    window.location.href = "/";
    toast.success("Logged out successfully!");
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Failed to logout");
  }
};



  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await bookingsAPI.getMyBookings();
        setBookings(bookingsRes.data);

        const profileRes = await userAPI.getProfile();
        setProfile(profileRes.data);

        const reportsRes = await damageReportAPI.getMyReports(); // fetch customer reports
        setDamageReports(reportsRes.data.results);
      } catch (error: any) {
        console.error("Error loading data:", error);
        toast.error(error.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await damageReportAPI.create({
        booking: parseInt(reportData.bookingId),
        description: reportData.description,
      });
      toast.success("Damage report submitted successfully!");
      setReportData({ bookingId: "", description: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit damage report");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password2) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await userAPI.changePassword(passwordData);
      toast.success("Password changed successfully!");
      setPasswordData({ old_password: "", new_password: "", new_password2: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
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
              <span className="font-heading text-lg font-semibold">Jobunya Cars</span>
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
                    <SidebarMenuButton onClick={() => setActiveView('profile')} isActive={activeView === 'profile'}>
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
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
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <h1 className="font-heading text-xl md:text-2xl font-bold">
                  {activeView === 'bookings' ? 'My Bookings' : activeView === 'reports' ? 'Damage Reports' : 'My Profile'}
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
                                src={getFullImageUrl(booking.vehicle_image)}
                                alt={booking.vehicle_name}
                                className="w-24 h-24 object-contain rounded-lg"
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
                        <Select 
                          value={reportData.bookingId} 
                          onValueChange={(value) => setReportData({...reportData, bookingId: value})}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select a booking" />
                          </SelectTrigger>
                          <SelectContent>
                            {bookings.map((booking) => (
                              <SelectItem key={booking.id} value={booking.id.toString()}>
                                {booking.vehicle_name} - {new Date(booking.start_date).toLocaleDateString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                  {damageReports.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">No damage reports submitted yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    damageReports.map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {report.booking_details?.vehicle_image && (
                                <div className="mt-4">
                                  <img
                                    src={report.booking_details.vehicle_image.startsWith("http")
                                      ? report.booking_details.vehicle_image
                                      : `https://giftmacvane.pythonanywhere.com${report.booking_details.vehicle_image}`}
                                    alt={report.booking_details.vehicle_name}
                                    className="w-28 h-24 object-contain rounded-md"
                                  />
                                </div>
                              )}
                              <div>
                                <CardTitle className="font-heading text-xl">{report.booking_details?.vehicle_name}</CardTitle>
                              <CardDescription className="mt-2">
                                Reported on {new Date(report.created_at).toLocaleDateString()}
                              </CardDescription>
                              </div>
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
                    ))
                  )}
                </div>
              </div>
            )}

            {activeView === 'profile' && profile && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Profile Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{profile.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{profile.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">License Number</p>
                        <p className="font-medium">{profile.license_number}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <Label htmlFor="old_password">Current Password</Label>
                        <Input
                          id="old_password"
                          type="password"
                          value={passwordData.old_password}
                          onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new_password">New Password</Label>
                        <Input
                          id="new_password"
                          type="password"
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new_password2">Confirm New Password</Label>
                        <Input
                          id="new_password2"
                          type="password"
                          value={passwordData.new_password2}
                          onChange={(e) => setPasswordData({...passwordData, new_password2: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                      <Button type="submit" variant="accent" className="w-full">
                        Change Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
