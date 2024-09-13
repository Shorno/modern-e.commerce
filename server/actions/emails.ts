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
        html: `<a href="${confirmationLink}">Verify your email</a>`,
    });

    if (error) {
        console.log(error);
    }
    if (data) return data;
}