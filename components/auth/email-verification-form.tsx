"use client"

import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {newVerificationToken} from "@/server/actions/tokens";
import {AuthCard} from "@/components/auth/auth-card";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";

export const EmailVerificationForm = () => {
    const token = useSearchParams().get("token");
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const handleVerification = useCallback(async () => {
        if (success || error) {
            return;
        }

        if (!token) {
            setError("No token found");
            return;
        }

        const data = await newVerificationToken(token);
        if (data.error) {
            setError(data.error);
        }
        if (data.success) {
            setSuccess(data.success);
            // setTimeout(() => {
            //     router.push("/auth/login");
            // }, 3000);

            router.push("/auth/login");

        }
    }, [token, success, error, router]);

    useEffect(() => {
        handleVerification();
    }, [handleVerification]);


    return (
        <AuthCard cardTitle={"Verify your account"} backButtonHref={"/auth/login"} backButtonLabel={"Back to login"}>
            <div className={"flex flex-col gap-4 items-center w-full justify-center "}>
                <p>{!success && !error ? "Verifying email..." : null}</p>
                <FormSuccess message={success}/>
                <FormError message={error}/>
            </div>
        </AuthCard>
    );
}
