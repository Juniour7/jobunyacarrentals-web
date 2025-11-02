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
        <SidebarNav activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1">
          <DashboardHeader 
            title={
              activeView === "bookings" ? "My Bookings"
                : activeView === "reports" ? "Damage Reports"
                : "My Profile"
            }
            onLogout={handleLogout}
          />
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
        
        {/* Floating WhatsApp Support Button */}
        <a
          href="https://wa.me/254700000000"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
          aria-label="WhatsApp Support"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
