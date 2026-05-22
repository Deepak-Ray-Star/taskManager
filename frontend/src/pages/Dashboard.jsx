import React, { useEffect, useState } from 'react';
import { taskService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await taskService.getDashboardStats();
        setStats(data.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  const statCards = [
    { label: 'Total Tasks', value: stats?.totalTasks || 0, color: 'blue' },
    { label: 'Completed', value: stats?.completedTasks || 0, color: 'green' },
    { label: 'Pending', value: stats?.pendingTasks || 0, color: 'yellow' },
    { label: 'Overdue', value: stats?.overdueTasks || 0, color: 'red' },
    { label: 'My Tasks', value: stats?.myTasks || 0, color: 'purple' },
    { label: 'My Completed', value: stats?.myCompletedTasks || 0, color: 'indigo' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's your task overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg shadow ${colorClasses[stat.color]}`}>
            <p className="text-sm font-semibold opacity-75">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
