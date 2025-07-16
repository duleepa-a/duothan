"use client"
import React, { useState, useEffect } from 'react';
import { Code2, Trophy, Users, Zap, Star, ChevronRight, Menu, X, Github, Mail, Phone, MapPin, Clock, Target, Award, Play } from 'lucide-react';
import NavBar from './homeComponents/NavBar';

// Hero Section Component
const HeroSection = () => {
    return (
        <section id="home" className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Code. Compete. <br />
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Conquer.
            </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Join the ultimate coding challenge platform where teams solve algorithmic problems and build innovative solutions in real-time competitions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg">
                            Start Competing
                        </button>
                        <button className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
                            <Play className="w-5 h-5" />
                            <span>Watch Demo</span>
                        </button>
                    </div>

                    <div className="mt-8">
              <a 
                href="/admin/login" 
                className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Admin Access
              </a>
            </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                            <div className="text-3xl font-bold text-white mb-2">500+</div>
                            <div className="text-gray-300">Active Teams</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                            <div className="text-3xl font-bold text-white mb-2">1,200+</div>
                            <div className="text-gray-300">Challenges Solved</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                            <div className="text-3xl font-bold text-white mb-2">50+</div>
                            <div className="text-gray-300">Live Competitions</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// What We Offer Component
const WhatWeOffer = () => {
    const features = [
        {
            icon: <Code2 className="w-8 h-8" />,
            title: "Algorithmic Challenges",
            description: "Solve complex algorithmic problems with integrated Judge0 API for real-time code execution and validation."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Buildathon Projects",
            description: "Build innovative solutions and submit your GitHub repositories for comprehensive project evaluation."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Work together with your team members in a seamless collaborative environment with progress tracking."
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Real-time Leaderboard",
            description: "Track your team's progress and compete with others on dynamic leaderboards updated in real-time."
        }
    ];

    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What We Offer
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A comprehensive platform designed to challenge, educate, and inspire the next generation of developers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-yellow-400">
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black p-3 rounded-lg w-fit mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// App Details Component
const AppDetails = () => {
    return (
        <section id="challenges" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Two-Phase Challenge System
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Our unique challenge structure combines algorithmic problem-solving with practical application development.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-yellow-100 p-2 rounded-lg">
                                    <Code2 className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phase 1: Algorithmic Challenge</h3>
                                    <p className="text-gray-600">Solve complex algorithmic problems using our integrated code editor with multiple language support and real-time execution.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Target className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phase 2: Buildathon</h3>
                                    <p className="text-gray-600">Build innovative solutions and submit your GitHub repository. Unlock this phase by solving the algorithmic challenge.</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all">
                            Explore Challenges
                        </button>
                    </div>

                    <div className="relative">
                        <div className="bg-gray-900 rounded-lg p-6 shadow-2xl">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="text-green-400 font-mono text-sm">
                                <div className="mb-2">def solve_challenge(input_data):</div>
                                <div className="ml-4 mb-2">result = process_algorithm(input_data)</div>
                                <div className="ml-4 mb-2">return validate_output(result)</div>
                                <div className="mb-4"></div>
                                <div className="text-gray-400"># Output: Challenge solved! 🎉</div>
                                <div className="text-gray-400"># Flag: CTF{`your_flag_here`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Home Insight Banner Component
const HomeInsightBanner = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                    Ready to Level Up Your Coding Skills?
                </h2>
                <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
                    Join thousands of developers who are pushing their limits, learning new technologies, and building amazing projects through our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-black text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
                        Register Your Team
                    </button>
                    <button className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-yellow-400 transition-all">
                        View Documentation
                    </button>
                </div>
            </div>
        </section>
    );
};

// Home Info Cards Component
const HomeInfoCards = () => {
    const stats = [
        {
            number: "24/7",
            label: "Platform Availability",
            description: "Access challenges and compete anytime, anywhere"
        },
        {
            number: "15+",
            label: "Programming Languages",
            description: "Support for all major programming languages"
        },
        {
            number: "Real-time",
            label: "Code Execution",
            description: "Instant feedback with Judge0 API integration"
        },
        {
            number: "Global",
            label: "Community",
            description: "Connect with developers worldwide"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Platform Highlights
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover what makes our platform the preferred choice for coding competitions and skill development.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text mb-2">
                                {stat.number}
                            </div>
                            <div className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</div>
                            <p className="text-gray-600">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Home Testimonials Component
const HomeTestimonials = () => {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Software Engineer",
            company: "Tech Corp",
            image: "https://images.unsplash.com/photo-1494790108755-2616b99c6464?w=150&h=150&fit=crop&crop=face",
            content: "This platform transformed how our team approaches coding challenges. The real-time feedback and collaborative environment are game-changers."
        },
        {
            name: "Alex Rodriguez",
            role: "CS Student",
            company: "MIT",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            content: "The two-phase challenge system is brilliant. It bridges the gap between algorithmic thinking and practical application development."
        },
        {
            name: "Maria Kim",
            role: "Team Lead",
            company: "Startup Inc",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            content: "Our productivity increased by 40% after using this platform. The leaderboard feature keeps everyone motivated and engaged."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Developers Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of satisfied developers who have elevated their coding skills with our platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                            <div className="flex items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-gray-600">{testimonial.role} at {testimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// App Link Component
const AppLink = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Join our community of passionate developers and take your coding skills to the next level.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg">
                        Create Team Account
                    </button>
                    <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                        <span>Learn more</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer id="contact" className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                <Code2 className="w-6 h-6 text-black" />
                            </div>
                            <span className="text-xl font-bold">CodeChallenge</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Empowering developers worldwide through innovative coding challenges and collaborative learning experiences.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Mail className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Challenges</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2 text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>support@codechallenge.com</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-400">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>San Francisco, CA</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 CodeChallenge. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// Auth Provider Component (simplified)
// @ts-ignore


// Main Home Component
const Home = () => {
    return (
        <main className="min-h-screen">
            <NavBar/>
            <HeroSection />
            <WhatWeOffer />
            <AppDetails />
            <HomeInsightBanner />
            <HomeInfoCards />
            <HomeTestimonials />
            <AppLink />
            <Footer />
        </main>
    );
};

export default Home;