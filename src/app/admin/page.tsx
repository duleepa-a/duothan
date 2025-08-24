'use client';

import React, { useEffect, useState } from 'react';
import {
  Users, Target, FileText, Trophy, Loader
} from 'lucide-react';

interface Overview {
  totalTeams: number;
  activeChallenges: number;
  totalSubmissions: number;
  completionRate: number;
}

interface Team {
  id: string;
  name: string;
  points: number;
}

interface Submission {
  id: string;
  teams: { id: string; name: string };
  type: string;
  isCorrect: boolean;
}

interface AnalyticsResponse {
  overview: Overview;
  topTeams: Team[];
}

interface SubmissionsResponse {
  submissions: Submission[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, submissionsRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/submissions?limit=5')
        ]);

        console.log(analyticsRes, submissionsRes);

        if (!analyticsRes.ok || !submissionsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const analyticsJson: AnalyticsResponse = await analyticsRes.json();
        const submissionsJson: SubmissionsResponse = await submissionsRes.json();

        setAnalyticsData(analyticsJson);
        setRecentSubmissions(submissionsJson.submissions);


        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-yellow-400" />
          <span className="ml-2 text-white">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
            Error loading dashboard: {error}
          </div>
        </div>
      </div>
    );
  }

  const overview = analyticsData?.overview || {
    totalTeams: 0,
    activeChallenges: 0,
    totalSubmissions: 0,
    completionRate: 0
  };

  const topTeams = analyticsData?.topTeams || [];

  const stats = [
    { label: 'Registered Teams', value: overview.totalTeams, icon: <Users className="w-6 h-6" /> },
    { label: 'Active Challenges', value: overview.activeChallenges, icon: <Target className="w-6 h-6" /> },
    { label: 'Total Submissions', value: overview.totalSubmissions, icon: <FileText className="w-6 h-6" /> },
    { label: 'Completion Rate', value: `${overview.completionRate}%`, icon: <Trophy className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="px-6 py-20">
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
                {topTeams.slice(0, 5).map((team, index) => (
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
                {recentSubmissions.slice(0, 5).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between">
                    <div className="text-white text-sm">
                    <span className="font-medium">{submission.teams.name}</span>
                    <span className="text-gray-400"> submitted {submission.type.toLowerCase()}</span>
                    </div>
                    <div
                    className={`px-2 py-1 rounded text-xs ${
                        submission.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                    >
                    {submission.isCorrect ? 'accepted' : 'pending'}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}
