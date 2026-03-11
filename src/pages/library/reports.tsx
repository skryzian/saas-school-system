'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('dashboard');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport(reportType);
  }, [reportType]);

  const fetchReport = async (type) => {
    try {
      setLoading(true);
      let endpoint = '';

      switch (type) {
        case 'dashboard':
          endpoint = '/library/reports/dashboard/stats';
          break;
        case 'inventory':
          endpoint = '/library/reports/inventory';
          break;
        case 'overdue':
          endpoint = '/library/reports/overdue';
          break;
        case 'fines':
          endpoint = '/library/reports/fines';
          break;
        case 'popular':
          endpoint = '/library/reports/popular-books';
          break;
        default:
          endpoint = '/library/reports/dashboard/stats';
      }

      const response = await api.get(endpoint);
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderReport = () => {
    if (!reportData) return <div className="text-gray-500">No data available</div>;

    switch (reportType) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(reportData).map(([key, value]) => (
              <div key={key} className="bg-blue-50 rounded-lg p-6 shadow">
                <p className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-blue-600 text-3xl font-bold mt-2">
                  {typeof value === 'number' && value.toFixed ? value.toFixed(2) : value}
                </p>
              </div>
            ))}
          </div>
        );

      case 'overdue':
        return (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Book Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Member</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{item.book?.title}</td>
                      <td className="px-6 py-4">{item.libraryUser?.libraryId}</td>
                      <td className="px-6 py-4">{new Date(item.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-red-600 font-semibold">
                          {Math.ceil(
                            (new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24)
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No overdue books</div>
            )}
          </div>
        );

      case 'inventory':
        return (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Available</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.totalCopies}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-semibold">{item.availableCopies}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-600 font-semibold">
                          {item.totalCopies - item.availableCopies}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No data available</div>
            )}
          </div>
        );

      default:
        return <div className="text-gray-500">Select a report type</div>;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Library Reports</h1>

      {/* Report Type Selector */}
      <div className="mb-6 flex gap-4">
        {[
          { value: 'dashboard', label: 'Dashboard' },
          { value: 'inventory', label: 'Inventory' },
          { value: 'overdue', label: 'Overdue Books' },
          { value: 'fines', label: 'Fines' },
          { value: 'popular', label: 'Popular Books' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setReportType(option.value)}
            className={`px-4 py-2 rounded font-semibold ${
              reportType === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading report...</div>
      ) : (
        renderReport()
      )}
    </div>
  );
}
