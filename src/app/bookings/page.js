'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import { getUserBookings, cancelBooking } from '@/lib/allApi';

export default function Bookings() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      setError('');
      setSuccess('');
      
      await cancelBooking(bookingId);
      
      // Update bookings list
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      
      setBookings(updatedBookings);
      setSuccess('Booking cancelled successfully!');
    } catch (error) {
      setError(error.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="bg-white rounded-md shadow-md p-8 text-center">
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-md shadow-md p-8 text-center">
            <p>You have no bookings yet.</p>
            <button 
              onClick={() => router.push('/seats')}
              className="btn btn-primary mt-4"
            >
              Book Seats
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow-md">
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking.id} className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        Booking #{booking.id}
                      </p>
                      <p className="text-gray-600">
                        {formatDate(booking.created_at)}
                      </p>
                      <p className={`mt-2 font-medium ${
                        booking.status === 'active' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">Seats:</span>{' '}
                        {booking.seat_numbers.sort((a, b) => a - b).join(', ')}
                      </p>
                    </div>
                    
                    {booking.status === 'active' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className={`btn btn-danger mt-4 sm:mt-0 ${
                          cancellingId === booking.id ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}