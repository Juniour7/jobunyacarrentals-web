import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, Info, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Booking } from "@/types/vehicle";

const getFullImageUrl = (image: string) =>
  image.startsWith("http")
    ? image
    : `https://giftmacvane.pythonanywhere.com${image}`;

interface Props {
  bookings: Booking[];
  loading: boolean;
  onDelete: (id: number) => void;
}

const BookingsView = ({ bookings, loading, onDelete }: Props) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      onDelete(selectedBooking.id);
    }
    setShowDialog(false);
    setSelectedBooking(null);
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
            </div>;

  if (bookings.length === 0)
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No bookings yet</p>
          <Link to="/fleet">
            <Button variant="accent">Browse Vehicles</Button>
          </Link>
        </CardContent>
      </Card>
    );

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      {/* Bookings Grid */}
      <div className="grid gap-6 lg:grid-cols-1">
        {bookings.map((booking) => {
          const duration = calculateDuration(booking.start_date, booking.end_date);
          const dailyRate = parseFloat(booking.total_price) / duration;
          
          return (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-6">
                {/* Header with Ref and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>Ref: {booking.id.toString().padStart(8, '0')}</span>
                  </div>
                  <Badge
                    variant={booking.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-[200px,1fr] gap-6">
                  {/* Vehicle Image */}
                  <div className="flex items-start">
                    <img
                      src={getFullImageUrl(booking.vehicle_image)}
                      alt={booking.vehicle_name}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    {/* Title and Price */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-heading font-semibold mb-1">
                          {booking.vehicle_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Self-drive • Automatic
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          KSh {dailyRate.toLocaleString()}/day
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: KSh {parseFloat(booking.total_price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Booking Period and Vehicle Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>Booking Period</span>
                        </div>
                        <div className="pl-6 text-sm">
                          <p>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</p>
                          <p className="text-muted-foreground">Duration: {duration} {duration === 1 ? 'day' : 'days'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Info className="w-4 h-4" />
                          <span>Vehicle Details</span>
                        </div>
                        <div className="pl-6 text-sm">
                          <p>Self-drive</p>
                          <p className="text-muted-foreground">Usage: Within Nairobi</p>
                        </div>
                      </div>
                    </div>

                    {/* Pickup and Drop-off */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4" />
                          <span>Pickup</span>
                        </div>
                        <div className="pl-6 text-sm text-muted-foreground">
                          <p>{booking.pickup_location_detail.address}</p>
                          <p>{booking.pickup_location_detail.name}</p>
                          <p>{booking.pickup_location_detail.city}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4" />
                          <span>Drop-off</span>
                        </div>
                        <div className="pl-6 text-sm text-muted-foreground">
                          <p>{booking.dropoff_location_detail.address}</p>
                          <p>{booking.dropoff_location_detail.name}</p>
                          <p>{booking.dropoff_location_detail.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Booked Date */}
                    <p className="text-xs text-muted-foreground">
                      Booked {formatDate(booking.start_date)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]"
                            asChild
                        >
                            <a
                                href={`https://wa.me/254723565952?text=${encodeURIComponent(
                                `Hello Jobunya Car Rentals, I need assistance with my booking

                                Booking Details:
                                - Name: ${booking.user_info.full_name}
                                - Email: ${booking.user_info.email}
                                - Phone: ${booking.user_info.phone_number}
                                - Vehicle: ${booking.vehicle_name}
                                - Pickup: ${booking.pickup_location_detail.name}, ${booking.pickup_location_detail.city}
                                - Drop-off: ${booking.dropoff_location_detail.name}, ${booking.dropoff_location_detail.city}
                                - Dates: ${formatDate(booking.start_date)} to ${formatDate(booking.end_date)}
                                - Total: KSh ${booking.total_price}
                                Thank you for your assistance
                                `
                                )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                            >
                            <MessageCircle className="w-4 h-4" />
                                Contact
                            </a>
                        </Button>


                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(booking)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingsView;
