import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      competitorId?: string | null;
      teamId?: string | null;
      isLeader?: boolean;
      teamName?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    competitorId?: string | null;
    teamId?: string | null;
    isLeader?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    competitorId?: string | null;
    teamId?: string | null;
    isLeader?: boolean;
  }
}
