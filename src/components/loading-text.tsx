import React from "react";
import {cn} from "@/lib/utils";

export function LoadingText(props: { text: string, className?: string }) {
    return (
        <div className={cn("flex items-center justify-center w-full h-full", props.className)}>
            <span className="animate-pulse">{props.text}</span>
        </div>
    );
}