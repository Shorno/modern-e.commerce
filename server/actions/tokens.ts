"use server"
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {emailTokens, passwordResetTokens, twoFactorTokens, users} from "@/server/schema";
import * as crypto from "node:crypto";

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

    if (!existingToken) return {error: "Token not found"};

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

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        return await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        });
    } catch (error) {
        return null;
    }
}
export const getPasswordResetTokenByTokenByEmail = async (email: string) => {
    try {
        return await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        });
    } catch (error) {
        return null;
    }
}


export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.email, email)
        });
        return twoFactorToken;
    } catch (error) {
        return null;
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.token, token)
        });
        return twoFactorToken;
    } catch (error) {
        return null;
    }
}


export const generatePasswordResetToken = async (email: string) => {
    try {
        const token = crypto.randomUUID();
        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getPasswordResetTokenByTokenByEmail(email);

        if (existingToken) {
            await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, email));
        }

        return db.insert(passwordResetTokens).values({
            email,
            token,
            expires
        }).returning();
    } catch (error) {
        return null;
    }
}


export const generateTwoFactorToken = async (email: string) => {
    try {
        const token =  crypto.randomInt(100_000, 1_000_000).toString();
        console.log("Generated Token", token);

        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getTwoFactorTokenByEmail(email);

        if (existingToken) {
            await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id));
        }

        const twoFactorToken = db.insert(twoFactorTokens).values({
            email,
            token,
            expires
        }).returning();

        console.log("Stored Factor Token", twoFactorToken);

        return twoFactorToken;
    } catch (error) {
        console.log("Error generating Two Factor Token", error);
        return null;
    }
}
