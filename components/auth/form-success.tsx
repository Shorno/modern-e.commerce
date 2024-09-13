import { CheckCircle2 } from "lucide-react";

export const FormSuccess = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
        <div className="bg-teal-400/70 text-secondary-foreground p-3 my-4 rounded-md flex items-center gap-x-2 transition-all">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{message}</p>
        </div>
    );
};