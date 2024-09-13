"use client"
import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormField, FormControl, FormMessage, FormItem, FormLabel, FormDescription} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/types/login-schema";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useAction} from "next-safe-action/hooks";
import {emailSignIn} from "@/server/actions/email-signin";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";

export default function LoginForm() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const {execute, status} = useAction(emailSignIn, {
        onSuccess(data) {
            console.log("Action response:", data);
            if (data.data?.error) {
                setError(data.data.error);
            } else if (data.data?.success) {
                setSuccess(data.data.success);
            }
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    }


    return (
        <>
            <AuthCard
                cardTitle={"Welcome back!"}
                backButtonHref={"/auth/register"}
                backButtonLabel={"Create new account"}
                showSocials
            >
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
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
                                <Button size={"sm"} variant={"link"} asChild>
                                    <Link href={"/auth/reset"}>Forgot password?</Link>
                                </Button>
                                <FormSuccess message={success}/>
                                <FormError message={error}/>
                                <Button type={"submit"}
                                        className={cn("w-full my-2", status === "executing" ? "animate-pulse" : "")}>
                                    Login
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AuthCard>
        </>
    )
}