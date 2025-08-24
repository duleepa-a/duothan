'use client';
import React, { useEffect, useState } from 'react';
import { Trophy, Target, Users } from 'lucide-react';
import NavBar from '../homeComponents/NavBar';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  algorithmicProblem: string;
  buildathonProblem?: string;
  flag: string;
  points: number;
}

const TeamDashboard = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const [currentUser, setCurrentUser] = useState<{
      id: string;
      fullName: string;
      isLeader: boolean;
      team: { id: string; name: string , points : number , members : number  } | null;
    } | null>(null);
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/me");
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();
          setCurrentUser(data);
        } catch (err: any) {
          console.error(err);
          setCurrentUser(null);
        }
      };
      fetchUser();
    }, [])

  const currentTeam = currentUser?.team;

  console.log("Current User:", currentUser);

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

  const completedChallenges = submissions.filter(
    (s) => s.status === 'accepted' && s.teamId === currentTeam?.id
  );

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch('/api/challenges');
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
      }
    }
    fetchChallenges();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="px-6 pb-6 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Team Dashboard</h1>

        {/* Metrics section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Points */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div className="text-2xl font-bold text-white">{currentTeam?.points}</div>
            </div>
            <div className="text-gray-400 text-sm">Total Points</div>
          </div>

          {/* Completed Challenges */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-green-400" />
              <div className="text-2xl font-bold text-white">{completedChallenges.length}</div>
            </div>
            <div className="text-gray-400 text-sm">Completed Challenges</div>
          </div>

          {/* Team Members */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <div className="text-2xl font-bold text-white">{currentTeam?.members}</div>
            </div>
            <div className="text-gray-400 text-sm">Team Members</div>
          </div>
        </div>

        {/* Display Challenges */}
        <div className="space-y-8">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-gray-800 border border-gray-700 p-6 rounded-lg"
          >
            <h2 className="text-xl text-white font-bold mb-2">
              {challenge.title}
            </h2>
            <p className="text-gray-300 mb-4 line-clamp-2">
              {challenge.description}
            </p>

            <div className='flex  justify-end items-end'>
              <Link href={`/challenges/${challenge.id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                  Solve
                </button>
              </Link>
            </div>
          </div>
        ))}

        </div>

      </div>
    </div>
  );
};

export default TeamDashboard;
