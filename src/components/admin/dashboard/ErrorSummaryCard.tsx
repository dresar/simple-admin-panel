import React from 'react';
import { Card, CardHeader } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { ErrorSummary } from '@/types/monitor';

interface ErrorSummaryCardProps {
  errors: ErrorSummary[];
}

export function ErrorSummaryCard({ errors }: ErrorSummaryCardProps) {
  if (errors.length === 0) {
    return (
      <Card>
        <CardHeader title="Error Summary" />
        <div className="flex flex-col items-center py-6">
          <div className="p-3 bg-success/10 rounded-full mb-3">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <p className="text-sm font-medium text-foreground">No errors detected</p>
          <p className="text-xs text-muted-foreground">System is running smoothly</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Error Summary" />
      <div className="space-y-3">
        {errors.map((error, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">{error.type}</p>
                <p className="text-xs text-muted-foreground">
                  Last: {new Date(error.lastOccurred).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <span className="badge badge-error">{error.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
