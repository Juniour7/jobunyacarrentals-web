import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ReportsViewProps {
  bookings: any[];
  damageReports: any[];
  reportData: { bookingId: string; description: string };
  setReportData: (data: { bookingId: string; description: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ReportsView = ({
  bookings,
  damageReports,
  reportData,
  setReportData,
  onSubmit
}: ReportsViewProps) => {
  return (
    <div className="grid gap-6">
      {/* Submit New Report */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Submit Damage Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>Select Booking</Label>
              <Select
                value={reportData.bookingId}
                onValueChange={(v) => setReportData({ ...reportData, bookingId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.vehicle_name} ({new Date(b.start_date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the issue or damage..."
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                required
              />
            </div>

            <Button type="submit" variant="accent">
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Your Previous Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {damageReports.length === 0 ? (
            <p className="text-muted-foreground">No damage reports submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {damageReports.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">{r.booking.vehicle_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Reported: {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={r.status === "Resolved" ? "default" : "secondary"}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsView;
