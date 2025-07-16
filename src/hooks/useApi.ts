import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseApiOptions {
  autoFetch?: boolean;
  dependencies?: any[];
}

// Type definitions for API responses
interface Team {
  id: string;
  name: string;
  email: string;
  points: number;
  challengesCompleted: number;
  totalSubmissions: number;
  createdAt: string;
  updatedAt: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  algorithmicProblem: string;
  buildathonProblem?: string;
  flag: string;
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalSubmissions: number;
}

interface Submission {
  id: string;
  teamId: string;
  challengeId: string;
  type: 'ALGORITHMIC' | 'BUILDATHON';
  content?: string;
  githubLink?: string;
  isCorrect: boolean;
  submittedAt: string;
  executionTime?: number;
  team?: {
    name: string;
    email: string;
  };
  challenge?: {
    title: string;
    points: number;
  };
}

interface AnalyticsData {
  overview: {
    totalTeams: number;
    totalChallenges: number;
    totalSubmissions: number;
    activeChallenges: number;
    completedSubmissions: number;
    pendingSubmissions: number;
    completionRate: number;
  };
  topTeams: Team[];
  challengeStats: Challenge[];
  trends: {
    submissionsByDay: any[];
    registrationsByDay: Record<string, number>;
  };
}

interface TeamsResponse {
  teams: Team[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ChallengesResponse {
  challenges: Challenge[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SubmissionsResponse {
  submissions: Submission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (params?: Record<string, any>) => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL(endpoint, window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(url.toString());
      const result: ApiResponse<T> = await response.json();

      if (result.success) {
        setData(result.data || null);
      } else {
        setError(result.error || 'Request failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const mutate = async (
    method: 'POST' | 'PUT' | 'DELETE' = 'POST',
    body?: any,
    customEndpoint?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customEndpoint || endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const result: ApiResponse<T> = await response.json();

      if (result.success) {
        setData(result.data || null);
        return result;
      } else {
        setError(result.error || 'Request failed');
        throw new Error(result.error || 'Request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch) {
      fetchData();
    }
  }, options.dependencies || []);

  return {
    data,
    loading,
    error,
    fetchData,
    mutate,
    setData,
    setError
  };
}

// Specialized hooks for admin API calls
export function useAdminTeams(params?: Record<string, any>) {
  return useApi<TeamsResponse>(`/api/admin/teams`, {
    autoFetch: true,
    dependencies: [params]
  });
}

export function useAdminChallenges(params?: Record<string, any>) {
  return useApi<ChallengesResponse>(`/api/admin/challenges`, {
    autoFetch: true,
    dependencies: [params]
  });
}

export function useAdminSubmissions(params?: Record<string, any>) {
  return useApi<SubmissionsResponse>(`/api/admin/submissions`, {
    autoFetch: true,
    dependencies: [params]
  });
}

export function useAdminAnalytics() {
  return useApi<AnalyticsData>(`/api/admin/analytics`, {
    autoFetch: true
  });
}

// Utility function for API calls
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  return response.json();
}

// Export types for use in components
export type { Team, Challenge, Submission, AnalyticsData, TeamsResponse, ChallengesResponse, SubmissionsResponse };
