"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Session} from "next-auth"
import {signOut} from "next-auth/react"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import Image from "next/image"
import {LogOut, Moon, Settings, Sun, TruckIcon} from "lucide-react"
import {useTheme} from "next-themes"
import {useState, useEffect} from "react"
import {Switch} from "@/components/ui/switch"
import {useRouter} from "next/navigation";

export const UserButton = ({user}: Session) => {
    const {setTheme, theme} = useTheme()
    const [checked, setChecked] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setSwitchState()
    })

    function setSwitchState() {
        switch (theme) {
            case "dark":
                setChecked(true)
                break
            case "light":
            case "system":
                setChecked(false)
                break
        }
    }

    if (user)
        return (
            <div className={""}>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className={"focus:outline-none"}>
                        <Avatar>
                            {user.image && (
                                <Image src={user.image} alt={user.name!} fill/>
                            )}
                            {
                                !user.image && (
                                    <AvatarFallback className={"bg-primary/25"}>
                                        <div className={"font-bold"}>
                                            {user.email?.charAt(0).toLowerCase()}
                                        </div>
                                    </AvatarFallback>
                                )
                            }
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className={"w-64 p-6"} align={"end"}>
                        <div className={"mb-4 p-4 flex flex-col items-center bg-primary/15 rounded-lg gap-1"}>
                            {
                                user.image && (
                                    <Image src={user.image} alt={user.name!} width={32} height={32}
                                           className={"rounded-full"}/>
                                )
                            }
                            <p className={"font-bold text-xs"}>{user.name}</p>
                            <span className={"text-xs font-medium text-secondary-foreground"}>{user.email}</span>
                        </div>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={() => router.push("/dashboard/orders")}
                            className={"py-2 font-medium cursor-pointer group"}>
                            <TruckIcon
                                className={"mr-2 px-1 group-hover:translate-x-1 transition-all duration-300 ease-in-out"}/> My
                            Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push("/dashboard/settings")}
                            className={"py-2 font-medium cursor-pointer group "}>
                            <Settings
                                className={"mr-2 px-1 group-hover:rotate-180 transition-all duration-300 ease-in-out"}/> Settings
                        </DropdownMenuItem>
                        {theme && (
                            <DropdownMenuItem className={"py-2 font-medium cursor-pointer"}>
                                <div onClick={(e) => e.stopPropagation()}
                                     className={"flex items-center justify-between w-full group"}>
                                    <div className={"flex items-center"}>
                                        <div className={"relative flex mr-2"}>
                                            <Sun
                                                className={"px-1 group-hover:text-yellow-600 absolute group-hover:rotate-180 dark:scale-0 dark:rotate-90 transition-all duration-200 ease-in-out"}/>
                                            <Moon className={"px-1 group-hover:text-blue-400 dark:scale-100 scale-0"}/>
                                        </div>
                                        <p className={`text-xs font-bold ${theme === "dark" ? "text-blue-400" : "text-yellow-600"}`}>
                                            {theme[0].toUpperCase() + theme.slice(1)} Mode
                                        </p>
                                    </div>
                                    <Switch
                                        className={"scale-75"}
                                        checked={checked}
                                        onCheckedChange={(e) => {
                                            setChecked((prev) => !prev)
                                            setTheme(e ? "dark" : "light")
                                        }}
                                    />
                                </div>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => signOut()}
                                          className={"py-2 font-medium cursor-pointer focus:bg-destructive/30 group"}
                        >
                            <LogOut
                                className={"mr-2 px-1 group-hover:scale-90 transition-all duration-300 ease-in-out"}/> Sign
                            Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
}