"use client";

import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";

export default function Socials() {
    return (
        <>
            <div className={""}>
                <Button onClick={() => signIn("google", {
                    redirect: false,
                    callbackUrl: "/",
                })}>
                    Sign in with Google
                </Button>


                <Button onClick={() => signIn("github", {
                    redirect: false,
                    callbackUrl: "/"
                })}>
                    Sign in with GitHub
                </Button>
            </div>
        </>
    )
}