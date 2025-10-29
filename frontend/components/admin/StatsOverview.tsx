'use client';

import { useState, useEffect } from 'react';
import { Eye, Link2, Users, Activity } from 'lucide-react';

interface DashboardStats {
  totalLinks: number;
  usersCount: number;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockStats: DashboardStats = {
      totalLinks: 24,
      usersCount: 156,
    };

    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {isLoading ? '...' : value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Link2}
          label="Total Links"
          value={stats?.totalLinks || 0}
          color="bg-blue-500"
        />

        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.usersCount || 0}
          color="bg-orange-500"
        />
      </div>


    </div>
  );
}