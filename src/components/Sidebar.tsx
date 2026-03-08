'use client';

import React from 'react';
import { useAuthStore } from '@/context/authStore';
import Link from 'next/link';

export default function Sidebar() {
  const { user } = useAuthStore();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'] },
    { href: '/students', label: 'Students', roles: ['super_admin', 'school_admin', 'teacher'] },
    { href: '/teachers', label: 'Teachers', roles: ['super_admin', 'school_admin'] },
    { href: '/classes', label: 'Classes', roles: ['super_admin', 'school_admin'] },
    { href: '/attendance', label: 'Attendance', roles: ['school_admin', 'teacher', 'student'] },
    { href: '/exams', label: 'Exams', roles: ['super_admin', 'school_admin', 'teacher', 'student'] },
    { href: '/finance', label: 'Finance', roles: ['super_admin', 'school_admin', 'parent'] },
    { href: '/announcements', label: 'Announcements', roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'] },
    { href: '/library', label: 'Library', roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'] },
    { href: '/schools', label: 'Schools', roles: ['super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-gradient-to-b from-primary-700 to-primary-900 text-white shadow-lg">
      <div className="p-6 border-b border-primary-600">
        <h1 className="text-2xl font-bold">SchoolSaaS</h1>
        <p className="text-sm text-primary-200 mt-1">{user?.role.replace('_', ' ')}</p>
      </div>

      <nav className="mt-6 px-4">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block py-3 px-4 rounded-lg mb-2 hover:bg-primary-600 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-primary-600">
        <Link href="/profile" className="text-sm hover:underline">
          {user?.firstName} {user?.lastName}
        </Link>
      </div>
    </aside>
  );
}
