'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import Chart from '@/components/Chart';
import api from '@/lib/api';
import { useAuthStore } from '@/context/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    exams: 0,
    totalFeesCollected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'school_admin') {
          const response = await api.get(`/schools/${user.id}/statistics`);
          setStats(response.data.statistics);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={stats.students}
            icon={<span className="text-2xl">👨‍🎓</span>}
            color="blue"
          />
          <StatsCard
            title="Total Teachers"
            value={stats.teachers}
            icon={<span className="text-2xl">👨‍🏫</span>}
            color="green"
          />
          <StatsCard
            title="Classes"
            value={stats.classes}
            icon={<span className="text-2xl">🏫</span>}
            color="yellow"
          />
          <StatsCard
            title="Fees Collected"
            value={`Ksh ${stats.totalFeesCollected.toLocaleString()}`}
            icon={<span className="text-2xl">💰</span>}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Chart data={chartData} title="Student Enrollment Trend" type="line" />
          <Chart data={chartData} title="Fee Collection Trend" type="bar" />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-700">New student enrolled: John Doe</p>
              <span className="ml-auto text-gray-500 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-700">Exam results published for Term 1</p>
              <span className="ml-auto text-gray-500 text-sm">5 hours ago</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <p className="text-gray-700">Fee payment received from Jane Doe</p>
              <span className="ml-auto text-gray-500 text-sm">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
