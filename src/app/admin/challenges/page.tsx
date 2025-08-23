"use client"
import React, { useState, useEffect } from 'react';


const AdminChallenges = () => {
        const { data: challengesData, loading, error, fetchData } = useAdminChallenges();

        const handleCreateChallenge = async (formData: any) => {
            try {
                await apiCall('/api/admin/challenges', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description,
                        algorithmicProblem: formData.algorithmicProblem,
                        buildathonProblem: formData.buildathonProblem,
                        flag: formData.flag,
                        points: parseInt(formData.points),
                        order: parseInt(formData.order),
                        isActive: true
                    })
                });
                fetchData();
                setShowCreateChallenge(false);
            } catch (error) {
                console.error('Create challenge error:', error);
            }
        };

        const handleDeleteChallenge = async (id: string) => {
            if (confirm('Are you sure you want to delete this challenge?')) {
                try {
                    await apiCall(`/api/admin/challenges/${id}`, { method: 'DELETE' });
                    fetchData();
                } catch (error) {
                    console.error('Delete challenge error:', error);
                }
            }
        };

        const handleToggleActive = async (id: string, currentStatus: boolean) => {
            try {
                await apiCall(`/api/admin/challenges/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ isActive: !currentStatus })
                });
                fetchData();
            } catch (error) {
                console.error('Toggle challenge error:', error);
            }
        };

        if (loading) {
            return (
                <div className="p-6 flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-yellow-400" />
                    <span className="ml-2 text-white">Loading challenges...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
                        Error loading challenges: {error}
                    </div>
                </div>
            );
        }

        const challenges = challengesData?.challenges || [];

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
                    {challenges.map((challenge: any) => (
                        <div key={challenge.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                                    <p className="text-gray-400 mt-1">{challenge.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`px-2 py-1 rounded text-xs ${
                                        challenge.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {challenge.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <button
                                        onClick={() => handleToggleActive(challenge.id, challenge.isActive)}
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
                                    <p className="text-sm text-gray-400">{challenge.algorithmicProblem.substring(0, 100)}...</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Buildathon Phase</h4>
                                    <p className="text-sm text-gray-400">{challenge.buildathonProblem?.substring(0, 100)}...</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-400">
                                        Points: <span className="text-yellow-400">{challenge.points}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Order: <span className="text-white">{challenge.order}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Submissions: <span className="text-white">{challenge.totalSubmissions}</span>
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
            flag: '',
            buildathonProblem: '',
            points: '100',
            order: '1'
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
                            <label className="block text-sm font-medium text-gray-300 mb-2">Flag</label>
                            <input
                                type="text"
                                value={formData.flag}
                                onChange={(e) => setFormData({...formData, flag: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="flag{example}"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Buildathon Problem</label>
                            <textarea
                                value={formData.buildathonProblem}
                                onChange={(e) => setFormData({...formData, buildathonProblem: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({...formData, order: e.target.value})}
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