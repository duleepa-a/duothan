// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { source_code, language_id, stdin } = body;

//     // Send to Judge0 API
//     const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-RapidAPI-Key': 'ZHVvdGhhbjUuMA==',  // Add this in your .env file
//         'X-RapidAPI-Host': 'http://10.3.5.139:2358/',
//       },
//       body: JSON.stringify({
//         source_code,
//         language_id,
//         stdin,
//       }),
//     });

//     const result = await response.json();
//     return NextResponse.json(result);
//   } catch (error) {
//     console.error('Error submitting code:', error);
//     return NextResponse.json({ error: 'Code execution failed' }, { status: 500 });
//   }
// }
