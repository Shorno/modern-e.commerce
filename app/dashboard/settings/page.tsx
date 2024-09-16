import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import SettingsCard from "@/app/dashboard/settings/settings-card";

export default async function Settings() {
    const session = await auth();
    console.log(session)
    if (!session) {
        redirect("/")
    }

    if (session) {
        return (
            <>
                <div className={"container mx-auto"}>
                    <SettingsCard session={session}/>
                </div>
            </>
        )
    }

}