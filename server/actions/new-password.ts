"use server"

import {actionClient} from "@/lib/safe-action";
import {NewPasswordSchema} from "@/types/new-password-schema";
import {getPasswordResetTokenByToken} from "@/server/actions/tokens";
import {passwordResetTokens, users} from "@/server/schema";
import {eq} from "drizzle-orm";
import {db} from "@/server";
import bcrypt from "bcrypt";
import {Pool} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-serverless";

export const newPassword = actionClient.schema(NewPasswordSchema)
    .action(async ({parsedInput: {password, token}}) => {

        const pool = new Pool({connectionString: process.env.POSTGRES_URL});

        const dbPool = drizzle(pool)

        if (!token) return {error: "Missing Token"}

        const existingToken = await getPasswordResetTokenByToken(token);
        if (!existingToken) return {error: "Reset token not found"};

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

        const hashedPassword = await bcrypt.hash(password, 10);

        await dbPool.transaction(async (tx) => {
            await tx.update(users).set({
                password: hashedPassword
            }).where(eq(users.id, existingUser.id))

            await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))

        })
        return {success: "Password updated"}

    })
