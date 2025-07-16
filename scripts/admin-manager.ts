import prisma from '../src/lib/prisma';
import { hash } from 'bcryptjs';

async function manageAdmins() {
  try {
    const command = process.argv[2];
    
    switch (command) {
      case 'list':
        await listAdmins();
        break;
      case 'create':
        await createAdmin();
        break;
      case 'deactivate':
        await deactivateAdmin();
        break;
      case 'activate':
        await activateAdmin();
        break;
      case 'reset-password':
        await resetPassword();
        break;
      default:
        console.log('Available commands:');
        console.log('  list                     - List all admin users');
        console.log('  create <username> <password> [email] [fullName] - Create new admin');
        console.log('  deactivate <username>    - Deactivate admin user');
        console.log('  activate <username>      - Activate admin user');
        console.log('  reset-password <username> <newPassword> - Reset admin password');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function listAdmins() {
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      isActive: true,
      createdAt: true,
      lastLogin: true
    }
  });

  console.log('\n📋 Admin Users:');
  console.log('─'.repeat(80));
  
  if (admins.length === 0) {
    console.log('No admin users found.');
    return;
  }

  admins.forEach(admin => {
    console.log(`👤 ${admin.username} (${admin.fullName})`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Status: ${admin.isActive ? '✅ Active' : '❌ Inactive'}`);
    console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
    console.log(`   Last Login: ${admin.lastLogin ? admin.lastLogin.toLocaleDateString() : 'Never'}`);
    console.log('─'.repeat(80));
  });
}

async function createAdmin() {
  const args = process.argv.slice(3);
  
  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/admin-manager.ts create <username> <password> [email] [fullName]');
    return;
  }

  const [username, password, email, fullName] = args;

  const existingAdmin = await prisma.admin.findUnique({
    where: { username }
  });

  if (existingAdmin) {
    console.error(`❌ Admin user '${username}' already exists!`);
    return;
  }

  const hashedPassword = await hash(password, 12);

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
}

async function deactivateAdmin() {
  const username = process.argv[3];
  
  if (!username) {
    console.error('Usage: npx tsx scripts/admin-manager.ts deactivate <username>');
    return;
  }

  const admin = await prisma.admin.update({
    where: { username },
    data: { isActive: false }
  });

  console.log(`✅ Admin user '${admin.username}' deactivated successfully!`);
}

async function activateAdmin() {
  const username = process.argv[3];
  
  if (!username) {
    console.error('Usage: npx tsx scripts/admin-manager.ts activate <username>');
    return;
  }

  const admin = await prisma.admin.update({
    where: { username },
    data: { isActive: true }
  });

  console.log(`✅ Admin user '${admin.username}' activated successfully!`);
}

async function resetPassword() {
  const args = process.argv.slice(3);
  
  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/admin-manager.ts reset-password <username> <newPassword>');
    return;
  }

  const [username, newPassword] = args;
  const hashedPassword = await hash(newPassword, 12);

  const admin = await prisma.admin.update({
    where: { username },
    data: { password: hashedPassword }
  });

  console.log(`✅ Password for admin user '${admin.username}' reset successfully!`);
}

manageAdmins();
