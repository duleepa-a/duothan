import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {compare} from "bcryptjs" 
import prisma from "@/lib/prisma"
// import { NextResponse } from "next/server"

//export this authOptions as an object and use with getServerSession in the app directory to access session data in server components
const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session:{
        strategy:'jwt'
    },
    pages: {
        signIn : '/login'
    },
    providers: [
                
        CredentialsProvider ({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            credentials: {
            email: { label: "Email", type: "text", placeholder: "your.email@mail.com" },
            password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
            // const res = await fetch("/api/login", {
            //     method: 'POST',
            //     body: JSON.stringify(credentials),
            //     headers: { "Content-Type": "application/json" }
            // })
            
// await new Promise(resolve => setTimeout(resolve, 3000));

// console.log(credentials);
            if(!credentials?.email || !credentials?.password){
                return null;
            }

            const existingUser= await prisma.userProfile.findUnique({
                where:{email: credentials?.email},
                include: {
                    competitor: {
                        include: {
                            team: {
                            select: {
                                name: true,   // only get team name
                            },
                            },
                        },
                    }, 
                },
                
            })

            if(!existingUser){
                return null
            }

            const pwmatch = await compare(credentials.password, existingUser.password);

            if(!pwmatch){
                return null;
            }
            return {
                id:`${existingUser.id}`,
                email: existingUser.email,
                // last:existingUser.lastname
                role:`${existingUser.role}`,
                competitorId: existingUser.competitor?.id || null,
                teamId: existingUser.competitor?.teamId || null,
                teamName: existingUser.competitor?.team?.name || null,
                isLeader: existingUser.competitor?.isLeader || false,
            }
            
            // return NextResponse.json({message: "signed in "},{error:"noerror"})
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

    ],callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id;
                token.role = user.role;
                token.competitorId = (user as any).competitorId;
                token.teamId = (user as any).teamId;
                token.isLeader = (user as any).isLeader;
                token.teamName = (user as any).teamName;
            }
            return token
        },
        async session({session,token}){
           if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.competitorId = token.competitorId as string | null;
                session.user.teamId = token.teamId as string | null;
                session.user.isLeader = token.isLeader as boolean;
                session.user.teamName = token.teamName as string | null;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }  