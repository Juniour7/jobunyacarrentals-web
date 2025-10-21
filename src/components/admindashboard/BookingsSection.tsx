import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export type BookingStatus = "active" | "completed" | "cancelled";

export interface AdminBooking {
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

interface BookingSectionProps {
  bookings: AdminBooking[];
  setBookings: React.Dispatch<React.SetStateAction<AdminBooking[]>>;
}

const BookingSection = ({ bookings, setBookings }: BookingSectionProps) => {
  const handleUpdateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    toast.success("Booking status updated successfully!");
  };

  return (
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
                    <CardTitle className="font-heading text-xl">
                      {booking.vehicleName}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Customer: {booking.userName}
                    </CardDescription>
                    <CardDescription className="mt-1">
                      {booking.startDate} to {booking.endDate}
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
                    KES {booking.totalPrice.toLocaleString()}
                  </span>
                </div>

                <Select
                  value={booking.status}
                  onValueChange={(value) =>
                    handleUpdateBookingStatus(booking.id, value as BookingStatus)
                  }
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
  );
};

export default BookingSection;
