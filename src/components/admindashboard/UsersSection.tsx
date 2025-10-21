import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  bookings: number;
  status: string;
}

interface UserSectionProps {
  users: User[];
}

const UserSection = ({ users }: UserSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-heading text-xl">{user.name}</CardTitle>
                  <CardDescription className="mt-2">{user.email}</CardDescription>
                </div>
                <Badge variant="default">{user.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Bookings:</span>
                <span className="font-semibold">{user.bookings}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserSection;
