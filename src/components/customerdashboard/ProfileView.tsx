import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileViewProps {
  profile: any;
  passwordData: {
    old_password: string;
    new_password: string;
    new_password2: string;
  };
  setPasswordData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileView = ({ profile, passwordData, setPasswordData, onSubmit }: ProfileViewProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={profile.name || ""} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={profile.email || ""} disabled />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={profile.phone_number || ""} disabled />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading profile...</p>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>Old Password</Label>
              <Input
                type="password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, old_password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.new_password2}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password2: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" variant="accent">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
