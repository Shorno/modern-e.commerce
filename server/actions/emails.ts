"use server"

import {Resend} from "resend";
import getBaseURL from "@/lib/base-urls";

const resend = new Resend(process.env.RESEND_API);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/auth/new-verification?token=${token}`;


    const {data, error} = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Next Store - Confirmation Email',
        html: `<p>Click here <a href="${confirmationLink}">Verify your email</a> </p>`,
    });

    if (error) {
        console.log(error);
    }
    if (data) return data;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/auth/new-password?token=${token}`;


    const {data, error} = await resend.emails.send({
        from: 'NextStore <onboarding@resend.dev>',
        to: email,
        subject: 'Next Store - Confirmation Email',
        html: `<p>Click here <a href="${confirmationLink}">to reset your password</a></p>>`,
    });

    if (error) {
        console.log(error);
    }
    if (data) return data;
}

export const sendTwoFactorTokenByEmail = async (email: string, token: string) => {
    console.log("Sending Two Factor Token", token);

    const {data, error} = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Next Store - Two Factor Token',
        html: `<p>Your Confirmation Code : ${token}</p>`,
    });

    if (error) {
        console.log(error);
    }
    if (data) return data;
}