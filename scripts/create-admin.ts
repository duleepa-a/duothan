import prisma from '../src/lib/prisma';
import { hash } from 'bcryptjs';

async function createAdmin() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Usage: npx tsx scripts/create-admin.ts <username> <password> [email] [fullName]');
      process.exit(1);
    }

    const [username, password, email, fullName] = args;

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      console.error(`Admin user '${username}' already exists!`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email: email || `${username}@codechallenge.com`,
        fullName: fullName || `${username} (Admin)`,
        isActive: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Full Name: ${admin.fullName}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
