import React, { useState, useEffect } from 'react';
import { Code2, Trophy, Users, Zap, Star, ChevronRight, Menu, X, Github, Mail, Phone, MapPin, Clock, Target, Award, Play } from 'lucide-react';
import Link from 'next/link';


const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Code2 className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white">CodeChallenge</span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="#home" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Home</a>
                            <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Features</a>
                            <a href="#challenges" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Challenges</a>
                            <a href="#leaderboard" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Leaderboard</a>
                            <a href="#contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Contact</a>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/login">
                            <button className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors">
                                Sign In
                            </button>
                        </Link>
                        <Link href="/signup/registration">
                            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all font-semibold">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="#home" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Home</a>
                        <a href="#features" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Features</a>
                        <a href="#challenges" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Challenges</a>
                        <a href="#leaderboard" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Leaderboard</a>
                        <a href="#contact" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Contact</a>
                        <div className="pt-4 pb-3 border-t border-gray-700">
                        <Link href="/login">
                            <button className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 text-base font-medium cursor-pointer">
                                Sign in
                            </button>
                        </Link>
                        <Link href="/signup/registration">
                            <button className="w-full mt-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-2 rounded-lg text-base font-medium font-semibold">
                                Get Started
                            </button>
                        </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar