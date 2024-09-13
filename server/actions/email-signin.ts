"use server"
import {LoginSchema} from "@/types/login-schema";
import {actionClient} from "@/lib/safe-action";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {users} from "@/server/schema"
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {sendVerificationEmail} from "@/server/actions/emails";
import {AuthError} from "next-auth";
import {signIn} from "@/server/auth";


export const emailSignIn = actionClient.schema(LoginSchema)
    .action(async ({parsedInput: {email, password}}) => {

        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            })
            if (existingUser?.email !== email) {
                return {error: "Email is not registered"}
            }
            if (!existingUser?.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(existingUser?.email)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)

                return {success: "Email not verified. Check your email for a verification link."}
            }

            await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            return {success: email};

        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return {error: "Email or password is incorrect"}
                    case "AccessDenied":
                        return {error: error.message}
                    case "OAuthSignInError":
                        return {error: error.message}
                    default:
                        return {error: "Something went wrong"}
                }
            }
        }
    })