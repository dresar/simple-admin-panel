import React from 'react';
import { Card, CardHeader } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { Activity } from 'lucide-react';
import type { ActivityLog } from '@/types/monitor';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

const statusClasses = {
  success: 'badge-success',
  error: 'badge-error',
  warning: 'badge-warning',
};

export function ActivityLogTable({ logs }: ActivityLogTableProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader title="Recent Activity" />
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Activity logs will appear here"
        />
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="p-4 border-b border-border">
        <CardHeader title="Recent Activity" description="Latest system activities" />
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="font-medium">{log.action}</td>
                <td className="text-muted-foreground">{log.user}</td>
                <td className="text-muted-foreground font-mono text-xs">{log.ip}</td>
                <td>
                  <span className={`badge ${statusClasses[log.status]}`}>
                    {log.status}
                  </span>
                </td>
                <td className="text-muted-foreground text-xs">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
