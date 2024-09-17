"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Session} from "next-auth";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {SettingsSchema} from "@/types/settings-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAction} from "next-safe-action/hooks";
import Image from "next/image";
import {Switch} from "@/components/ui/switch";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {settings} from "@/server/actions/settings";
import {UploadButton} from "@/app/api/uploadthing/upload";

type SettingsForm = {
    session: Session
}


export default function SettingsCard(session: SettingsForm) {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [avatarUploading, setAvatarUploading] = useState<boolean>(false)


    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: session.session.user?.name || undefined,
            email: session.session.user?.email || undefined,
            isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || false,
            image: session.session.user?.image || undefined
        }
    })

    const {execute, status} = useAction(settings, {
        onSuccess: (data) => {
            console.log("Action response:", data);
            if (data.data?.error) {
                setError(data.data.error);
            } else if (data.data?.success) {
                setSuccess(data.data.success);
            }
        },
        onError: () => {
            setError("Something went wrong")
        },

    })

    const onSubmit = (data: z.infer<typeof SettingsSchema>) => {
        setError("")
        setSuccess("")
        console.log("logging data", data)
        execute(data)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className={"text-3xl"}>Your Settings</CardTitle>
                    <CardDescription>Update your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name"
                                                   disabled={status === "executing"} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <div className={"flex items-center gap-4"}>
                                            {!form.getValues("image") && (
                                                <div className={"font-bold"}>
                                                    {session.session.user?.name?.charAt(0).toLowerCase()}
                                                </div>
                                            )}
                                            {
                                                form.getValues("image") && (
                                                    <Image
                                                        className={"rounded-full"}
                                                        src={form.getValues("image")!} alt={"User Image"}
                                                        width={42}
                                                        height={42}

                                                    />
                                                )
                                            }
                                            <UploadButton
                                                className={"scale-75 ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut-button:transition-all ut-button-duration-500" +
                                                    "ut-label:hidden ut-allowed-content:hidden"}
                                                endpoint={"avatarUploader"}
                                                onUploadBegin={() => {
                                                    setAvatarUploading(true)
                                                }}
                                                onUploadError={(error) => {
                                                    form.setError("image", {
                                                        type: "validate",
                                                        message: error.message
                                                    })
                                                    setAvatarUploading(false)
                                                    return
                                                }}
                                                onClientUploadComplete={(res) => {
                                                    form.setValue("image", res[0].url!)
                                                    setAvatarUploading(false)
                                                }}
                                                content={{
                                                    button({ready}) {
                                                        if (ready) {
                                                            return <div>Change Avatar</div>
                                                        }
                                                        return <div>Uploading...</div>
                                                    }
                                                }}
                                            />
                                        </div>
                                        <FormControl>
                                            <Input type={"hidden"} placeholder="Enter your name"
                                                   disabled={status === "executing"} {...field} />
                                        </FormControl>
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
                                            <Input placeholder="********"
                                                   disabled={status === "executing" || session.session.user.isOAuth} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="********"
                                                   disabled={status === "executing" || session.session.user.isOAuth} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isTwoFactorEnabled"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Authentication</FormLabel>
                                        <FormDescription>
                                            Enable two factor authentication for your account
                                        </FormDescription>
                                        <FormControl>
                                            <Switch disabled={status === "executing" || session.session.user.isOAuth}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                            <Button type={"submit"} disabled={status === "executing" || avatarUploading}>Update your
                                settings</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </>
    )
}