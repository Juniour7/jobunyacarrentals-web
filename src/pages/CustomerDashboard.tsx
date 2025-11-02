import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { bookingsAPI, userAPI, damageReportAPI, authAPI } from "@/services/api";
import { Booking } from "@/types/vehicle";

import SidebarNav from "@/components/customerdashboard/SidebarNav";
import DashboardHeader from "@/components/customerdashboard/DashboardHeader";
import BookingsView from "@/components/customerdashboard/BookingsView";
import ReportsView from "@/components/customerdashboard/ReportsView";
import ProfileView from "@/components/customerdashboard/ProfileView";

const CustomerDashboard = () => {
  const [activeView, setActiveView] = useState<"bookings" | "reports" | "profile">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [damageReports, setDamageReports] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({ bookingId: "", description: "" });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password2: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const [bookingsRes, profileRes, reportsRes] = await Promise.all([
          bookingsAPI.getMyBookings(),
          userAPI.getProfile(),
          damageReportAPI.getMyReports()
        ]);
        setBookings(bookingsRes.data);
        setProfile(profileRes.data);
        setDamageReports(reportsRes.data.results);
      } catch (err: any) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.clear();
      window.location.href = "/";
    } catch {
      toast.error("Failed to logout");
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await bookingsAPI.delete(id);
      setBookings(bookings.filter((b) => b.id !== id));
      toast.success("Booking deleted successfully!");
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await damageReportAPI.create({
        booking: parseInt(reportData.bookingId),
        description: reportData.description,
      });
      toast.success("Report submitted!");
      setReportData({ bookingId: "", description: "" });
    } catch {
      toast.error("Failed to submit report");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password2)
      return toast.error("Passwords do not match");
    try {
      await userAPI.changePassword(passwordData);
      toast.success("Password changed!");
      setPasswordData({ old_password: "", new_password: "", new_password2: "" });
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
        <main className="flex-1">
          <DashboardHeader title={
            activeView === "bookings" ? "My Bookings"
              : activeView === "reports" ? "Damage Reports"
              : "My Profile"
          } />
          <div className="p-6">
            {activeView === "bookings" && (
              <BookingsView bookings={bookings} loading={loading} onDelete={handleDeleteBooking} />
            )}
            {activeView === "reports" && (
              <ReportsView
                bookings={bookings}
                damageReports={damageReports}
                reportData={reportData}
                setReportData={setReportData}
                onSubmit={handleSubmitReport}
              />
            )}
            {activeView === "profile" && (
              <ProfileView
                profile={profile}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                onSubmit={handleChangePassword}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
