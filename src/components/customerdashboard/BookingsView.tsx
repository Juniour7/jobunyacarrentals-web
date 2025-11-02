import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
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
import { Trash2 } from "lucide-react";
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
    return <div className="text-center py-12">Loading bookings...</div>;

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

  return (
    <>
      {/* Bookings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Card key={booking.id} className="flex flex-col justify-between">
            <CardHeader className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <img
                  src={getFullImageUrl(booking.vehicle_image)}
                  alt={booking.vehicle_name}
                  className="w-24 h-24 object-contain rounded-lg"
                />
                <div>
                  <CardTitle className="font-heading text-lg">
                    {booking.vehicle_name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {new Date(booking.start_date).toLocaleDateString()} –{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex justify-between items-center mt-auto">
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className="font-bold text-accent">
                  KES {parseFloat(booking.total_price).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge
                  variant={
                    booking.status === "active" ? "default" : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteClick(booking)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
