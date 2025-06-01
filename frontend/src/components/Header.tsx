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
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">ShortLink</span>
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
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">ShortLink</span>
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