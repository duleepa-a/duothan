"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Settings,
  X,
  Loader,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [expandedChallenges, setExpandedChallenges] = useState<{
    [id: string]: boolean;
  }>({});

  // fetch challenges
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/challenges");
      const data = await res.json();
      setChallenges(data.challenges || []);
    } catch (err: any) {
      setError(err.message || "Error fetching challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCreateChallenge = async (formData: any) => {
    try {
      await fetch("/api/admin/challenges", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      fetchChallenges();
      setShowCreateChallenge(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;
    await fetch(`/api/admin/challenges/${id}`, { method: "DELETE" });
    fetchChallenges();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/challenges/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    fetchChallenges();
  };

  const toggleExpand = (id: string) => {
    setExpandedChallenges((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-yellow-400" />
          <span className="ml-2 text-white">Loading challenges...</span>
        </div>
      </div>
    );

  if (error)
    return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
              Error loading challenges:  {error}
            </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="px-6 py-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Challenges</h1>
          <button
            onClick={() => setShowCreateChallenge(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Challenge</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {challenges.map((ch: any) => (
            <div
              key={ch.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {ch.title}
                  </h3>
                  <p className="text-gray-400 mt-1">{ch.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`px-2 py-1 rounded text-xs ${
                      ch.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {ch.isActive ? "Active" : "Inactive"}
                  </div>
                  <button
                    onClick={() => handleToggleActive(ch.id, ch.isActive)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteChallenge(ch.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleExpand(ch.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {expandedChallenges[ch.id] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Problems - Full text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Algorithmic Phase
                  </h4>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">
                    {ch.algorithmicProblem}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Buildathon Phase
                  </h4>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">
                    {ch.buildathonProblem}
                  </p>
                </div>
              </div>

              {/* Test Cases - Collapsible */}
              {expandedChallenges[ch.id] && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Test Cases
                  </h4>
                  <div className="space-y-2">
                    {ch.testCases?.map((tc: any) => (
                      <div
                        key={tc.id}
                        className="p-2 bg-gray-700 rounded text-sm text-gray-300"
                      >
                        <b>Input:</b> {tc.input} | <b>Expected:</b>{" "}
                        {tc.expected} | {tc.isPublic ? "Public" : "Hidden"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {showCreateChallenge && (
          <CreateChallengeModal
            onClose={() => setShowCreateChallenge(false)}
            onSubmit={handleCreateChallenge}
          />
        )}
      </div>
    </div>
  );
};
// Modal for creating challenge + test cases
const CreateChallengeModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    algorithmicProblem: "",
    flag: "",
    buildathonProblem: "",
    points: "100",
    order: "1",
    testCases: [] as { input: string; expected: string; isPublic: boolean }[],
  });

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        { input: "", expected: "", isPublic: false },
      ],
    });
  };

  const updateTestCase = (index: number, key: string, value: any) => {
    const updated = [...formData.testCases];
    (updated[index] as any)[key] = value;
    setFormData({ ...formData, testCases: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Challenge</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          {/* Desc */}
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
          />
          {/* Algo */}
          <textarea
            placeholder="Algorithmic Problem"
            value={formData.algorithmicProblem}
            onChange={(e) =>
              setFormData({ ...formData, algorithmicProblem: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
          />
          {/* Flag */}
          <input
            type="text"
            placeholder="flag{example}"
            value={formData.flag}
            onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          {/* Buildathon */}
          <textarea
            placeholder="Buildathon Problem"
            value={formData.buildathonProblem}
            onChange={(e) =>
              setFormData({ ...formData, buildathonProblem: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
          />

          {/* Points & Order */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Points"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Test Cases */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Test Cases
            </h4>
            {formData.testCases.map((tc, idx) => (
              <div key={idx} className="mb-2 flex space-x-2">
                <input
                  type="text"
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => updateTestCase(idx, "input", e.target.value)}
                  className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <input
                  type="text"
                  placeholder="Expected"
                  value={tc.expected}
                  onChange={(e) =>
                    updateTestCase(idx, "expected", e.target.value)
                  }
                  className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={tc.isPublic}
                    onChange={(e) =>
                      updateTestCase(idx, "isPublic", e.target.checked)
                    }
                  />
                  Public
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className="bg-yellow-400 px-3 py-1 text-black rounded"
            >
              + Add Test Case
            </button>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminChallenges;
