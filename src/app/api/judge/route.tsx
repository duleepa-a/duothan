import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; 
import { SubmissionType, SubmissionStatus } from '@/generated/prisma';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com';

export async function POST(req: NextRequest) {
  const { source_code, language_id, stdin, challengeId, teamId } = await req.json();

  console.log({ source_code, language_id, stdin, challengeId, teamId });

  try {
    // Check if user provided manual stdin
    if (stdin && stdin.trim() !== '') {
      // Just run the code with this stdin
      const res = await fetch(JUDGE0_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
        body: JSON.stringify({ source_code, language_id, stdin }),
      });

      const result = await res.json();

      console.log('Judge0 Manual Run Response:', result);
      
      const output = result.stdout || result.stderr || result.compile_output || '';

      return NextResponse.json({ ...result, output });
    }

    // Otherwise, run all test cases
    const testCases = await prisma.testCase.findMany({
      where: { challengeId },
    });

    console.log('Test Cases:', testCases);

    let allPassed = true;
    const testResults: { input: string; expected: string; output: string; passed: boolean }[] = [];

    for (const testCase of testCases) {
      const res = await fetch(JUDGE0_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
        body: JSON.stringify({ source_code, language_id, stdin: testCase.input }),
      });

      console.log('Judge0 Response:', res);

      const result = await res.json();
      const output = result.stdout?.trim || result.stderr || result.compile_output?.trim || '';
      const passed = output === testCase.expected.trim();

      if (!passed) allPassed = false;

      testResults.push({
        input: testCase.input,
        expected: testCase.expected,
        output,
        passed,
      });
    }

    // Save submission with overall status
    const submission = await prisma.submissions.create({
      data: {
        teamId : 'cmd5q4g9j0006bi8thcdum0r3',
        challengeId,
        content: source_code,
        output: JSON.stringify(testResults),
        type: SubmissionType.ALGORITHMIC,
        status: allPassed ? SubmissionStatus.ACCEPTED : SubmissionStatus.REJECTED,
      },
    });

    return NextResponse.json({ submissionId: submission.id, testResults, status: submission.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}
