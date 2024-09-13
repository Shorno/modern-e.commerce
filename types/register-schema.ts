import {z} from "zod";

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Invalid Email address"
    }).min(1, {message: "Email is required"}),
    password: z.string().min(1, {message: "Password is required"}).min(8, {message: "Password must be at least 8 characters long"}),
    name : z.string().min(1, {message: "Name is required"}).min(3, {message: "Name must be at least 3 characters long"})
})