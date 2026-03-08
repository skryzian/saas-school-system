'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [memberType, setMemberType] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [page, memberType]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (memberType) params.append('memberType', memberType);

      const response = await api.get(`/library/members?${params}`);
      setMembers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (memberId) => {
    if (window.confirm('Are you sure you want to deactivate this member?')) {
      try {
        await api.put(`/library/members/${memberId}/deactivate`);
        fetchMembers();
      } catch (error) {
        console.error('Error deactivating member:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Library Members</h1>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={memberType}
          onChange={(e) => {
            setMemberType(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Member Types</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="staff">Staff</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No members found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Library ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Fine Balance
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{member.libraryId}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {member.user?.firstName} {member.user?.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {member.memberType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {member.fineBalance > 0 ? (
                      <span className="text-red-600 font-semibold">${member.fineBalance.toFixed(2)}</span>
                    ) : (
                      <span className="text-green-600">No fines</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <a href={`/library/members/${member.id}`} className="text-blue-500 hover:underline">
                      View
                    </a>
                    <button
                      onClick={() => handleDeactivate(member.id)}
                      className="text-red-500 hover:underline"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded ${
                p === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
