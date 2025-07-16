# Admin Authentication System

## Overview
The admin authentication system now uses a proper database table instead of hardcoded credentials. This provides better security and manageability.

## Database Schema

### Admin Table
```sql
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP
);
```

## Features

### 1. Database-backed Authentication
- Admin credentials are stored in the database with hashed passwords
- Password hashing using bcrypt with 12 rounds
- Active/inactive status for admin accounts
- Last login tracking

### 2. JWT Token Authentication
- Secure JWT tokens with 24-hour expiration
- HTTP-only cookies for token storage
- Proper token verification and refresh

### 3. Admin Management Scripts
- Create, list, activate, deactivate admin users
- Password reset functionality
- Command-line interface for easy management

## API Endpoints

### POST `/api/admin/auth`
Login endpoint for admin authentication.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "admin_id",
      "username": "admin",
      "email": "admin@codechallenge.com",
      "fullName": "System Administrator",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

### GET `/api/admin/auth`
Get current admin user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "admin_id",
      "username": "admin",
      "email": "admin@codechallenge.com",
      "fullName": "System Administrator",
      "role": "admin",
      "lastLogin": "2025-07-16T07:56:49.000Z"
    }
  }
}
```

### POST `/api/admin/auth/logout`
Logout endpoint that clears authentication cookies.

## Usage

### Default Admin Account
After running the seed script, a default admin account is created:
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@codechallenge.com`

### Admin Management Commands

#### List all admin users
```bash
npx tsx scripts/admin-manager.ts list
```

#### Create new admin user
```bash
npx tsx scripts/admin-manager.ts create <username> <password> [email] [fullName]
```

#### Deactivate admin user
```bash
npx tsx scripts/admin-manager.ts deactivate <username>
```

#### Activate admin user
```bash
npx tsx scripts/admin-manager.ts activate <username>
```

#### Reset admin password
```bash
npx tsx scripts/admin-manager.ts reset-password <username> <newPassword>
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 rounds
2. **JWT Tokens**: Secure token-based authentication with expiration
3. **HTTP-only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS
4. **Account Status**: Active/inactive status to disable accounts without deletion
5. **Input Validation**: Proper validation of all inputs
6. **Error Handling**: Secure error messages that don't leak information

## Environment Variables

Make sure to set these environment variables:
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: PostgreSQL database connection string

## Migration Commands

To set up the database:
```bash
npx prisma migrate dev --name init-with-admin
npx prisma db seed
```

To reset the database:
```bash
npx prisma migrate reset --force
```

## Testing

You can test the admin authentication by:
1. Starting the development server: `npm run dev`
2. Going to `/portal` in your browser
3. Selecting "Admin Access"
4. Using credentials: `admin` / `admin123`

The system will authenticate against the database and provide access to the admin portal.
