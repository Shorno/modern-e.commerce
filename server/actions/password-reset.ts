"use server"

import {actionClient} from "@/lib/safe-action";
import {ResetSchema} from "@/types/reset-schema";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {users} from "@/server/schema";
import {generatePasswordResetToken} from "@/server/actions/tokens";
import {sendPasswordResetEmail} from "@/server/actions/emails";

export const reset = actionClient.schema(ResetSchema)
.action(async ({parsedInput: {email}}) => {

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    if (!existingUser) {
        return {error: "User not found"}
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (!passwordResetToken) {
        return {error: "Token generation failed"}
    }
    await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token);


    return {success: "Password reset email sent"}
})