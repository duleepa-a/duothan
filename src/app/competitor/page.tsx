'use client';
import React from 'react';
import { Trophy, Target, Users, User } from 'lucide-react';
import NavBar from '../homeComponents/NavBar';

const TeamDashboard = () => {
  // ✅ Dummy team data
  const currentTeam = {
    id: 'team-123',
    name: 'Code Crusaders',
    email: 'team@codecrusaders.com',
    members: ['Alice', 'Bob', 'Charlie'],
    points: 1200,
    challengesCompleted: 3,
    lastActive: new Date(),
  };

  // ✅ Dummy challenges
  const challenges = [
    {
      id: 'challenge-1',
      title: 'FizzBuzz Pro',
      description: 'Classic FizzBuzz with a twist',
      algorithmic: {
        problem: 'Print numbers from 1 to N with FizzBuzz conditions.',
        constraints: '1 <= N <= 1000',
        examples: [{ input: '5', output: '1 2 Fizz 4 Buzz' }],
        flag: 'FLAG-FIZZBUZZ123',
      },
      buildathon: {
        problem: '',
        requirements: [],
        deadline: new Date(),
      },
      points: 200,
      active: true,
      createdAt: new Date(),
    },
    {
      id: 'challenge-2',
      title: 'Build a Weather App',
      description: 'Create a weather app using any public API',
      algorithmic: {
        problem: '',
        constraints: '',
        examples: [],
        flag: '',
      },
      buildathon: {
        problem: 'Build an app to display weather data',
        requirements: ['API integration', 'Responsive UI', 'Dark Mode'],
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      points: 500,
      active: true,
      createdAt: new Date(),
    },
  ];

  // ✅ Dummy submissions
  const submissions = [
    {
      id: 'sub-1',
      teamId: 'team-123',
      challengeId: 'challenge-1',
      type: 'algorithmic',
      content: 'Solution code here',
      status: 'accepted',
      submittedAt: new Date(),
      points: 200,
    },
    {
      id: 'sub-2',
      teamId: 'team-123',
      challengeId: 'challenge-2',
      type: 'buildathon',
      content: 'Link to deployed app',
      status: 'pending',
      submittedAt: new Date(),
      points: 0,
    },
  ];

  // Filter completed challenges (dummy logic: accepted submissions count)
  const completedChallenges = submissions.filter(
    (s) => s.status === 'accepted' && s.teamId === currentTeam.id
  );

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <NavBar/>
        <div className="px-6 pb-6 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Team Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div className="text-2xl font-bold text-white">
                {currentTeam.points}
                </div>
            </div>
            <div className="text-gray-400 text-sm">Total Points</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-green-400" />
                <div className="text-2xl font-bold text-white">
                {completedChallenges.length}
                </div>
            </div>
            <div className="text-gray-400 text-sm">Completed Challenges</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <div className="text-2xl font-bold text-white">
                {currentTeam.members.length}
                </div>
            </div>
            <div className="text-gray-400 text-sm">Team Members</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
                Team Members
            </h3>
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
            <h3 className="text-xl font-semibold text-white mb-4">
                Recent Submissions
            </h3>
            <div className="space-y-3">
                {submissions
                .filter((s) => s.teamId === currentTeam.id)
                .slice(0, 5)
                .map((submission) => {
                    const challenge = challenges.find(
                    (c) => c.id === submission.challengeId
                    );
                    return (
                    <div
                        key={submission.id}
                        className="flex items-center justify-between"
                    >
                        <div className="text-white text-sm">
                        <span className="font-medium">{challenge?.title}</span>
                        <span className="text-gray-400 block">
                            {submission.type}
                        </span>
                        </div>
                        <div
                        className={`px-2 py-1 rounded text-xs ${
                            submission.status === 'accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : submission.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                        >
                        {submission.status}
                        </div>
                    </div>
                    );
                })}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default TeamDashboard;
