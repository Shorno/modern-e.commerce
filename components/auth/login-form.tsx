"use client"
import {AuthCard} from "@/components/auth/auth-card";

export default function LoginForm() {
    return (
        <>
            <AuthCard
                cardTitle={"Welcome back!"}
                backButtonHref={"/auth/register"}
                backButtonLabel={"Create a new account"}
                showSocials
            >
                <div>

                </div>
            </AuthCard>
        </>
    )
}