'use client'

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Code2, Menu, User, UserCircle, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { status, data: session } = useSession();
  
  console.log('Session Data:', session);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const adminLinks = [
    { href: '/admin/', label: 'Dashboard' },
    { href: '/admin/teams', label: 'Teams' },
    { href: '/admin/challenges', label: 'Challenges' },
    { href: '/admin/submissions', label: 'Submissions' },
  ];

  const competitorLinks = [
    { href: '/competitor/', label: 'Home' },
    { href: '#leaderboard', label: 'Leaderboard' },
    { href: '/competitor/teams', label: 'Teams' },
    { href: '/competitor/submissions', label: 'Submissions' },
    { href: '#contact', label: 'Contact' },
  ];

  const links =
    session?.user?.role === 'ADMIN' ? adminLinks : competitorLinks;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Oasis</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link href={
                  session.user?.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : '/competitor'
                }>
                  {
                    session.user?.teamName ? (
                      <div className="text-white text-sm px-4 py-2 bg-gray-800 rounded-lg">
                        {session.user.teamName}
                      </div>
                    ) : session.user?.role === 'ADMIN' ? 

                    (
                      <div className="text-white text-sm px-4 py-2 bg-gray-800 rounded-lg">
                          <UserCircle className="w-5 h-5 inline-block mr-2" />
                      </div>
                    )
                    
                    : (
                      <div className="text-white text-sm px-4 py-2 bg-gray-800 rounded-lg">
                        No Team
                      </div>
                    )
                  }
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-white text-sm px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup/registration">
                  <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all font-semibold cursor-pointer">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="block text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
