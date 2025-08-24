"use client";

import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";

type Submission = {
  id: string;
  teams: { name: string };
  challenges: { title: string; points: number };
  content?: string;
  githubLink?: string;
  type: "ALGORITHMIC" | "BUILDATHON";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  submittedAt: string;
};

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      let query = "";
      if (statusFilter !== "all") query += `status=${statusFilter}&`;
      if (typeFilter !== "all") query += `type=${typeFilter}&`;

      const res = await fetch(`/api/admin/submissions?${query}`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      setError(err.message || "Error fetching submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, typeFilter]);

  // Update submission status
  const handleUpdateSubmission = async (submissionId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update submission");
      fetchSubmissions();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error updating submission");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="p-6 flex min-h-screen items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-yellow-400" />
            <span className="ml-2 text-white">Loading submissions...</span>
            </div>
        </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
            Error loading submissions: {error}
            </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="px-6 py-20">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Submissions</h1>
            <div className="flex items-center space-x-4">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
            </select>
            <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
                <option value="all">All Types</option>
                <option value="ALGORITHMIC">Algorithmic</option>
                <option value="BUILDATHON">Buildathon</option>
            </select>
            </div>
        </div>

        {/* Submissions list */}
        <div className="space-y-6">
            {submissions.map((submission) => (
            <div key={submission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-white">{submission.teams.name}</h3>
                    <p className="text-gray-400">{submission.challenges.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                    {submission.type.toLowerCase()} • {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div
                    className={`px-3 py-1 rounded-full text-sm ${
                        submission.status === "ACCEPTED"
                        ? "bg-green-500/20 text-green-400"
                        : submission.status === "REJECTED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                    >
                    {submission.status.toLowerCase()}
                    </div>
                    {submission.status === "PENDING" && (
                    <div className="flex space-x-2">
                        <button
                        onClick={() => handleUpdateSubmission(submission.id, "ACCEPTED")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                        Accept
                        </button>
                        <button
                        onClick={() => handleUpdateSubmission(submission.id, "REJECTED")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                        Reject
                        </button>
                    </div>
                    )}
                </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Submission Content</h4>
                {submission.type === "ALGORITHMIC" ? (
                    <pre className="text-sm text-gray-400 whitespace-pre-wrap overflow-x-auto">{submission.content}</pre>
                ) : (
                    <div className="text-sm text-gray-400">
                    GitHub Link:{" "}
                    <a
                        href={submission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        {submission.githubLink}
                    </a>
                    </div>
                )}
                </div>

                <div className="mt-4 text-sm text-gray-400">
                Points: <span className="text-yellow-400">{submission.challenges.points || 0}</span>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
  );
};

export default AdminSubmissions;
