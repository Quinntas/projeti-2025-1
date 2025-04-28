import React, {useEffect, useState} from "react";
import {RefreshCcw} from "lucide-react";
// @ts-expect-error
import {HtmlGenerator, parse} from "latex.js";

export const Latex = ({content}: { content: string }) => {
    const [diagram, setDiagram] = useState<string | boolean>(true);

    useEffect(() => {
        try {
            const generator = new HtmlGenerator({
                hyphenate: false
            });
            const fragment = parse(content, {generator: generator}).domFragment();
            setDiagram(fragment.firstElementChild.outerHTML);
        } catch (error) {
            setDiagram(false);
        }
    }, [content]);

    if (diagram === true) {
        return (
            <div className="flex gap-2 items-center">
                <RefreshCcw className="animate-spin w-4 h-4 "/>
                <p className="font-sans text-sm ">Rendering diagram...</p>
            </div>
        );
    } else if (diagram === false) {
        return (
            <p className="font-sans text-sm">
                {content}
            </p>
        );
    } else {
        return <div dangerouslySetInnerHTML={{__html: diagram ?? ""}}/>;
    }
};