import { useEffect, useState } from "react";
import { toast } from "sonner";
import { damageReportAPI } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";

const DamageReportsSection = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadReports = async () => {
    try {
      const response = await damageReportAPI.getAll();
      setReports(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load damage reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleViewDetails = async (reportId: number) => {
    try {
      const response = await damageReportAPI.getById(reportId);
      setSelectedReport(response.data);
      setDialogOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load report details");
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedReport) return;
    try {
      await damageReportAPI.updateStatus(selectedReport.id, status);
      toast.success("Status updated successfully!");
      setDialogOpen(false);
      loadReports();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <p>Loading damage reports...</p>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No damage reports submitted yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-heading text-xl">
                      {report.booking_details?.vehicle_name || "Vehicle"}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Reported by {report.user_details?.full_name} on{" "}
                      {new Date(report.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      report.status === "pending"
                        ? "destructive"
                        : report.status === "resolved"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(report.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Damage Report Details</DialogTitle>
            <DialogDescription>
              Review and update the status of this damage report
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{selectedReport.booking_details?.vehicle_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported By</p>
                  <p className="font-medium">{selectedReport.user_details?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date Reported</p>
                  <p className="font-medium">
                    {new Date(selectedReport.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge
                    variant={
                      selectedReport.status === "pending"
                        ? "destructive"
                        : selectedReport.status === "resolved"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedReport.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedReport.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <Select
                  value={selectedReport.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DamageReportsSection;
