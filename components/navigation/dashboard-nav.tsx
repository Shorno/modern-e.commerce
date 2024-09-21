"use client"
import Link from "next/link";
import {cn} from "@/lib/utils";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";
import {usePathname} from "next/navigation";


export default function DashboardNav({allLinks}: {
    allLinks: { label: string, href: string, icon: React.ReactNode }[]
}) {
    const pathname = usePathname();

    return (
        <>
            <nav className={"container mx-auto py-2 overflow-auto"}>
                <ul className={"flex gap-6 text-xs font-semibold"}>
                    <AnimatePresence>
                        {allLinks.map((link) => (
                            <motion.li whileTap={{scale: 0.95}} key={link.href}>
                                <Link href={link.href}
                                      className={cn(`flex gap-1 flex-col items-center relative`, pathname === link.href && `text-primary`)}>
                                    {link.icon}
                                    {link.label}

                                    {pathname === link.href ?
                                        (<motion.div
                                            className={"h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"}
                                            initial={{scale: 0.8}}
                                            animate={{scale: 1}}
                                            layoutId={"underline"}
                                            transition={{type: "spring", stiffness: 500, damping: 30}}

                                        />
                                        ) : null}
                                </Link>
                            </motion.li>
                        ))}
                    </AnimatePresence>

                </ul>
            </nav>
        </>
    )
}