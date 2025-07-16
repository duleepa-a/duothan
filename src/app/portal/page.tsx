// app/portal/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Code2, Trophy, Users, Zap, Star, ChevronRight, Menu, X, Github, Mail, Phone, MapPin, Clock, Target, Award, Play, Lock, User, Shield, CheckCircle } from 'lucide-react';
import Portal from './portal';

interface Team {
    id: string;
    name: string;
    email: string;
    members: string[];
    points: number;
    challengesCompleted: number;
    lastActive: Date;
}

interface Admin {
    id: string;
    username: string;
    email: string;
}

interface Challenge {
    id: string;
    title: string;
    description: string;
    algorithmic: {
        problem: string;
        constraints: string;
        examples: Array<{input: string; output: string}>;
        flag: string;
    };
    buildathon: {
        problem: string;
        requirements: string[];
        deadline: Date;
    };
    points: number;
    active: boolean;
    createdAt: Date;
}

interface Submission {
    id: string;
    teamId: string;
    challengeId: string;
    type: 'algorithmic' | 'buildathon';
    content: string;
    status: 'pending' | 'accepted' | 'rejected';
    submittedAt: Date;
    points: number;
}

const PortalPage = () => {
    const [currentUser, setCurrentUser] = useState<Team | Admin | null>(null);
    const [userType, setUserType] = useState<'team' | 'admin' | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [userTypeSelection, setUserTypeSelection] = useState<'team' | 'admin' | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock data
    const [teams, setTeams] = useState<Team[]>([
        {
            id: '1',
            name: 'Code Warriors',
            email: 'warriors@example.com',
            members: ['Alice', 'Bob', 'Charlie'],
            points: 150,
            challengesCompleted: 3,
            lastActive: new Date()
        },
        {
            id: '2',
            name: 'Bug Hunters',
            email: 'hunters@example.com',
            members: ['David', 'Eva'],
            points: 120,
            challengesCompleted: 2,
            lastActive: new Date()
        }
    ]);

    const [challenges, setChallenges] = useState<Challenge[]>([
        {
            id: '1',
            title: 'Array Manipulation Challenge',
            description: 'Solve array problems and build a sorting visualizer',
            algorithmic: {
                problem: 'Given an array of integers, find the maximum subarray sum.',
                constraints: 'Array length: 1 ≤ n ≤ 10^5',
                examples: [
                    { input: '[1, -3, 2, 1, -1]', output: '3' },
                    { input: '[-2, -3, -1]', output: '-1' }
                ],
                flag: 'CTF{max_subarray_sum}'
            },
            buildathon: {
                problem: 'Build a sorting algorithm visualizer web application',
                requirements: [
                    'Implement at least 3 sorting algorithms',
                    'Create animated visualization',
                    'Add speed controls',
                    'Responsive design'
                ],
                deadline: new Date('2025-08-01')
            },
            points: 100,
            active: true,
            createdAt: new Date()
        }
    ]);

    const [submissions, setSubmissions] = useState<Submission[]>([]);

    // Authentication functions
    const handleTeamAuth = async (formData: any) => {
        setLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (authMode === 'login') {
                // Mock login
                const team = teams.find(t => t.email === formData.email);
                if (team) {
                    setCurrentUser(team);
                    setUserType('team');
                    localStorage.setItem('user', JSON.stringify(team));
                    localStorage.setItem('userType', 'team');
                } else {
                    setError('Invalid credentials');
                }
            } else {
                // Mock registration
                const newTeam: Team = {
                    id: Date.now().toString(),
                    name: formData.teamName,
                    email: formData.email,
                    members: formData.members || [],
                    points: 0,
                    challengesCompleted: 0,
                    lastActive: new Date()
                };
                setTeams([...teams, newTeam]);
                setCurrentUser(newTeam);
                setUserType('team');
                localStorage.setItem('user', JSON.stringify(newTeam));
                localStorage.setItem('userType', 'team');
            }
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminAuth = async (formData: any) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                const admin: Admin = {
                    id: data.data.user.id,
                    username: data.data.user.username,
                    email: `${data.data.user.username}@codechallenge.com`
                };
                setCurrentUser(admin);
                setUserType('admin');
                localStorage.setItem('user', JSON.stringify(admin));
                localStorage.setItem('userType', 'admin');
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Call logout API if user is admin
            if (userType === 'admin') {
                await fetch('/api/admin/auth/logout', {
                    method: 'POST',
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        setCurrentUser(null);
        setUserType(null);
        setUserTypeSelection(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
    };

    // Check for existing session
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedUserType = localStorage.getItem('userType');

        if (savedUser && savedUserType) {
            setCurrentUser(JSON.parse(savedUser));
            setUserType(savedUserType as 'team' | 'admin');
        }
    }, []);

    // User Type Selection Screen
    const UserTypeSelection = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Code2 className="w-8 h-8 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white">CodeChallenge</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to Portal</h1>
                    <p className="text-gray-400">Choose your access type</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setUserTypeSelection('team')}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black p-3 rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-white">Team Access</h3>
                                <p className="text-gray-400">Participate in challenges and compete</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white ml-auto" />
                        </div>
                    </button>

                    <button
                        onClick={() => setUserTypeSelection('admin')}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black p-3 rounded-lg">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-white">Admin Access</h3>
                                <p className="text-gray-400">Manage challenges and monitor platform</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white ml-auto" />
                        </div>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <a href="/" className="text-gray-400 hover:text-white transition-colors">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );

    // Team Authentication Forms
    const TeamAuth = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <button
                        onClick={() => setUserTypeSelection(null)}
                        className="text-gray-400 hover:text-white mb-4 flex items-center"
                    >
                        ← Back to selection
                    </button>
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Users className="w-8 h-8 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white">Team Portal</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {authMode === 'login' ? 'Welcome Back' : 'Create Team'}
                    </h1>
                    <p className="text-gray-400">
                        {authMode === 'login' ? 'Sign in to your team account' : 'Register your team to get started'}
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = Object.fromEntries(formData);
                        handleTeamAuth(data);
                    }}>
                        {authMode === 'register' && (
                            <div className="mb-4">
                                <label className="block text-white text-sm font-medium mb-2">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    name="teamName"
                                    required
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Enter team name"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-white text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter password"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Team'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setAuthMode(authMode === 'login' ? 'register' : 'login');
                                setError('');
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {authMode === 'login' ? "Don't have a team? Register here" : "Already have a team? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Admin Authentication Form
    const AdminAuth = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <button
                        onClick={() => setUserTypeSelection(null)}
                        className="text-gray-400 hover:text-white mb-4 flex items-center"
                    >
                        ← Back to selection
                    </button>
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-8 h-8 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white">Admin Portal</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gray-400">Sign in with admin credentials</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = Object.fromEntries(formData);
                        handleAdminAuth(data);
                    }}>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                required
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter admin username"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter admin password"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-gray-400 text-sm">
                        <p>Demo credentials: admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render appropriate component based on auth state
    if (!currentUser) {
        if (!userTypeSelection) {
            return <UserTypeSelection />;
        }

        if (userTypeSelection === 'team') {
            return <TeamAuth />;
        }

        if (userTypeSelection === 'admin') {
            return <AdminAuth />;
        }
    }

    // Render the main portal
    if (currentUser && userType) {
        return (
            <Portal
                user={currentUser}
                userType={userType}
                onLogout={handleLogout}
                teams={teams}
                setTeams={setTeams}
                challenges={challenges}
                setChallenges={setChallenges}
                submissions={submissions}
                setSubmissions={setSubmissions}
            />
        );
    }
};

export default PortalPage;