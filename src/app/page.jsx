'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();  //retrive the data from the context api
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated) {
      router.push('/seats');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Train Seat Reservation System</h1>
        <p className="text-xl mb-8">Book your seats easily and efficiently.</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {!isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => router.push('/login')}
                  className="btn btn-primary"
                >
                  Login
                </button>
                <button 
                  onClick={() => router.push('/register')}
                  className="btn btn-secondary"
                >
                  Register
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}