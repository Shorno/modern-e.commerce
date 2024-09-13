"use server"
import {actionClient} from "@/lib/safe-action";
import {RegisterSchema} from "@/types/register-schema";
import bcrypt from "bcrypt"
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {users} from "@/server/schema";
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {sendVerificationEmail} from "@/server/actions/emails";


export const emailRegister = actionClient.schema(RegisterSchema)
    .action(async ({parsedInput: {email, password, name}}) => {

        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if (existingUser) {
            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(email);
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)

                return {success: "Email Confirmation Resent"}
            }
            return {error: "Email Already Exists"}
        }

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        })

        const verificationToken = await generateEmailVerificationToken(email);

        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)


        return {success: "Confirmation Email Sent"};
    })