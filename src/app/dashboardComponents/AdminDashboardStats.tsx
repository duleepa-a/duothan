'use client';

import { useEffect, useState } from 'react';
import { Users, Trophy, FileText, Activity } from 'lucide-react';

interface DashboardStats {
  totalTeams: number;
  activeChallenges: number;
  totalSubmissions: number;
  leaderboard: Array<{
    id: string;
    name: string;
    points: number;
    currentChallenge: number;
    createdAt: string;
  }>;
  submissionStats: Array<{
    type: string;
    _count: { id: number };
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    submittedAt: string;
    isCorrect: boolean;
    team: { name: string };
    challenge: { title: string };
  }>;
  registrationsByDay: Record<string, number>;
  challengeStats: Array<{
    id: string;
    title: string;
    order: number;
    _count: { submissions: number };
  }>;
}

const AdminDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();
        
        if (result.success) {
          setStats(result.data);
        } else {
          setError(result.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow border border-amber-300 p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Teams</p>
            <p className="font-semibold text-2xl text-gray-800">{stats.totalTeams}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-blue-300 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Challenges</p>
            <p className="font-semibold text-2xl text-gray-800">{stats.activeChallenges}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-green-300 p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Submissions</p>
            <p className="font-semibold text-2xl text-gray-800">{stats.totalSubmissions}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-purple-300 p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Recent Activity</p>
            <p className="font-semibold text-2xl text-gray-800">{stats.recentActivity.length}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Snapshot */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard Snapshot</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Team Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Points</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Current Challenge</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Registered</th>
              </tr>
            </thead>
            <tbody>
              {stats.leaderboard.map((team, index) => (
                <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{team.name}</td>
                  <td className="py-3 px-4 text-gray-600">{team.points}</td>
                  <td className="py-3 px-4 text-gray-600">{team.currentChallenge}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-800">{activity.team.name}</p>
                  <p className="text-sm text-gray-600">
                    {activity.type} submission for "{activity.challenge.title}"
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(activity.submittedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
