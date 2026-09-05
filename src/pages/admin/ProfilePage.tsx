import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Input, Button } from '@/components/admin/common';
import { User, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <PageHeader
        title="Profile"
        description="Manage your account settings"
      />
      
      <div className="space-y-6 max-w-2xl">
        {/* Profile Info */}
        <Card>
          <CardHeader 
            title="Profile Information" 
            action={
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
            }
          />
          <form className="admin-form">
            <Input
              label="Name"
              defaultValue={user?.name || ''}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email || ''}
              placeholder="your@email.com"
            />
            <Input
              label="Username"
              defaultValue={user?.username || ''}
              placeholder="username"
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader 
            title="Change Password"
            action={<Lock className="w-5 h-5 text-muted-foreground" />}
          />
          <form className="admin-form">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
            />
            <Button type="submit">Update Password</Button>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
