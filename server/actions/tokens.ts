"use server"
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {emailTokens, users} from "@/server/schema";

export const getVerificationTokenByEmail = async (token: string) => {
    try {
        return await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, token)
        })
    } catch (error) {
        return null;
    }
}


export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.delete(emailTokens).where(eq(emailTokens.id, email));
    }

    return db.insert(emailTokens).values({
        email,
        token,
        expires
    }).returning()

}

export const newVerificationToken = async (token: string) => {
    const existingToken = await getVerificationTokenByEmail(token);
    console.log("Existing Token", existingToken?.token);
    if (!existingToken) return {error : "Token not found"};

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {error: "Token has expired"}
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })

    if (!existingUser) {
        return {error: "User not found"}
    }

    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.email
    })

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));


    return {success: "Email Verified"};

}