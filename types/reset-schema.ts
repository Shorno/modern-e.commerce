import {z} from "zod";

export const ResetSchema = z.object({
    email: z.string().email({message:"Invalid email address"}),
});
