"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10 bg-gradient-to-r from-gray-900 via-blue-900 to-black backdrop-blur-md bg-opacity-80 border-b border-blue-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Shrinkr Logo */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0 0l5.25 5.25" />
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">Shrinkr</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10 bg-gradient-to-r from-gray-900 via-blue-900 to-black backdrop-blur-md bg-opacity-80 border-b border-blue-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          {/* Shrinkr Logo */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0 0l5.25 5.25" />
            </svg>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">Shrinkr</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          {session && (
            <Link href="/dashboard" className="text-blue-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 font-medium relative group">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="hidden md:block px-4 py-2 text-blue-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105">
                Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2">
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full border-2 border-blue-400/50"
                    />
                  )}
                  <span className="text-sm text-blue-200">Hi, {session.user?.name}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden md:block px-4 py-2 text-blue-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105">
                Log in
              </Link>
              <Link href="/auth/signin" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 font-medium glow-button">
                Sign up
              </Link>
            </>
          )}
          
          <div className="md:hidden">
            <button className="text-blue-300 hover:text-cyan-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 