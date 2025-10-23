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
  const getFullImageUrl = (image: string) => image.startsWith("http") ? image : `https://giftmacvane.pythonanywhere.com${image}`;

  const getBookingDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return `${days} day${days > 1 ? 's' : ''}`;
};

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
                      src={getFullImageUrl(booking.vehicle_image)}
                      alt={booking.vehicle_name}
                      className="w-24 h-24 object-contain rounded-lg"
                    />
                    <div>
                      <CardTitle className="font-heading text-xl">
                        {booking.vehicle_name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Name: {booking.user_info.full_name}
                      </CardDescription>
                      <CardDescription className="mt-2">
                        Email: {booking.user_info.email}
                      </CardDescription>
                      <CardDescription className="mt-2">
                        Phone: {booking.user_info.phone_number}
                      </CardDescription>
                      <CardDescription className="mt-2">
                        License: {booking.user_info.license_number}
                      </CardDescription>
                      <CardDescription className="mt-1">
                        Duration: {getBookingDays(booking.start_date, booking.end_date)}
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
