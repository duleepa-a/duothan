// app/portal/portal.tsx
"use client"
import React, { useState, useEffect } from 'react';
import {
    Code2, Trophy, Users, Zap, Star, ChevronRight, Menu, X, Github, Mail, Phone, MapPin,
    Clock, Target, Award, Play, Lock, User, Shield, CheckCircle, Plus, Edit3, Trash2,
    Search, Filter, Upload, Download, Eye, Settings, BarChart3, Activity, Calendar,
    FileText, Code, Flag, Send, CheckSquare, AlertCircle, Loader
} from 'lucide-react';

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

interface PortalProps {
    user: Team | Admin;
    userType: 'team' | 'admin';
    onLogout: () => void;
    teams: Team[];
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    challenges: Challenge[];
    setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
    submissions: Submission[];
    setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
}

const Portal: React.FC<PortalProps> = ({
                                           user,
                                           userType,
                                           onLogout,
                                           teams,
                                           setTeams,
                                           challenges,
                                           setChallenges,
                                           submissions,
                                           setSubmissions
                                       }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [challengePhase, setChallengePhase] = useState<'algorithmic' | 'buildathon'>('algorithmic');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [executionResult, setExecutionResult] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [flagInput, setFlagInput] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [showCreateChallenge, setShowCreateChallenge] = useState(false);

    // Navigation Component
    const Navigation = () => {
        const isAdmin = userType === 'admin';
        const userName = userType === 'team' ? (user as Team).name : (user as Admin).username;

        const navItems = isAdmin ? [
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
            { id: 'challenges', label: 'Manage Challenges', icon: <Target className="w-5 h-5" /> },
            { id: 'teams', label: 'Team Management', icon: <Users className="w-5 h-5" /> },
            { id: 'submissions', label: 'Submissions', icon: <FileText className="w-5 h-5" /> }
        ] : [
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
            { id: 'challenges', label: 'Challenges', icon: <Target className="w-5 h-5" /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> }
        ];

        return (
            <nav className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                    <Code2 className="w-6 h-6 text-black" />
                                </div>
                                <span className="text-xl font-bold text-white">CodeChallenge</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            activeTab === item.id
                                                ? 'bg-yellow-400 text-black'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-white">
                                <div className="text-sm font-medium">{userName}</div>
                                <div className="text-xs text-gray-400">
                                    {isAdmin ? 'Administrator' : 'Team Member'}
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    };

    // Admin Dashboard
    const AdminDashboard = () => {
        const stats = [
            { label: 'Registered Teams', value: teams.length, icon: <Users className="w-6 h-6" /> },
            { label: 'Active Challenges', value: challenges.filter(c => c.active).length, icon: <Target className="w-6 h-6" /> },
            { label: 'Total Submissions', value: submissions.length, icon: <FileText className="w-6 h-6" /> },
            { label: 'Avg Team Points', value: Math.round(teams.reduce((acc, team) => acc + team.points, 0) / teams.length) || 0, icon: <Trophy className="w-6 h-6" /> }
        ];

        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-gray-400">{stat.icon}</div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                            </div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Top Teams</h3>
                        <div className="space-y-3">
                            {teams.sort((a, b) => b.points - a.points).slice(0, 5).map((team, index) => (
                                <div key={team.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-white">{team.name}</span>
                                    </div>
                                    <span className="text-yellow-400 font-semibold">{team.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {submissions.slice(0, 5).map((submission) => {
                                const team = teams.find(t => t.id === submission.teamId);
                                const challenge = challenges.find(c => c.id === submission.challengeId);
                                return (
                                    <div key={submission.id} className="flex items-center justify-between">
                                        <div className="text-white text-sm">
                                            <span className="font-medium">{team?.name}</span>
                                            <span className="text-gray-400"> submitted {submission.type}</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs ${
                                            submission.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {submission.status}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Admin Challenge Management
    const AdminChallenges = () => {
        const handleCreateChallenge = (formData: any) => {
            const newChallenge: Challenge = {
                id: Date.now().toString(),
                title: formData.title,
                description: formData.description,
                algorithmic: {
                    problem: formData.algorithmicProblem,
                    constraints: formData.constraints,
                    examples: [
                        { input: formData.exampleInput1, output: formData.exampleOutput1 },
                        { input: formData.exampleInput2, output: formData.exampleOutput2 }
                    ],
                    flag: formData.flag
                },
                buildathon: {
                    problem: formData.buildathonProblem,
                    requirements: formData.requirements.split('\n').filter((req: string) => req.trim()),
                    deadline: new Date(formData.deadline)
                },
                points: parseInt(formData.points),
                active: true,
                createdAt: new Date()
            };
            setChallenges([...challenges, newChallenge]);
            setShowCreateChallenge(false);
        };

        const handleDeleteChallenge = (id: string) => {
            setChallenges(challenges.filter(c => c.id !== id));
        };

        const handleToggleActive = (id: string) => {
            setChallenges(challenges.map(c =>
                c.id === id ? { ...c, active: !c.active } : c
            ));
        };

        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Manage Challenges</h1>
                    <button
                        onClick={() => setShowCreateChallenge(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Challenge</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {challenges.map((challenge) => (
                        <div key={challenge.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                                    <p className="text-gray-400 mt-1">{challenge.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`px-2 py-1 rounded text-xs ${
                                        challenge.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {challenge.active ? 'Active' : 'Inactive'}
                                    </div>
                                    <button
                                        onClick={() => handleToggleActive(challenge.id)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteChallenge(challenge.id)}
                                        className="text-gray-400 hover:text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Algorithmic Phase</h4>
                                    <p className="text-sm text-gray-400">{challenge.algorithmic.problem}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Buildathon Phase</h4>
                                    <p className="text-sm text-gray-400">{challenge.buildathon.problem}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    Points: <span className="text-yellow-400">{challenge.points}</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Created: {challenge.createdAt.toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showCreateChallenge && (
                    <CreateChallengeModal
                        onClose={() => setShowCreateChallenge(false)}
                        onSubmit={handleCreateChallenge}
                    />
                )}
            </div>
        );
    };

    // Create Challenge Modal
    const CreateChallengeModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => {
        const [formData, setFormData] = useState({
            title: '',
            description: '',
            algorithmicProblem: '',
            constraints: '',
            exampleInput1: '',
            exampleOutput1: '',
            exampleInput2: '',
            exampleOutput2: '',
            flag: '',
            buildathonProblem: '',
            requirements: '',
            deadline: '',
            points: '100'
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Create New Challenge</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Algorithmic Problem</label>
                            <textarea
                                value={formData.algorithmicProblem}
                                onChange={(e) => setFormData({...formData, algorithmicProblem: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Constraints</label>
                            <textarea
                                value={formData.constraints}
                                onChange={(e) => setFormData({...formData, constraints: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Example Input 1</label>
                                <input
                                    type="text"
                                    value={formData.exampleInput1}
                                    onChange={(e) => setFormData({...formData, exampleInput1: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Example Output 1</label>
                                <input
                                    type="text"
                                    value={formData.exampleOutput1}
                                    onChange={(e) => setFormData({...formData, exampleOutput1: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Example Input 2</label>
                                <input
                                    type="text"
                                    value={formData.exampleInput2}
                                    onChange={(e) => setFormData({...formData, exampleInput2: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Example Output 2</label>
                                <input
                                    type="text"
                                    value={formData.exampleOutput2}
                                    onChange={(e) => setFormData({...formData, exampleOutput2: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Flag</label>
                            <input
                                type="text"
                                value={formData.flag}
                                onChange={(e) => setFormData({...formData, flag: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Buildathon Problem</label>
                            <textarea
                                value={formData.buildathonProblem}
                                onChange={(e) => setFormData({...formData, buildathonProblem: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Requirements (one per line)</label>
                            <textarea
                                value={formData.requirements}
                                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                                <input
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                                <input
                                    type="number"
                                    value={formData.points}
                                    onChange={(e) => setFormData({...formData, points: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg"
                            >
                                Create Challenge
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Admin Team Management
    const AdminTeamManagement = () => {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Team Management</h1>

                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Members</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Completed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Active</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                            {teams.map((team) => (
                                <tr key={team.id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{team.name}</div>
                                        <div className="text-sm text-gray-400">{team.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{team.members.length} members</div>
                                        <div className="text-sm text-gray-400">{team.members.join(', ')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-yellow-400 font-semibold">{team.points}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-white">{team.challengesCompleted}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-gray-400">{team.lastActive.toLocaleDateString()}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Admin Submissions
    const AdminSubmissions = () => {
        const handleUpdateSubmission = (id: string, status: 'accepted' | 'rejected') => {
            setSubmissions(submissions.map(sub => {
                if (sub.id === id) {
                    const updatedSub = { ...sub, status };
                    if (status === 'accepted') {
                        // Update team points
                        const team = teams.find(t => t.id === sub.teamId);
                        if (team) {
                            setTeams(teams.map(t =>
                                t.id === sub.teamId
                                    ? { ...t, points: t.points + sub.points, challengesCompleted: t.challengesCompleted + 1 }
                                    : t
                            ));
                        }
                    }
                    return updatedSub;
                }
                return sub;
            }));
        };

        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Submissions</h1>

                <div className="space-y-6">
                    {submissions.map((submission) => {
                        const team = teams.find(t => t.id === submission.teamId);
                        const challenge = challenges.find(c => c.id === submission.challengeId);

                        return (
                            <div key={submission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{team?.name}</h3>
                                        <p className="text-gray-400">{challenge?.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {submission.type} • {submission.submittedAt.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-3 py-1 rounded-full text-sm ${
                                            submission.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {submission.status}
                                        </div>
                                        {submission.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUpdateSubmission(submission.id, 'accepted')}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateSubmission(submission.id, 'rejected')}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-700 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Submission Content</h4>
                                    <pre className="text-sm text-gray-400 whitespace-pre-wrap overflow-x-auto">
                    {submission.content}
                  </pre>
                                </div>

                                <div className="mt-4 text-sm text-gray-400">
                                    Points: <span className="text-yellow-400">{submission.points}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Team Dashboard
    const TeamDashboard = () => {
        const currentTeam = user as Team;
        const completedChallenges = challenges.filter(c =>
            submissions.some(s => s.teamId === currentTeam.id && s.challengeId === c.id && s.status === 'accepted')
        );

        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Team Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            <div className="text-2xl font-bold text-white">{currentTeam.points}</div>
                        </div>
                        <div className="text-gray-400 text-sm">Total Points</div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-6 h-6 text-green-400" />
                            <div className="text-2xl font-bold text-white">{completedChallenges.length}</div>
                        </div>
                        <div className="text-gray-400 text-sm">Completed Challenges</div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-6 h-6 text-blue-400" />
                            <div className="text-2xl font-bold text-white">{currentTeam.members.length}</div>
                        </div>
                        <div className="text-gray-400 text-sm">Team Members</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Team Members</h3>
                        <div className="space-y-2">
                            {currentTeam.members.map((member, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-white">{member}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Recent Submissions</h3>
                        <div className="space-y-3">
                            {submissions
                                .filter(s => s.teamId === currentTeam.id)
                                .slice(0, 5)
                                .map((submission) => {
                                    const challenge = challenges.find(c => c.id === submission.challengeId);
                                    return (
                                        <div key={submission.id} className="flex items-center justify-between">
                                            <div className="text-white text-sm">
                                                <span className="font-medium">{challenge?.title}</span>
                                                <span className="text-gray-400 block">{submission.type}</span>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs ${
                                                submission.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {submission.status}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Team Challenges
    const TeamChallenges = () => {
        const currentTeam = user as Team;
        const activeChallenges = challenges.filter(c => c.active);

        const handleChallengeClick = (challenge: Challenge) => {
            setSelectedChallenge(challenge);
            setActiveTab('challenge-detail');
        };

        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Available Challenges</h1>

                <div className="grid grid-cols-1 gap-6">
                    {activeChallenges.map((challenge) => {
                        const isCompleted = submissions.some(
                            s => s.teamId === currentTeam.id && s.challengeId === challenge.id && s.status === 'accepted'
                        );

                        return (
                            <div
                                key={challenge.id}
                                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                                onClick={() => handleChallengeClick(challenge)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                                        <p className="text-gray-400 mt-1">{challenge.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {isCompleted && (
                                            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                                                Completed
                                            </div>
                                        )}
                                        <div className="text-yellow-400 font-semibold">{challenge.points} pts</div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="text-sm text-gray-400">
                                    Created: {challenge.createdAt.toLocaleDateString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Challenge Detail View
    const ChallengeDetail = () => {
        if (!selectedChallenge) return null;

        const currentTeam = user as Team;
        const teamSubmissions = submissions.filter(
            s => s.teamId === currentTeam.id && s.challengeId === selectedChallenge.id
        );

        const handleCodeExecution = async () => {
            setIsExecuting(true);
            // Simulate code execution
            setTimeout(() => {
                setExecutionResult({
                    success: true,
                    output: "Test cases passed!",
                    runtime: "45ms"
                });
                setIsExecuting(false);
            }, 2000);
        };

        const handleAlgorithmicSubmit = () => {
            if (flagInput === selectedChallenge.algorithmic.flag) {
                const newSubmission: Submission = {
                    id: Date.now().toString(),
                    teamId: currentTeam.id,
                    challengeId: selectedChallenge.id,
                    type: 'algorithmic',
                    content: `Code: ${code}\nFlag: ${flagInput}`,
                    status: 'pending',
                    submittedAt: new Date(),
                    points: selectedChallenge.points
                };
                setSubmissions([...submissions, newSubmission]);
                alert('Algorithmic solution submitted successfully!');
            } else {
                alert('Incorrect flag! Please try again.');
            }
        };

        const handleBuildathonSubmit = () => {
            if (githubLink.trim()) {
                const newSubmission: Submission = {
                    id: Date.now().toString(),
                    teamId: currentTeam.id,
                    challengeId: selectedChallenge.id,
                    type: 'buildathon',
                    content: `GitHub Link: ${githubLink}`,
                    status: 'pending',
                    submittedAt: new Date(),
                    points: selectedChallenge.points
                };
                setSubmissions([...submissions, newSubmission]);
                alert('Buildathon solution submitted successfully!');
            } else {
                alert('Please provide a GitHub link.');
            }
        };

        return (
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('challenges')}
                        className="text-gray-400 hover:text-white"
                    >
                        <ChevronRight className="w-5 h-5 transform rotate-180" />
                    </button>
                    <h1 className="text-3xl font-bold text-white">{selectedChallenge.title}</h1>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                    <p className="text-gray-300">{selectedChallenge.description}</p>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setChallengePhase('algorithmic')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            challengePhase === 'algorithmic'
                                ? 'bg-yellow-400 text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Algorithmic Phase
                    </button>
                    <button
                        onClick={() => setChallengePhase('buildathon')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            challengePhase === 'buildathon'
                                ? 'bg-yellow-400 text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Buildathon Phase
                    </button>
                </div>

                {challengePhase === 'algorithmic' ? (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Problem Statement</h3>
                            <div className="text-gray-300 whitespace-pre-wrap">{selectedChallenge.algorithmic.problem}</div>

                            <h4 className="text-lg font-semibold text-white mt-6 mb-2">Constraints</h4>
                            <div className="text-gray-300 whitespace-pre-wrap">{selectedChallenge.algorithmic.constraints}</div>

                            <h4 className="text-lg font-semibold text-white mt-6 mb-2">Examples</h4>
                            {selectedChallenge.algorithmic.examples.map((example, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <div className="mb-2">
                                        <span className="text-gray-400">Input:</span>
                                        <pre className="text-gray-300 mt-1">{example.input}</pre>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Output:</span>
                                        <pre className="text-gray-300 mt-1">{example.output}</pre>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Code Editor</h3>

                            <div className="mb-4">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>

                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-64 bg-gray-700 text-white p-4 rounded-lg border border-gray-600 font-mono text-sm"
                                placeholder="Write your solution here..."
                            />

                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={handleCodeExecution}
                                    disabled={isExecuting}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                >
                                    {isExecuting ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            <span>Running...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            <span>Run Code</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {executionResult && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                    <h4 className="text-white font-semibold mb-2">Execution Result</h4>
                                    <div className="text-gray-300">
                                        <div>Status: <span className="text-green-400">{executionResult.success ? 'Success' : 'Failed'}</span></div>
                                        <div>Output: {executionResult.output}</div>
                                        <div>Runtime: {executionResult.runtime}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Submit Solution</h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Enter Flag:</label>
                                    <input
                                        type="text"
                                        value={flagInput}
                                        onChange={(e) => setFlagInput(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        placeholder="flag{...}"
                                    />
                                </div>
                                <button
                                    onClick={handleAlgorithmicSubmit}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Buildathon Challenge</h3>
                            <div className="text-gray-300 whitespace-pre-wrap mb-6">{selectedChallenge.buildathon.problem}</div>

                            <h4 className="text-lg font-semibold text-white mb-2">Requirements</h4>
                            <ul className="text-gray-300 space-y-1">
                                {selectedChallenge.buildathon.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-red-400" />
                                    <span className="text-red-400 font-medium">
                    Deadline: {selectedChallenge.buildathon.deadline.toLocaleString()}
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Submit Your Solution</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Repository Link:</label>
                                    <input
                                        type="url"
                                        value={githubLink}
                                        onChange={(e) => setGithubLink(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        placeholder="https://github.com/username/repository"
                                    />
                                </div>

                                <button
                                    onClick={handleBuildathonSubmit}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
                                >
                                    <Github className="w-4 h-4" />
                                    <span>Submit Solution</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {teamSubmissions.length > 0 && (
                    <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Your Submissions</h3>
                        <div className="space-y-3">
                            {teamSubmissions.map((submission) => (
                                <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <div>
                                        <div className="text-white font-medium">{submission.type}</div>
                                        <div className="text-gray-400 text-sm">{submission.submittedAt.toLocaleString()}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm ${
                                        submission.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                            submission.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {submission.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Leaderboard
    const Leaderboard = () => {
        const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Leaderboard</h1>

                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Completed</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                            {sortedTeams.map((team, index) => (
                                <tr key={team.id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {index < 3 ? (
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    index === 0 ? 'bg-yellow-400 text-black' :
                                                        index === 1 ? 'bg-gray-400 text-black' :
                                                            'bg-yellow-600 text-white'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 font-medium">{index + 1}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{team.name}</div>
                                        <div className="text-sm text-gray-400">{team.members.length} members</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-yellow-400 font-bold text-lg">{team.points}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-white">{team.challengesCompleted}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className="min-h-screen bg-gray-900">
            <Navigation />

            <main className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' && (
                    userType === 'admin' ? <AdminDashboard /> : <TeamDashboard />
                )}
                {activeTab === 'challenges' && (
                    userType === 'admin' ? <AdminChallenges /> : <TeamChallenges />
                )}
                {activeTab === 'challenge-detail' && <ChallengeDetail />}
                {activeTab === 'teams' && userType === 'admin' && <AdminTeamManagement />}
                {activeTab === 'submissions' && userType === 'admin' && <AdminSubmissions />}
                {activeTab === 'leaderboard' && userType === 'team' && <Leaderboard />}
            </main>
        </div>
    );
};

export default Portal;