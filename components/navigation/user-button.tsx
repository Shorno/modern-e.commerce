"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Session} from "next-auth";
import {signOut} from "next-auth/react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import Image from "next/image";
import {LogOut, Moon, Settings, Sun, TruckIcon} from "lucide-react";

export const UserButton = ({user}: Session) => {
    console.log(user)
    if (user)
        return (
            <div className={""}>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
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
                            className={"py-2 font-medium cursor-pointer transition-all duration-500 group"}>
                            <TruckIcon
                                className={"mr-2 px-1 group-hover:translate-x-1 transition-all duration-300 ease-in-out"}/> My
                            Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={"py-2 font-medium cursor-pointer transition-all duration-500 group "}>
                            <Settings
                                className={"mr-2 px-1 group-hover:rotate-180 transition-all duration-300 ease-in-out"}/> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className={"py-2 font-medium cursor-pointer transition-all duration-500"}>
                            <div className={"flex items-center"}>
                                <Sun className={"px-1"}/>
                                <Moon className={"px-1"}/>
                                <p>
                                    Theme <span>theme</span>
                                </p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()}
                        className={"py-2 font-medium cursor-pointer focus:bg-destructive/30 transition-all duration-500 group"}
                        >
                           <LogOut size={14} className={"mr-2 group-hover:scale-90"}/> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
}