'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  algorithmicProblem: string;
  buildathonProblem?: string;
  flag: string;
  points: number;
}

export default function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [lang, setLang] = useState(71);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [flagUnlocked, setFlagUnlocked] = useState(false);

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

  useEffect(() => {
    fetch(`/api/challenges/${id}`)
      .then(res => res.json())
      .then(setChallenge);
  }, [id]);

  // Run with custom input only
  const runCode = async () => {
    setOutput('Running...');
    const res = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: lang,
        stdin, // user-provided stdin triggers manual mode
        challengeId: challenge?.id,
        teamId: currentUser?.team?.id || 'NO_TEAM',
      }),
    });
    const result = await res.json();

    // If testResults exist (full submission), show summary
    if (result.testResults) {
      const summary = result.testResults
        .map((t: any, idx: number) => `Test ${idx + 1}: ${t.passed ? '✅' : '❌'}\nOutput: ${t.output}\nExpected: ${t.expected}\n`)
        .join('\n');
      setOutput(summary);
    } else {
      // Manual run mode
      setOutput(result.output || 'No output');
    }
  };

  // Full submission (runs all test cases)
  const submitCode = async () => {
    setOutput('Submitting code...');
    const res = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: lang,
        stdin: '', // empty triggers full test case mode
        challengeId: challenge?.id,
        teamId: currentUser?.team?.id || 'NO_TEAM',
      }),
    });
    const result = await res.json();
    if (result.status === 'ACCEPTED') {
      alert('All test cases passed! ✅');
      setFlagUnlocked(true);
    } else {
      alert('Some test cases failed. ❌ Check output.');
    }

    const summary = result.testResults
      .map((t: any, idx: number) => `Test ${idx + 1}: ${t.passed ? '✅' : '❌'}\nOutput: ${t.output}\nExpected: ${t.expected}\n`)
      .join('\n');

    setOutput(summary);
  };

  const submitFlag = async () => {
    const flag = prompt('Enter flag:');
    if (!flag) return;

    const res = await fetch(`/api/challenges/${challenge?.id}/submit-flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: currentUser?.team?.id || 'NO_TEAM', flag }),
    });
    const result = await res.json();
    if (result.isCorrect) {
      alert('Flag correct! Buildathon unlocked.');
      setFlagUnlocked(true);
    } else alert('Incorrect flag.');
  };

   if (!challenge)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-yellow-400" />
          <span className="ml-2 text-white">Loading ...</span>
        </div>
      </div>
    );

    if (!currentUser)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="p-6 flex min-h-screen items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-yellow-400" />
          <span className="ml-2 text-white">Loading ...</span>
        </div>
      </div>
    );
  

  return (
    <div className="px-6 py-25 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
      <p className="mb-4">{challenge.description}</p>
      <pre className="bg-black p-4 rounded mb-4">{challenge.algorithmicProblem}</pre>

      <select value={lang} onChange={e => setLang(Number(e.target.value))}>
        <option value={54}>C++</option>
        <option value={71}>Python</option>
        <option value={63}>JavaScript</option>
      </select>
      <textarea
        className="w-full my-2 p-2 bg-gray-800 min-h-[100px]"
        placeholder="Optional stdin (manual run only)"
        value={stdin}
        onChange={e => setStdin(e.target.value)}
      />
      <textarea
        className="w-full min-h-[200px] p-2 bg-gray-800"
        placeholder="Write your code..."
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <div className="mt-2">
        <button onClick={runCode} className="px-4 py-2 bg-blue-600 mr-2 cursor-pointer">Run with Input</button>
        <button onClick={submitCode} className="px-4 py-2 bg-green-600 cursor-pointer">Submit Code</button>
        <button onClick={submitFlag} className="ml-2 px-4 py-2 bg-yellow-600 cursor-pointer">Submit Flag</button>
      </div>
      <pre className="mt-4 bg-black p-4 rounded whitespace-pre-wrap">{output}</pre>

      {flagUnlocked && challenge.buildathonProblem && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h2 className="text-2xl font-bold mb-2">Buildathon Challenge</h2>
          <p>{challenge.buildathonProblem}</p>
          <input
            id="githubLink"
            className="w-full mt-2 p-2 bg-gray-700"
            placeholder="Paste GitHub repo link"
          />
          <button
            onClick={async () => {
              const githubLink = (document.getElementById('githubLink') as HTMLInputElement).value;
              const res = await fetch(`/api/challenges/${challenge.id}/submit-buildathon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: 'CURRENT_TEAM_ID', githubLink }),
              });
              const result = await res.json();
              alert(result.success ? 'Buildathon submitted!' : result.error);
            }}
            className="mt-2 px-4 py-2 bg-purple-600 cursor-pointer"
          >
            Submit Buildathon
          </button>
        </div>
      )}
    </div>
  );
}
