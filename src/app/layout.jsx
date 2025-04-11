'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/authContext';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster   position="bottom-right"/>
        </AuthProvider>
      </body>
    </html>
  );
}