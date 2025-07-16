import prisma from '../src/lib/prisma';

async function seedData() {
  try {
    console.log('Starting seed...');

    // Create some sample teams
    const teams = await Promise.all([
      prisma.team.create({
        data: {
          name: 'Code Warriors',
          email: 'warriors@oasis.com',
          password: 'hashedpassword1',
          points: 300,
          currentChallenge: 3,
        },
      }),
      prisma.team.create({
        data: {
          name: 'Cyber Guardians',
          email: 'guardians@oasis.com',
          password: 'hashedpassword2',
          points: 250,
          currentChallenge: 2,
        },
      }),
      prisma.team.create({
        data: {
          name: 'Digital Rebels',
          email: 'rebels@oasis.com',
          password: 'hashedpassword3',
          points: 400,
          currentChallenge: 4,
        },
      }),
      prisma.team.create({
        data: {
          name: 'Matrix Hackers',
          email: 'matrix@oasis.com',
          password: 'hashedpassword4',
          points: 180,
          currentChallenge: 2,
        },
      }),
      prisma.team.create({
        data: {
          name: 'Quantum Coders',
          email: 'quantum@oasis.com',
          password: 'hashedpassword5',
          points: 350,
          currentChallenge: 3,
        },
      }),
    ]);

    // Create some sample challenges
    const challenges = await Promise.all([
      prisma.challenge.create({
        data: {
          title: 'Array Manipulation Challenge',
          description: 'Solve array-based algorithmic problems',
          algorithmicProblem: 'Given an array of integers, find the maximum sum of contiguous subarray.',
          buildathonProblem: 'Build a web application that visualizes array algorithms.',
          flag: 'OASIS{max_subarray_sum}',
          points: 100,
          order: 1,
          isActive: true,
        },
      }),
      prisma.challenge.create({
        data: {
          title: 'Graph Theory Quest',
          description: 'Navigate through complex graph problems',
          algorithmicProblem: 'Find the shortest path between two nodes in a weighted graph.',
          buildathonProblem: 'Create a graph visualization tool with pathfinding algorithms.',
          flag: 'OASIS{dijkstra_path}',
          points: 150,
          order: 2,
          isActive: true,
        },
      }),
      prisma.challenge.create({
        data: {
          title: 'Dynamic Programming Odyssey',
          description: 'Master the art of dynamic programming',
          algorithmicProblem: 'Solve the classic knapsack problem using dynamic programming.',
          buildathonProblem: 'Build an interactive DP problem solver with step-by-step visualization.',
          flag: 'OASIS{knapsack_optimal}',
          points: 200,
          order: 3,
          isActive: true,
        },
      }),
      prisma.challenge.create({
        data: {
          title: 'Machine Learning Matrix',
          description: 'Implement machine learning algorithms',
          algorithmicProblem: 'Implement a basic neural network from scratch.',
          buildathonProblem: 'Create a web-based ML model training interface.',
          flag: 'OASIS{neural_network}',
          points: 250,
          order: 4,
          isActive: true,
        },
      }),
    ]);

    // Create some sample submissions
    const submissions = [];
    for (let i = 0; i < 20; i++) {
      const randomTeam = teams[Math.floor(Math.random() * teams.length)];
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      const isAlgorithmic = Math.random() > 0.3;
      
      submissions.push(
        prisma.submission.create({
          data: {
            teamId: randomTeam.id,
            challengeId: randomChallenge.id,
            type: isAlgorithmic ? 'ALGORITHMIC' : 'BUILDATHON',
            content: isAlgorithmic ? 'function solution() { return "solved"; }' : null,
            githubLink: isAlgorithmic ? null : 'https://github.com/team/solution',
            isCorrect: Math.random() > 0.3,
            executionTime: isAlgorithmic ? Math.floor(Math.random() * 1000) : null,
            submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
          },
        })
      );
    }

    await Promise.all(submissions);

    console.log('Seed completed successfully!');
    console.log(`Created ${teams.length} teams`);
    console.log(`Created ${challenges.length} challenges`);
    console.log(`Created ${submissions.length} submissions`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
