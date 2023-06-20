"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GetData() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log('Error:', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className='container mx-auto'>
      <h1>GetData</h1>
      <ul role="list" className="divide-y divide-gray-100">
      {users.map(user => (
        <li key={user.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{user.name}</p>
              <Link href={`mail:${user.email}`} className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="text-md leading-6 text-gray-900 text-bold">{user.company.name}</p>
            <p className="text-sm leading-6 text-gray-500">{user.website}</p>
          </div>
          <Link href={`/`}>Click Here</Link>
        </li>
      ))}
    </ul>
</div>
  );
}
