import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { userAPI } from "@/services/api";

interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  license_number: string;
  created_at: string;
}

const AdminUsersSection = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await userAPI.getCustomerList();
        // Sort customers by created_at in DESCENDING order (newest first)
        const sortedCustomers = response.data.sort((a: Customer, b: Customer) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime() // Changed a and b positions
        );
        setCustomers(sortedCustomers);
      } catch (error) {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
            </div>;
  }

  return (
    <div className="space-y-6">
      {customers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No customers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Member Since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{customer.full_name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.license_number}</TableCell>
                  <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersSection;