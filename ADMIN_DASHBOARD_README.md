# OASIS Protocol Admin Dashboard

## Overview

The Admin Dashboard is a comprehensive monitoring and management interface for the OASIS Protocol buildathon platform. It provides administrators with real-time insights into team performance, challenge progress, and platform activity.

## Features

### 📊 Dashboard Statistics
- **Team Registration Count**: Total number of registered teams
- **Active Challenges**: Number of challenges currently available
- **Total Submissions**: Combined count of all submissions (algorithmic + buildathon)
- **Recent Activity**: Live feed of the latest team activities

### 📈 Interactive Charts
- **Submission Types Distribution**: Pie chart showing the ratio of algorithmic vs buildathon submissions
- **Team Registration Trends**: Line chart displaying team registration patterns over the last 7 days
- **Challenge Completion Rates**: Bar chart showing completion statistics for each challenge
- **Platform Summary**: Quick overview of key metrics

### 🏆 Leaderboard Snapshot
- Top 10 teams ranked by points
- Current challenge progress for each team
- Registration timestamps
- Visual ranking indicators (gold, silver, bronze)

### 📱 Responsive Design
- Mobile-friendly interface
- Collapsible navigation sidebar
- Adaptive layouts for different screen sizes

## Database Schema

The admin dashboard uses the following database models:

### Team
```prisma
model Team {
  id          String      @id @default(cuid())
  name        String      @unique
  email       String      @unique
  password    String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  submissions Submission[]
  points      Int         @default(0)
  currentChallenge Int    @default(1)
}
```

### Challenge
```prisma
model Challenge {
  id                String        @id @default(cuid())
  title             String
  description       String
  algorithmicProblem String       @db.Text
  buildathonProblem String?      @db.Text
  flag              String
  points            Int           @default(100)
  isActive          Boolean       @default(true)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  submissions       Submission[]
  order             Int           @unique
}
```

### Submission
```prisma
model Submission {
  id            String      @id @default(cuid())
  teamId        String
  challengeId   String
  type          SubmissionType
  content       String?     @db.Text
  githubLink    String?
  isCorrect     Boolean     @default(false)
  submittedAt   DateTime    @default(now())
  executionTime Int?
  team          Team        @relation(fields: [teamId], references: [id])
  challenge     Challenge   @relation(fields: [challengeId], references: [id])
}
```

## API Endpoints

### GET /api/admin/dashboard
Returns comprehensive dashboard statistics including:
- Total teams count
- Active challenges count
- Total submissions count
- Leaderboard data (top 10 teams)
- Submission statistics by type
- Recent activity feed
- Team registration trends
- Challenge completion statistics

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "totalTeams": 5,
    "activeChallenges": 4,
    "totalSubmissions": 20,
    "leaderboard": [...],
    "submissionStats": [...],
    "recentActivity": [...],
    "registrationsByDay": {...},
    "challengeStats": [...]
  }
}
```

## Components

### AdminDashboardStats
Main statistics component that displays:
- Summary cards with key metrics
- Leaderboard table
- Recent activity feed

### AdminDashboardCharts
Charts component featuring:
- Submission types pie chart
- Registration trends line chart
- Challenge completions bar chart
- Platform summary statistics

### AdminDashboardHeader
Header component with:
- OASIS Protocol branding
- Notification indicators
- Admin profile dropdown
- Logout functionality

### AdminNavigation
Sidebar navigation with:
- Collapsible design
- Menu items for different admin sections
- Active state indicators
- Responsive behavior

## Setup Instructions

1. **Database Setup**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Dashboard**
   Navigate to `http://localhost:3001/admin`

## Technologies Used

- **Frontend**: React, Next.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts library
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Sample Data

The dashboard includes sample data with:
- 5 demo teams with varying points and progress
- 4 sample challenges covering different topics
- 20 sample submissions with realistic timestamps
- Mixed submission types (algorithmic and buildathon)

## Security Features

- Protected admin routes
- Session management
- Database query optimization
- Error handling and logging

## Future Enhancements

- Real-time WebSocket updates
- Advanced filtering and search
- Export functionality for reports
- Team performance analytics
- Challenge difficulty analysis
- Automated notifications system

## Notes

- The dashboard is designed to be extensible and can easily accommodate additional features
- All components are fully typed with TypeScript
- The design follows modern dashboard UI/UX patterns
- Database queries are optimized for performance
- The system is ready for production deployment
