"use server"
import {actionClient} from "@/lib/safe-action";
import {SettingsSchema} from "@/types/settings-schema";
import {auth} from "@/server/auth";
import {db} from "@/server";
import {users} from "@/server/schema";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import bcrypt from "bcrypt";

export const settings = actionClient.schema(SettingsSchema)
    .action(async ({parsedInput: values}) => {
        const user = await auth()
        if (!user) {
            return {error: "User not found"}
        }

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.user.id)
        })

        if (!dbUser) {
            return {error: "User not found"}
        }
        if (user.user.isOAuth) {
            values.email = undefined
            values.password = undefined
            values.newPassword = undefined
            values.isTwoFactorEnabled = undefined
        }

        if (values.password && values.newPassword && dbUser.password) {
            const passwordMatch = await bcrypt.compare(values.password, dbUser.password)

            if (!passwordMatch) {
                return {error: "Password does not match"}
            }
            const samePassword = await bcrypt.compare(values.newPassword, dbUser.password)

            if (samePassword) {
                return {error: "New password must be different"}
            }

            values.password = await bcrypt.hash(values.newPassword, 10);
            values.newPassword = undefined
        }

        await db.update(users).set({
            name: values.name,
            password: values.password,
            email: values.email,
            image: values.image,
            twoFactorEnabled: values.isTwoFactorEnabled
        })
            .where(eq(users.id, user.user.id))

        revalidatePath("/dashboard/settings")
        return {success: "Settings updated"}


    })