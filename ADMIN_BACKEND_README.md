# Admin Portal Backend Implementation

This document outlines the backend implementation for the CodeChallenge Admin Portal.

## API Endpoints

### Admin Authentication
- `POST /api/admin/auth` - Admin login
- `GET /api/admin/auth` - Get current admin user (using HTTP-only cookie)
- `POST /api/admin/auth/logout` - Admin logout

### Team Management
- `GET /api/admin/teams` - Get all teams with pagination, search, and filtering
- `POST /api/admin/teams` - Create a new team
- `GET /api/admin/teams/[id]` - Get specific team details
- `PUT /api/admin/teams/[id]` - Update team information
- `DELETE /api/admin/teams/[id]` - Delete a team

### Challenge Management
- `GET /api/admin/challenges` - Get all challenges with pagination and filtering
- `POST /api/admin/challenges` - Create a new challenge
- `GET /api/admin/challenges/[id]` - Get specific challenge details
- `PUT /api/admin/challenges/[id]` - Update challenge information
- `DELETE /api/admin/challenges/[id]` - Delete a challenge

### Submission Management
- `GET /api/admin/submissions` - Get all submissions with pagination and filtering
- `GET /api/admin/submissions/[id]` - Get specific submission details
- `PUT /api/admin/submissions/[id]` - Update submission status (approve/reject)
- `DELETE /api/admin/submissions/[id]` - Delete a submission

### Analytics & Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics (existing)
- `GET /api/admin/analytics` - Get comprehensive analytics data

## Database Schema

The backend uses the existing Prisma schema with the following models:

### Teams Table
```sql
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "currentChallenge" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);
```

### Challenges Table
```sql
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "algorithmicProblem" TEXT NOT NULL,
    "buildathonProblem" TEXT,
    "flag" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);
```

### Submissions Table
```sql
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "content" TEXT,
    "githubLink" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionTime" INTEGER,
    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);
```

## Features Implemented

### 1. Admin Authentication
- JWT-based authentication with HTTP-only cookies
- Environment-based admin credentials (configurable)
- Session management with automatic logout
- Protected routes using middleware

### 2. Team Management
- Full CRUD operations for teams
- Search and pagination support
- Team statistics (points, completed challenges, submissions)
- Bulk operations support

### 3. Challenge Management
- Create, read, update, delete challenges
- Toggle challenge active/inactive status
- Order management for challenge sequence
- Submission statistics per challenge

### 4. Submission Review System
- View all submissions with filtering (status, type, team)
- Approve/reject submissions
- Automatic point calculation and team score updates
- Detailed submission content viewing

### 5. Analytics Dashboard
- Real-time statistics (teams, challenges, submissions)
- Completion rate tracking
- Team performance rankings
- Submission trends over time
- Challenge completion statistics

## Security Features

### Authentication
- JWT tokens with expiration
- HTTP-only cookies to prevent XSS
- Environment-based credentials
- Session validation middleware

### Authorization
- Admin-only access to all endpoints
- Token validation on each request
- Proper error handling for unauthorized access

### Data Protection
- Input validation and sanitization
- SQL injection prevention through Prisma
- Rate limiting (can be added)
- CORS configuration

## Performance Optimizations

### Database Queries
- Efficient pagination with offset/limit
- Selective field inclusion with Prisma select
- Optimized joins for related data
- Indexed queries for better performance

### Caching
- Response caching for analytics data
- Client-side state management
- Optimistic updates for better UX

## Error Handling

### API Responses
- Consistent error response format
- Detailed error messages for debugging
- Proper HTTP status codes
- Client-friendly error messages

### Database Errors
- Transaction rollbacks for data consistency
- Duplicate key handling
- Foreign key constraint validation
- Connection error recovery

## Frontend Integration

### Custom Hooks
- `useApi` - Generic API calling hook
- `useAdminTeams` - Team management hook
- `useAdminChallenges` - Challenge management hook
- `useAdminSubmissions` - Submission management hook
- `useAdminAnalytics` - Analytics data hook

### State Management
- React state for UI components
- Real-time data updates
- Loading and error states
- Optimistic updates

## Environment Configuration

Required environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/duothan"
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

## Usage Instructions

1. **Setup Environment**: Copy `.env.example` to `.env.local` and configure variables
2. **Database Setup**: Ensure PostgreSQL is running and database exists
3. **Install Dependencies**: Run `npm install` to install required packages
4. **Start Development**: Run `npm run dev` to start the development server
5. **Admin Access**: Navigate to `/portal` and select "Admin Access"
6. **Login**: Use configured admin credentials (default: admin/admin123)

## API Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get teams
curl -X GET http://localhost:3000/api/admin/teams \
  -H "Cookie: admin_token=your-jwt-token"

# Create challenge
curl -X POST http://localhost:3000/api/admin/challenges \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=your-jwt-token" \
  -d '{"title":"Test Challenge","description":"Test","algorithmicProblem":"Solve this","flag":"flag{test}","points":100,"order":1}'
```

## Future Enhancements

1. **Role-based Access Control**: Multiple admin roles with different permissions
2. **Real-time Updates**: WebSocket integration for live updates
3. **Audit Logging**: Track all admin actions and changes
4. **Bulk Operations**: Mass updates for teams and challenges
5. **Export Functionality**: Export data to CSV/Excel
6. **Advanced Analytics**: More detailed reports and visualizations
7. **Email Notifications**: Automated notifications for submissions
8. **File Upload Support**: Handle file attachments in submissions
9. **Rate Limiting**: Prevent API abuse
10. **Backup & Recovery**: Database backup automation

This backend implementation provides a solid foundation for managing the CodeChallenge platform with comprehensive admin capabilities.
