"use server"
import {LoginSchema} from "@/types/login-schema";
import {actionClient} from "@/lib/safe-action";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {twoFactorTokens, users} from "@/server/schema"
import {
    generateEmailVerificationToken,
    generateTwoFactorToken,
    getTwoFactorTokenByEmail
} from "@/server/actions/tokens";
import {sendTwoFactorTokenByEmail, sendVerificationEmail} from "@/server/actions/emails";
import {AuthError} from "next-auth";
import {signIn} from "@/server/auth";


export const emailSignIn = actionClient.schema(LoginSchema)
    .action(async ({parsedInput: {email, password, code}}) => {

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

                if (existingUser.twoFactorEnabled && existingUser.email) {
                    if (code) {
                        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

                        if (!twoFactorToken) {
                            return {error: "Missing Token"}
                        }
                        if (twoFactorToken.token !== code) {
                            return {error: "Invalid Token"}
                        }

                        const hasExpired = new Date(twoFactorToken.expires) < new Date();
                        if (hasExpired) {
                            return {error: "Token has expired"}
                        }

                        await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))

                        const existingConfirmation = await getTwoFactorTokenByEmail(existingUser.email)

                        if (existingConfirmation) {
                            await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingUser.email))
                        }

                    } else {
                        const token = await generateTwoFactorToken(existingUser.email)

                        if (!token) {
                            return {error: "Token not generated"}
                        }

                        await sendTwoFactorTokenByEmail(token[0].email, token[0].token)
                        return {twoFactor: "Two Factor Token sent to your email"}
                    }
                }

                await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })
                return {success: "Signed in successfully"}

            } catch
                (error) {
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
        }
    )