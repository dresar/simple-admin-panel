import React from 'react';
import { Card, CardHeader } from '../common/Card';
import type { APIUsageData } from '@/types/monitor';

interface APIUsageChartProps {
  data: APIUsageData[];
}

export function APIUsageChart({ data }: APIUsageChartProps) {
  const maxRequests = Math.max(...data.map(d => d.requests), 1);

  return (
    <Card>
      <CardHeader 
        title="API Usage" 
        description="Requests over the last 7 days" 
      />
      <div className="h-48 flex items-end gap-2">
        {data.map((item, index) => {
          const height = (item.requests / maxRequests) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">{item.requests}</span>
              <div 
                className="w-full bg-primary/20 rounded-t transition-all duration-500 hover:bg-primary/30"
                style={{ height: `${height}%`, minHeight: '4px' }}
              >
                <div 
                  className="w-full h-full bg-primary rounded-t"
                  style={{ height: `${Math.min(height, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
