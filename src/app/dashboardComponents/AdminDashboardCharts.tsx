'use client';

import { useEffect, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

interface ChartData {
  submissionStats: Array<{
    type: string;
    _count: { id: number };
  }>;
  registrationsByDay: Record<string, number>;
  challengeStats: Array<{
    id: string;
    title: string;
    order: number;
    _count: { submissions: number };
  }>;
}

const COLORS = ['#FbbF24', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

const AdminDashboardCharts = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();
        
        if (result.success) {
          setChartData({
            submissionStats: result.data.submissionStats,
            registrationsByDay: result.data.registrationsByDay,
            challengeStats: result.data.challengeStats
          });
        }
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  // Prepare data for submission types pie chart
  const submissionPieData = chartData.submissionStats.map((stat) => ({
    name: stat.type === 'ALGORITHMIC' ? 'Algorithmic' : 'Buildathon',
    value: stat._count.id,
    color: stat.type === 'ALGORITHMIC' ? '#FbbF24' : '#3B82F6'
  }));

  // Prepare data for registrations line chart
  const registrationLineData = Object.entries(chartData.registrationsByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      registrations: count
    }));

  // Prepare data for challenge completion bar chart
  const challengeBarData = chartData.challengeStats.map((challenge) => ({
    name: `Ch. ${challenge.order}`,
    title: challenge.title.length > 20 ? 
      challenge.title.substring(0, 20) + '...' : 
      challenge.title,
    completions: challenge._count.submissions
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Submission Types Pie Chart */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Types</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={submissionPieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {submissionPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Registrations Line Chart */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Registrations (7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#FbbF24" 
                strokeWidth={2}
                dot={{ fill: '#FbbF24', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Challenge Completions Bar Chart */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Challenge Completions</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={challengeBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name, props) => [
                  value, 
                  'Completions',
                  props.payload?.title
                ]}
              />
              <Bar 
                dataKey="completions" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <span className="text-gray-700">Total Algorithmic Submissions</span>
            <span className="font-semibold text-amber-600">
              {submissionPieData.find(d => d.name === 'Algorithmic')?.value || 0}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-gray-700">Total Buildathon Submissions</span>
            <span className="font-semibold text-blue-600">
              {submissionPieData.find(d => d.name === 'Buildathon')?.value || 0}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-gray-700">Most Active Challenge</span>
            <span className="font-semibold text-green-600">
              {challengeBarData.reduce((max, challenge) => 
                challenge.completions > max.completions ? challenge : max, 
                challengeBarData[0] || { name: 'N/A', completions: 0 }
              ).name}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span className="text-gray-700">Peak Registration Day</span>
            <span className="font-semibold text-purple-600">
              {registrationLineData.reduce((max, day) => 
                day.registrations > max.registrations ? day : max, 
                registrationLineData[0] || { date: 'N/A', registrations: 0 }
              ).date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCharts;
