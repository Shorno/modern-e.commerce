"use client"
import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormField, FormControl, FormMessage, FormItem, FormLabel, FormDescription} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {RegisterSchema} from "@/types/register-schema";
import {useAction} from "next-safe-action/hooks";
import {emailRegister} from "@/server/actions/email-register";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";

export default function RegisterForm() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        }
    });


    const {execute, status} = useAction(emailRegister, {
        onSuccess(data) {
            console.log("Action response:", data);
            if (data.data?.error) {
                setError(data.data.error);
            } else if (data.data?.success) {
                setSuccess(data.data.success);
            }
        }
    });


    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }


    return (
        <>
            <AuthCard
                cardTitle={"Create an account 🥳"}
                backButtonHref={"/auth/login"}
                backButtonLabel={"Already have an account?"}
                showSocials
            >
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your username" {...field} type={"text"}/>
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} type={"email"}
                                                       autoComplete={"email"}/>
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your password" {...field} type={"text"}
                                                       autoComplete={"current-password"}/>
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormError message={error}/>
                                <FormSuccess message={success}/>
                                <Button type={"submit"}
                                        className={cn("w-full my-4", status === "executing" ? "animate-pulse" : "")}>
                                    Register
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AuthCard>
        </>
    )
}