import React from "react";
import {BarChart, Package, PenSquare, Settings, Truck} from "lucide-react";
import {auth} from "@/server/auth";
import DashboardNav from "@/components/navigation/dashboard-nav";

export default async function DashboardLayout({children}: { children: React.ReactNode }) {

    const session = await auth();



    const userLinks = [
        {
            label: "Orders",
            href: "/dashboard/orders",
            icon: <Truck size={16}/>
        },
        {
            label: "Settings",
            href: "/dashboard/settings",
            icon: <Settings size={16}/>
        },

    ] as const

    const adminLinks = session?.user.role === "admin" ? [
        {
            label: "Analytics",
            href: "/dashboard/analytics",
            icon: <BarChart size={16}/>
        },
        {
            label: "Create",
            href: "/dashboard/add-product",
            icon: <PenSquare size={16}/>
        },
        {
            label: "Products",
            href: "/dashboard/products",
            icon: <Package size={16}/>
        },
    ] : []

    const allLinks = [...adminLinks, ...userLinks]

    return (
        <div>
            <DashboardNav allLinks={allLinks}/>
            {children}
        </div>
    )
}