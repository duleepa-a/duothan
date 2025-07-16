import React from 'react'

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


const TeamDashboard = () => {
      

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

export default TeamDashboard 