import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, EmptyState } from '@/components/admin/common';
import { MessageSquare } from 'lucide-react';

export default function InboxPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Inbox"
        description="Messages from your contact form"
      />
      
      <Card>
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Messages from visitors will appear here"
        />
      </Card>
    </AdminLayout>
  );
}
