import React from 'react';
import { FolderKanban, Wrench, Eye, MessageSquare, Mail } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import type { MonitorStats } from '@/types/monitor';

interface DashboardStatsProps {
  stats: MonitorStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        icon={FolderKanban}
        color="primary"
      />
      <StatCard
        title="Total Skills"
        value={stats.totalSkills}
        icon={Wrench}
        color="success"
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        icon={Eye}
        color="warning"
      />
      <StatCard
        title="Messages"
        value={stats.totalMessages}
        icon={MessageSquare}
        color="primary"
      />
      <StatCard
        title="Subscribers"
        value={stats.totalSubscribers}
        icon={Mail}
        color="success"
      />
    </div>
  );
}
