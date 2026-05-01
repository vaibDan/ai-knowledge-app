// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "./app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Find user in DB
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                // Compare password
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValid) return null;

                return user; // returned object becomes session.user
            },
        }),
    ],
    session: {
        strategy: "jwt", // ← required for credentials provider
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id; // persist user.id in token
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id as string; // expose user.id in session
            return session;
        },
    },
    pages: {
        signIn: "/login", // your custom login page
    },
});