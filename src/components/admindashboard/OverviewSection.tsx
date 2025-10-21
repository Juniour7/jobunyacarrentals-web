import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { vehicles } from "@/data/vehicles";

const mockStats = {
  totalVehicles: vehicles.length,
  availableVehicles: vehicles.filter((v) => v.available).length,
  totalUsers: 10,
  activeBookings: 7,
  revenue: 1250000,
  monthlyRevenue: 450000,
};

const OverviewSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Total Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{mockStats.totalVehicles}</div>
        <p className="text-sm text-muted-foreground">
          {mockStats.availableVehicles} available
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Active Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{mockStats.activeBookings}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Total Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{mockStats.totalUsers}</div>
      </CardContent>
    </Card>

    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-accent">
          KES {mockStats.revenue.toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground">
          This month: KES {mockStats.monthlyRevenue.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  </div>
);

export default OverviewSection;
