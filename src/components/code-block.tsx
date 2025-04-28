import React, {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import {extractText} from "@/lib/extract-text";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Check, Copy} from "lucide-react";
import {prismTheme} from "@/lib/prism-theme";
import {LoadingText} from "@/components/loading-text";


const Mermaid = dynamic(
    () => import("@/components/mermaid").then((mod) => mod.Mermaid),
    {
        loading: () => <LoadingText text={"Loading mermaid renderer..."}/>,
        ssr: false
    }
);
const Latex = dynamic(
    () => import("@/components/latex").then((mod) => mod.Latex),
    {
        ssr: false, loading: () => <LoadingText text={"Loading LaTeX renderer..."}/>,
    }
);
const Desmos = dynamic(
    () => import("@/components/desmos").then((mod) => mod.Desmos),
    {ssr: false, loading: () => <LoadingText text={"Loading Desmos renderer..."}/>,}
);
const SyntaxHighlighter = dynamic(
    () =>
        import("react-syntax-highlighter").then((mod) => mod.Prism),
    {ssr: false, loading: () => <LoadingText text={"Loading syntax highlighter..."}/>}
);

export const CodeBlock = ({children, className}: JSX.IntrinsicElements["code"]) => {
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (copied) {
            const interval = setTimeout(() => setCopied(false), 1000);
            return () => clearTimeout(interval);
        }
    }, [copied]);

    if (className) {
        const language = className.split("-")[1] as string;

        const CONTENT: Record<string, JSX.Element> = {
            mermaid: <Mermaid content={children?.toString() ?? ""}/>,
            latex: <Latex content={children?.toString() ?? ""}/>,
            desmos: <Desmos content={children?.toString() ?? ""}/>,
        };

        return (
            <div className="relative group w-full h-full">
                <code ref={ref} className={`${className} flex-grow flex-shrink my-auto`}>
                    {CONTENT[language] ?? (
                        <SyntaxHighlighter style={prismTheme} language={language}>
                            {extractText(children)}
                        </SyntaxHighlighter>
                    )}
                </code>
                <div className="flex absolute top-[0px] right-[0px] flex-col gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        aria-label="copy to clipboard"
                        title="Copy to clipboard"
                        className="invisible group-hover:visible"
                        onClick={() => {
                            if (ref.current) {
                                navigator.clipboard.writeText(ref.current.innerText ?? "");
                                setCopied(true);
                                toast.success("Copied to clipboard");
                            } else {
                                toast.error("Failed to copy to clipboard");
                            }
                        }}
                    >
                        {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <code className="inline-block font-code p-0.5 -my-0.5 rounded">{children}</code>
    );
};
