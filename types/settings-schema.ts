import {z} from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8))
}).refine(data => {
    return !(data.password && !data.newPassword);
}, {message: "New password is required", path: ["newPassword"]})