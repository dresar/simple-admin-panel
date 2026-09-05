import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, EmptyState } from '@/components/admin/common';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description="User management is handled via the backend admin"
      />
      
      <Card>
        <EmptyState
          icon={Users}
          title="User Management"
          description="User management is available through the Django admin panel"
        />
      </Card>
    </AdminLayout>
  );
}
