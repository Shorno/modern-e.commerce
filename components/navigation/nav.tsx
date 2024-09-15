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
            <header className={"py-8 px-4"}>
                <nav className={"container mx-auto"}>
                    <ul className={"flex justify-between"}>
                        <li>
                            <Link href={"/"}> <Logo/> </Link>
                        </li>
                        {!session ?
                            (
                                <li className={"items-center flex justify-between"}>
                                    <Button asChild>
                                        <Link className={"flex gap-2"}
                                              href={"/auth/login"}><LogIn/><span>Login</span></Link>
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

//updated node modules