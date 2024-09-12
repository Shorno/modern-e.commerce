"use client"
import {Session} from "next-auth";
import {signOut} from "next-auth/react";

export const UserButton = ({user}: Session) => {
    return (
       <div className={""}>
           <h1>{user?.email}</h1>

           <button onClick={()=> signOut()}>Sign Out</button>
       </div>
    )
}