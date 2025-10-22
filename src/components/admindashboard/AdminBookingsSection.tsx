import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { bookingsAPI } from "@/services/api";
import { Booking } from "@/types/vehicle";

const AdminBookingsSection = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getAllBookings();
        setBookings(response.data);
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus as any } : booking
        )
      );
      toast.success("Booking status updated successfully!");
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
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
                      <CardTitle className="font-heading text-xl">
                        {booking.vehicle_name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        User ID: {booking.user}
                      </CardDescription>
                      <CardDescription className="mt-1">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      booking.status === "active"
                        ? "default"
                        : booking.status === "completed"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="text-lg font-bold text-accent">
                      KES {parseFloat(booking.total_price).toLocaleString()}
                    </span>
                  </div>

                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleUpdateStatus(booking.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
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
      )}
    </div>
  );
};

export default AdminBookingsSection;
