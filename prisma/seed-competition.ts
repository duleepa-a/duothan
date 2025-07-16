import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function seedCompetition() {
  console.log('Starting to seed competition data...');

  // Create challenges
  const challenges = [
    {
      title: 'Algorithm Design Challenge',
      description: 'Design and implement efficient algorithms for given problem sets',
      order: 1,
      maxPoints: 100,
      isActive: true
    },
    {
      title: 'Web Development Challenge',
      description: 'Build a responsive web application with modern technologies',
      order: 2,
      maxPoints: 150,
      isActive: true
    },
    {
      title: 'API Integration Challenge',
      description: 'Create and integrate RESTful APIs with proper authentication',
      order: 3,
      maxPoints: 120,
      isActive: true
    },
    {
      title: 'Database Optimization Challenge',
      description: 'Optimize database queries and design efficient schemas',
      order: 4,
      maxPoints: 100,
      isActive: true
    },
    {
      title: 'Final Buildathon Challenge',
      description: 'Build a complete application solving a real-world problem',
      order: 5,
      maxPoints: 200,
      isActive: true
    }
  ];

  console.log('Creating challenges...');
  const createdChallenges = await Promise.all(
    challenges.map(challenge => 
      prisma.challenge.create({
        data: challenge
      })
    )
  );

  // Create teams
  const teams = [
    {
      name: 'Code Crusaders',
      email: 'crusaders@example.com',
      password: 'hashedpassword1',
      points: 350,
      currentChallenge: 3
    },
    {
      name: 'Tech Titans',
      email: 'titans@example.com',
      password: 'hashedpassword2',
      points: 420,
      currentChallenge: 4
    },
    {
      name: 'Digital Dynamos',
      email: 'dynamos@example.com',
      password: 'hashedpassword3',
      points: 280,
      currentChallenge: 2
    },
    {
      name: 'Byte Builders',
      email: 'builders@example.com',
      password: 'hashedpassword4',
      points: 390,
      currentChallenge: 3
    },
    {
      name: 'Algorithm Aces',
      email: 'aces@example.com',
      password: 'hashedpassword5',
      points: 310,
      currentChallenge: 3
    },
    {
      name: 'Code Ninjas',
      email: 'ninjas@example.com',
      password: 'hashedpassword6',
      points: 450,
      currentChallenge: 4
    },
    {
      name: 'Dev Dreamers',
      email: 'dreamers@example.com',
      password: 'hashedpassword7',
      points: 250,
      currentChallenge: 2
    },
    {
      name: 'Script Soldiers',
      email: 'soldiers@example.com',
      password: 'hashedpassword8',
      points: 380,
      currentChallenge: 3
    }
  ];

  console.log('Creating teams...');
  const createdTeams = await Promise.all(
    teams.map(team => 
      prisma.team.create({
        data: team
      })
    )
  );

  // Create submissions
  const submissionTypes = ['algorithmic', 'buildathon'];
  const submissionData = [];

  console.log('Creating submissions...');
  for (const team of createdTeams) {
    for (let i = 0; i < team.currentChallenge; i++) {
      const challenge = createdChallenges[i];
      const isCorrect = Math.random() > 0.3; // 70% correct submissions
      const points = isCorrect ? Math.floor(Math.random() * challenge.maxPoints) + 50 : 0;
      
      submissionData.push({
        teamId: team.id,
        challengeId: challenge.id,
        type: submissionTypes[Math.floor(Math.random() * submissionTypes.length)],
        content: JSON.stringify({
          code: `// Sample submission for ${challenge.title}`,
          explanation: 'This is a sample solution',
          timestamp: new Date().toISOString()
        }),
        isCorrect,
        points,
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date within last week
      });
    }
  }

  await Promise.all(
    submissionData.map(submission => 
      prisma.submission.create({
        data: submission
      })
    )
  );

  console.log('Competition data seeded successfully!');
  console.log(`Created ${createdChallenges.length} challenges`);
  console.log(`Created ${createdTeams.length} teams`);
  console.log(`Created ${submissionData.length} submissions`);
}

seedCompetition()
  .catch((e) => {
    console.error('Error seeding competition data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
