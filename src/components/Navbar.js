'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/seats" className="text-xl font-bold">
           Seat Booking
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/seats" className="hover:text-gray-300">
            Book Seats
          </Link>
          <Link href="/bookings" className="hover:text-gray-300">
            My Bookings
          </Link>
          
          <div className="flex items-center ml-4">
            <span className="mr-2">
              Welcome, {user?.username || 'User'}
            </span>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}