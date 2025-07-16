import prisma from '../src/lib/prisma';
import { hash } from 'bcryptjs';

async function seedData() {
  try {
    console.log('Starting seed...');

    // Create default admin user
    const hashedAdminPassword = await hash('admin123', 12);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@codechallenge.com',
        password: hashedAdminPassword,
        fullName: 'System Administrator',
        isActive: true,
      },
    });

    console.log('Created admin user:', admin.username);
    console.log('Admin credentials: admin / admin123');

    console.log('Seed completed successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
