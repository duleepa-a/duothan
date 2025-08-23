'use client';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/leaderboard');
      setTeams(await res.json());
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th>Rank</th>
            <th>Team</th>
            <th>Points</th>
            <th>Current Challenge</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr key={team.id} className="border-b">
              <td>{i + 1}</td>
              <td>{team.name}</td>
              <td>{team.points}</td>
              <td>{team.currentChallenge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
