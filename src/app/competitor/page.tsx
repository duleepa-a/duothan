'use client';
import React, { useEffect, useState } from 'react';
import { Trophy, Target, Users } from 'lucide-react';
import NavBar from '../homeComponents/NavBar';

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

  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [langMap, setLangMap] = useState<Record<string, number>>({});
  const [outputMap, setOutputMap] = useState<Record<string, string>>({});
  const [inputMap, setInputMap] = useState<Record<string, string>>({});


  const currentTeam = {
    id: 'team-123',
    name: 'Code Crusaders',
    email: 'team@codecrusaders.com',
    members: ['Alice', 'Bob', 'Charlie'],
    points: 1200,
    challengesCompleted: 3,
    lastActive: new Date(),
  };

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
    (s) => s.status === 'accepted' && s.teamId === currentTeam.id
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

  const runCode = async (challengeId: string) => {
  const source_code = codeMap[challengeId] || '';
  const language_id = langMap[challengeId] || 71; // Default to Python
  const stdin = inputMap[challengeId] || '';

  try {
    const res = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code, language_id, stdin }),
    });
    const result = await res.json();
    const output =
      result.stdout || result.stderr || result.compile_output || 'No output';
    setOutputMap((prev) => ({ ...prev, [challengeId]: output }));
  } catch (error) {
    setOutputMap((prev) => ({
      ...prev,
      [challengeId]: 'Execution failed',
    }));
  }
};


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <NavBar />
      <div className="px-6 pb-6 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Team Dashboard</h1>

        {/* Metrics section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Points */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div className="text-2xl font-bold text-white">{currentTeam.points}</div>
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
              <div className="text-2xl font-bold text-white">{currentTeam.members.length}</div>
            </div>
            <div className="text-gray-400 text-sm">Team Members</div>
          </div>
        </div>

        {/* Display Challenges */}
        <div className="space-y-8">
        {challenges.map((challenge) => {
            const teamSubmission = submissions.find(
            (s) => s.challengeId === challenge.id && s.teamId === currentTeam.id
            );
            const isFlagAccepted = teamSubmission?.type === 'algorithmic' && teamSubmission.status === 'accepted';

            return (
            <div
                key={challenge.id}
                className="bg-gray-800 border border-gray-700 p-6 rounded-lg"
            >
                <h2 className="text-2xl text-white font-bold mb-4">
                {challenge.title}
                </h2>
                <p className="text-gray-300 mb-2">{challenge.description}</p>
                <div className="mb-4">
                <strong className="text-white">Problem:</strong>
                <pre className="text-sm text-gray-400 bg-black p-2 mt-1 rounded">{challenge.algorithmicProblem}</pre>
                </div>

               {/* Language Selector */}
                <select
                className="w-full p-2 bg-gray-900 border border-gray-700 text-white rounded"
                value={langMap[challenge.id] || 71}
                onChange={(e) =>
                    setLangMap((prev) => ({
                    ...prev,
                    [challenge.id]: Number(e.target.value),
                    }))
                }
                >
                <option value={54}>C++</option>
                <option value={71}>Python</option>
                <option value={63}>JavaScript</option>
                </select>

                {/* Input (stdin) */}
                <input
                className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded"
                placeholder="Optional input (stdin)"
                value={inputMap[challenge.id] || ''}
                onChange={(e) =>
                    setInputMap((prev) => ({
                    ...prev,
                    [challenge.id]: e.target.value,
                    }))
                }
                />

                {/* Code Editor */}
                <textarea
                className="w-full min-h-[150px] p-2 bg-gray-900 border border-gray-700 text-white rounded"
                placeholder="Write your code here..."
                value={codeMap[challenge.id] || ''}
                onChange={(e) =>
                    setCodeMap((prev) => ({
                    ...prev,
                    [challenge.id]: e.target.value,
                    }))
                }
                />

                {/* Run Button */}
                <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => runCode(challenge.id)}
                >
                Run Code
                </button>

                {/* Output */}
                <div className="text-green-400 text-sm mt-2 whitespace-pre-line">
                {outputMap[challenge.id] || 'Output will be shown here...'}
                </div>


                {/* Flag Submission */}
                {!isFlagAccepted ? (
                <div className="mt-6 space-y-2">
                    <label className="text-white text-sm">Submit Flag to unlock buildathon</label>
                    <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 p-2 bg-gray-900 border border-gray-700 text-white rounded"
                        placeholder="Enter FLAG..."
                    />
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                    </div>
                    <div className="text-red-400 text-sm">Flag invalid or not yet submitted.</div>
                </div>
                ) : (
                <div className="mt-6 bg-gray-900 border border-gray-700 p-4 rounded">
                    <h3 className="text-white text-lg font-semibold mb-2">🔓 Buildathon Task</h3>
                    <p className="text-gray-300">{challenge.buildathonProblem}</p>

                    <div className="mt-4 space-y-2">
                    <label className="text-white text-sm">GitHub Link</label>
                    <div className="flex gap-2">
                        <input
                        type="url"
                        className="flex-1 p-2 bg-gray-800 border border-gray-600 text-white rounded"
                        placeholder="https://github.com/team/project"
                        />
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                        Submit Build
                        </button>
                    </div>
                    </div>
                </div>
                )}
            </div>
            );
        })}
        </div>

      </div>
    </div>
  );
};

export default TeamDashboard;
