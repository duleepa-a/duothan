"use client";

import React, { useEffect, useState } from "react";
import { Users, PlusCircle, Search, Loader } from "lucide-react";

interface Team {
  id: string;
  name: string;
  members: string[];
  points: number;
  challengesCompleted: number;
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [newTeamName, setNewTeamName] = useState("");

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullName: string;
    isLeader: boolean;
    team: { id: string; name: string } | null;
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

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teams`);
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data.teams);
    } catch (err: any) {
      setError(err.message || "Error fetching teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Request to join a team
  const handleJoinTeam = async (teamId: string) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser?.id, userName: currentUser?.fullName }),
      });
      if (!res.ok) throw new Error("Failed to request join");
      alert("Request sent to team leader!");
      fetchTeams();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Create a new team
  const handleCreateTeam = async () => {
    if (!newTeamName) return alert("Team name cannot be empty");
    try {
      const res = await fetch(`/api/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          leaderId: currentUser?.id,
          leaderName: currentUser?.fullName,
        }),
      });
      if (!res.ok) throw new Error("Failed to create team");
      setNewTeamName("");
      fetchTeams();
      alert("Team created successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-yellow-400" />
          <span className="ml-2 text-white">Loading teams...</span>
        </div>
      </div>
    );

  if (error)
    return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
              Error loading teams:  {error}
            </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-6 pt-20 pb-6">
      <h1 className="text-3xl font-bold text-white mb-8">Teams</h1>

      {/* Create Team */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl text-white font-bold mb-4">Create a New Team</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
          />
          <button
            onClick={handleCreateTeam}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" /> Create
          </button>
        </div>
      </div>

      {/* Search Teams */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl text-white font-bold mb-4">Search Teams</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by team name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
          />
          <Search className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-white">{team.name}</h3>
              <p className="text-gray-400 text-sm">
                Members: {team.members.length}/5
              </p>
              <p className="text-gray-400 text-sm">
                Total Points: {team.points} | Completed Challenges: {team.challengesCompleted}
              </p>
            </div>
            <div>
              {team.id === currentUser?.team?.id ? (
                <button className="bg-gray-500 px-4 py-2 rounded-lg text-white cursor-not-allowed">
                  Joined
                </button>
              ) : team.members.length >= 5 ? (
                <button className="bg-gray-600 px-4 py-2 rounded-lg text-white cursor-not-allowed">
                  Full
                </button>
              ) : (
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
