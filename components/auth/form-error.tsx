import {AlertCircle} from "lucide-react";

export const FormError = ({message}: {message? : string}) => {
    if (!message) return null
    return (
        <div className={"bg-destructive/50 text-secondary-foreground p-3 my-4 rounded-md flex items-center gap-x-2 transition-all"}>
            <AlertCircle className={"w-4 h-4 flex-shrink-0"}/>
            <p className={"text-sm"}>{message}</p>
        </div>
    )
}