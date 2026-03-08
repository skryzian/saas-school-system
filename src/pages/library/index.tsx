'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/api';

export default function LibraryDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/library/reports/dashboard/stats');
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Available Books',
      value: stats?.availableBooks || 0,
      color: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Books Issued',
      value: stats?.totalIssued || 0,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Overdue Books',
      value: stats?.overdueIssues || 0,
      color: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Active Members',
      value: stats?.totalMembers || 0,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Fines Collected',
      value: `$${stats?.totalFinesCollected?.toFixed(2) || '0.00'}`,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Library Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className={`${card.color} rounded-lg p-6 shadow`}>
            <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
            <p className={`${card.textColor} text-3xl font-bold`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/library/books" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-center">
            Browse Books
          </a>
          <a href="/library/members" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-center">
            Manage Members
          </a>
          <a href="/library/issues" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded text-center">
            Issue/Return
          </a>
          <a href="/library/reports" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded text-center">
            View Reports
          </a>
        </div>
      </div>

      {/* Alerts */}
      {stats && stats.overdueIssues > 0 && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-semibold">
            ⚠️ {stats.overdueIssues} book(s) overdue
          </p>
          <p className="text-red-600 text-sm">
            Review overdue books and send reminders.
          </p>
        </div>
      )}

      {stats && stats.unpaidFines > 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700 font-semibold">
            💰 ${stats.unpaidFines.toFixed(2)} in unpaid fines
          </p>
          <p className="text-yellow-600 text-sm">
            Follow up with members regarding outstanding fines.
          </p>
        </div>
      )}
    </div>
  );
}
