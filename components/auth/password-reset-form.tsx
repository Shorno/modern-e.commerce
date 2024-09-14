"use client"
import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormField, FormControl, FormMessage, FormItem, FormLabel, FormDescription} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useAction} from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";
import {Loader2} from "lucide-react";
import {NewPasswordSchema} from "@/types/new-password-schema";
import {newPassword} from "@/server/actions/new-password";
import {useSearchParams} from "next/navigation";

export default function NewPasswordForm() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        }
    });

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {execute, status} = useAction(newPassword, {
        onSuccess(data) {
            console.log("Action response:", data);
            if (data.data?.error) {
                setError(data.data.error);
            } else if (data.data?.success) {
                setSuccess(data.data.success);
            }
        }
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {

        setError("")
        execute({password: values.password, token})
    }


    return (
        <>
            <AuthCard
                cardTitle={"Enter a new password"}
                backButtonHref={"/auth/login"}
                backButtonLabel={"Back to login"}
                showSocials
            >
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your password" {...field} type={"text"}
                                                       autoComplete={"current-password"}
                                                       disabled={status === "executing"}
                                                />
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
                                    {status === "executing" ? <Loader2 className={"animate-spin"}/> : "Reset password"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AuthCard>
        </>
    )
}