import {auth} from "@/server/auth";
import Logo from "@/components/navigation/logo";
import {UserButton} from "@/components/navigation/user-button";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LogIn} from "lucide-react";

export default async function Nav() {
    const session = await auth();
    const user = session?.user;
    const expires = session?.expires;
    return (
        <>
            <header className={"bg-slate-500 py-4"}>
                <nav className={"container mx-auto"}>
                    <ul className={"flex justify-between"}>
                            <Logo/>
                            {!session ?
                                (
                                    <li>
                                        <Button asChild>
                                            <Link className={"flex gap-2"} href={"/auth/login"}><LogIn/><span>Login</span></Link>
                                        </Button>
                                    </li>
                                )
                                :
                                (
                                    <li><UserButton expires={expires!} user={user}/></li>
                                )

                            }
                    </ul>
                </nav>
            </header>
        </>
    )
}