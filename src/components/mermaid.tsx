import React, {useEffect, useState} from "react";
import mermaid from "mermaid";
import {RefreshCcw} from "lucide-react";
import Link from "next/link";
import {ANCHOR_CLASS_NAME} from "@/hooks/use-markdown-processor";
import {v4} from "uuid";

export const Mermaid = ({content}: { content: string }) => {
    const [diagram, setDiagram] = useState<string | boolean>(true);

    useEffect(() => {
        mermaid.initialize({startOnLoad: false, theme: "dark"});
        
        const id = `mermaid-svg-${v4()}`;

        mermaid.parse(content, {suppressErrors: true}).then(isValid => {
            if (!isValid) setDiagram(false);
            else mermaid.render(id, content).then(res => setDiagram(res.svg))
        })

    }, []);

    if (diagram === true) {
        return (
            <div className="flex gap-2 items-center">
                <RefreshCcw className="animate-spin w-4 h-4 "/>
                <p className="font-sans text-sm ">Rendering diagram...</p>
            </div>
        );
    } else if (diagram === false) {
        return (
            <div className="font-sans flex flex-col text-sm gap-2">
                <div className={"flex items-center"}>
                    <span>Unable to render this diagram. Try copying it into the{" "}</span>
                    <Link
                        href="https://mermaid.live/edit"
                        className={ANCHOR_CLASS_NAME}
                        target="_blank"
                    >
                        Mermaid Live Editor
                    </Link>
                    .
                </div>

                <p>
                    {content}
                </p>
            </div>
        );
    } else {
        return <div dangerouslySetInnerHTML={{__html: diagram ?? ""}}/>;
    }
};