import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, CardHeader, Button } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { DashboardStats } from '@/components/admin/dashboard';
import { ExternalLink, Calendar, RefreshCw } from 'lucide-react';

interface MonitorLogEntry {
  timestamp: string;
  method: string;
  path: string;
  status_code: number;
  ip: string;
  user_agent?: string;
  response_time?: number;
}

interface ProcessedStats {
  totalProjects: number;
  totalSkills: number;
  totalViews: number;
  totalMessages: number;
  totalSubscribers: number;
}

interface DayStats {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  topEndpoints: { endpoint: string; count: number }[];
  requestsPerHour: { hour: number; count: number }[];
}

function parseMonitorExport(data: string): MonitorLogEntry[] {
  const lines = data.trim().split('\n').filter(Boolean);
  const entries: MonitorLogEntry[] = [];
  
  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch {
      // Skip invalid lines
    }
  }
  
  return entries;
}

function processStats(entries: MonitorLogEntry[]): DayStats {
  const endpointCounts: Record<string, number> = {};
  const hourCounts: Record<number, number> = {};
  let successCount = 0;
  let errorCount = 0;

  for (const entry of entries) {
    // Count by status
    if (entry.status_code < 400) {
      successCount++;
    } else {
      errorCount++;
    }

    // Count by endpoint
    endpointCounts[entry.path] = (endpointCounts[entry.path] || 0) + 1;

    // Count by hour
    const hour = new Date(entry.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  }

  const topEndpoints = Object.entries(endpointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([endpoint, count]) => ({ endpoint, count }));

  const requestsPerHour = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: hourCounts[i] || 0,
  }));

  return {
    totalRequests: entries.length,
    successCount,
    errorCount,
    topEndpoints,
    requestsPerHour,
  };
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Fetch basic counts from various endpoints
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', token],
    queryFn: async (): Promise<ProcessedStats> => {
      const [projects, skills, messages, subscribers] = await Promise.all([
        apiFetch<any[]>(API_ENDPOINTS.projects, { token }).catch(() => []),
        apiFetch<any[]>(API_ENDPOINTS.skills, { token }).catch(() => []),
        apiFetch<any[]>(API_ENDPOINTS.messages, { token }).catch(() => []),
        apiFetch<any[]>(API_ENDPOINTS.subscribers, { token }).catch(() => []),
      ]);

      return {
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalSkills: Array.isArray(skills) ? skills.length : 0,
        totalViews: 0, // Monitor data
        totalMessages: Array.isArray(messages) ? messages.length : 0,
        totalSubscribers: Array.isArray(subscribers) ? subscribers.length : 0,
      };
    },
    staleTime: 60000,
  });

  // Fetch monitor export data
  const { data: monitorData, isLoading: monitorLoading, refetch: refetchMonitor } = useQuery({
    queryKey: ['monitor-export', selectedDate, token],
    queryFn: async (): Promise<DayStats> => {
      try {
        const data = await apiFetch<string>(
          `${API_ENDPOINTS.monitorExport}?date=${selectedDate}`,
          { token }
        );
        const entries = parseMonitorExport(data);
        return processStats(entries);
      } catch {
        return {
          totalRequests: 0,
          successCount: 0,
          errorCount: 0,
          topEndpoints: [],
          requestsPerHour: [],
        };
      }
    },
    staleTime: 60000,
  });

  const isLoading = statsLoading || monitorLoading;

  return (
    <AdminLayout>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Admin'}!`}
        description="Here's what's happening with your portfolio"
        actions={
          <a
            href={`${import.meta.env.VITE_API_BASE_URL || 'https://porto.apprentice.cyou'}${API_ENDPOINTS.monitorHtml}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Open Monitor HTML
          </a>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="space-y-6 fade-in">
          {/* Stats Cards */}
          {stats && <DashboardStats stats={stats} />}

          {/* Monitor Date Picker */}
          <Card>
            <CardHeader
              title="API Monitor"
              description="Request statistics from the server"
              action={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-2 py-1 text-sm border border-input rounded-md bg-background"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => refetchMonitor()}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              }
            />

            {monitorData && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{monitorData.totalRequests}</p>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{monitorData.successCount}</p>
                    <p className="text-sm text-muted-foreground">Successful</p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{monitorData.errorCount}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>

                {/* Top Endpoints */}
                {monitorData.topEndpoints.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Endpoints</h4>
                    <div className="space-y-2">
                      {monitorData.topEndpoints.map((ep, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <code className="text-xs bg-muted px-2 py-1 rounded">{ep.endpoint}</code>
                          <span className="text-muted-foreground">{ep.count} requests</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requests Per Hour Chart (simple bars) */}
                {monitorData.requestsPerHour.some(h => h.count > 0) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Requests Per Hour</h4>
                    <div className="flex items-end gap-1 h-24">
                      {monitorData.requestsPerHour.map((h) => {
                        const maxCount = Math.max(...monitorData.requestsPerHour.map(x => x.count), 1);
                        const height = (h.count / maxCount) * 100;
                        return (
                          <div
                            key={h.hour}
                            className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                            style={{ height: `${Math.max(height, 2)}%` }}
                            title={`${h.hour}:00 - ${h.count} requests`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0:00</span>
                      <span>12:00</span>
                      <span>23:00</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
