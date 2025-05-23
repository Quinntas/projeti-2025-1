import React, {useState} from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Check, Copy, ThumbsDown, ThumbsUp} from "lucide-react";
import {useMarkdownProcessor} from "@/hooks/use-markdown-processor";

interface Props {
    children: string;
    isLoading: boolean
}

export const AssistantMessage = ({children, isLoading}: Props) => {
    const nodes = useMarkdownProcessor(children);
    const [copied, setCopied] = useState(false);
    const [like, setLike] = useState<boolean | null>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 1000);
        } catch (error) {
            toast.error("Failed to copy to clipboard");
        }
    };

    return (
        <div className="grid my-8">
            {nodes}

            {!isLoading && <div className="flex justify-start gap-1 mt-2 items-center">
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy message to clipboard"
                    title="Copy message to clipboard"
                    onClick={handleCopy}
                >
                    {copied ? <Check className={"w-4 h-4"}/> : <Copy className={"w-4 h-4"}/>}
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setLike(like === true ? null : true)}
                >
                    <ThumbsUp className={"w-4 h-4"} fill={like === true ? "white" : ""}/>
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setLike(like === false ? null : false)}
                >
                    <ThumbsDown className={"w-4 h-4"} fill={like === false ? "white" : ""}/>
                </Button>
            </div>}
        </div>
    );
};