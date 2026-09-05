export interface MonitorStats {
  totalProjects: number;
  totalSkills: number;
  totalViews: number;
  totalMessages: number;
  totalSubscribers: number;
}

export interface APIUsageData {
  date: string;
  requests: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning';
  details?: string;
}

export interface ErrorSummary {
  type: string;
  count: number;
  lastOccurred: string;
}

export interface MonitorResponse {
  stats: MonitorStats;
  apiUsage: APIUsageData[];
  activityLogs: ActivityLog[];
  errorSummary: ErrorSummary[];
}
