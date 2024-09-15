import NextAuth from "next-auth"
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import {db} from "@/server/index";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import Credentials from "@auth/core/providers/credentials";
import {LoginSchema} from "@/types/login-schema";
import {eq} from "drizzle-orm";
import {accounts, users} from "@/server/schema";
import bcrypt from "bcrypt";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    session: {strategy: "jwt"},
    callbacks: {
        async session({session, token}) {
            if (session && token.sub) {
                session.user.id = token.sub
            }
            if (session.user && token.role) {
                session.user.role = token.role as string
            }
            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
                session.user.isOAuth = token.isOAuth as boolean
            }
            return session;
        },

        async jwt({token}) {
            if (!token.sub) return token;
            const existingUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub)
            })
            if (!existingUser) return token;

            const existingAccount = await db.query.accounts.findFirst({
                where: eq(accounts.userId, existingUser.id),
            })

            token.isOAuth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.image = existingUser.image
            token.role = existingUser.role
            token.isTwoFactorEnabled = existingUser.twoFactorEnabled
            return token;
        }

    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            authorize: async (credentials) => {
                const validateFields = LoginSchema.safeParse(credentials)

                if (validateFields.success) {
                    const {email, password} = validateFields.data;

                    const user = await db.query.users.findFirst({
                        where: eq(users.email, email)
                    })

                    if (!user || !user.password) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) return user;
                }
                return null;
            }
        })
    ],
})