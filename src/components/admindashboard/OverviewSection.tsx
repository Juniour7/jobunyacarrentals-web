import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { vehiclesAPI, bookingsAPI, userAPI } from "@/services/api";

const OverviewSection = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalUsers: 0,
    activeBookings: 0,
    revenue: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vehiclesRes, bookingsRes, usersRes] = await Promise.all([
          vehiclesAPI.getAll(),
          bookingsAPI.getAllBookings(),
          userAPI.getCustomerList(),
        ]);

        const vehicles = vehiclesRes.data.results || [];
        const bookings = bookingsRes.data || [];
        const users = usersRes.data || [];

        const totalRevenue = bookings
          .filter((b: any) => b.status === 'completed')
          .reduce((sum: number, b: any) => sum + parseFloat(b.total_price || 0), 0);

        const currentMonth = new Date().getMonth();
        const monthlyRevenue = bookings
          .filter((b: any) => {
            const bookingMonth = new Date(b.created_at).getMonth();
            return bookingMonth === currentMonth && b.status === 'completed';
          })
          .reduce((sum: number, b: any) => sum + parseFloat(b.total_price || 0), 0);

        setStats({
          totalVehicles: vehicles.length,
          availableVehicles: vehicles.filter((v: any) => v.status === "Available").length,
          totalUsers: users.length,
          activeBookings: bookings.filter((b: any) => b.status === 'active' || b.status === 'pending').length,
          revenue: totalRevenue,
          monthlyRevenue: monthlyRevenue,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Total Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.totalVehicles}</div>
        <p className="text-sm text-muted-foreground">
          {stats.availableVehicles} available
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Active Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.activeBookings}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Total Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.totalUsers}</div>
      </CardContent>
    </Card>

    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-accent">
          KES {stats.revenue.toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground">
          This month: KES {stats.monthlyRevenue.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  </div>
);
};

export default OverviewSection;
