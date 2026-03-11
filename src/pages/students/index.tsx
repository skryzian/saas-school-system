'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import api from '@/lib/api';
import { useAuthStore } from '@/context/authStore';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const { user } = useAuthStore();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/students', {
        params: { schoolId: user?.id, page, limit: 10 },
      });
      setStudents(response.data.students);
      setTotal(response.data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Add New Student
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Class</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.User.firstName} {student.User.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.User.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.Class.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-primary-600 hover:text-primary-700 font-medium">View</button>
                      <button className="ml-4 text-orange-600 hover:text-orange-900 font-medium">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing page {page} of {Math.ceil(total / 10)} ({total} total)
          </p>
          <div className="space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 10 >= total}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
