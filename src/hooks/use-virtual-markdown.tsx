import {createElement, Fragment, useMemo} from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {rehypeListItemParagraphToDiv} from "@/lib/rehype-utils";
import {rehypeComponents} from "@/lib/rehype-components";

export function useVirtualMarkdown(raw: string) {
    const chunks = useMemo(() => {
        const parts = raw.split(/```(.*?)\n([\s\S]*?)```/g);
        const result = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 3 === 0) {
                if (parts[i]) {
                    result.push(...parts[i].split("\n\n"));
                }
            } else if (i % 3 === 1) {
                const nextPart = parts[i + 1] || "";
                result.push("```" + parts[i] + "\n" + nextPart + "```");
                i++;
            }
        }

        return result;
    }, [raw]);

    const processor = useMemo(
        () =>
            unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkRehype)
                .use(rehypeHighlight, {ignoreMissing: true})
                .use(rehypeListItemParagraphToDiv)
                .use(rehypeReact, {
                    createElement,
                    Fragment,
                    components: rehypeComponents,
                }),
        []
    );

    return useMemo(
        () => chunks.map((c, i) => <Fragment key={i}>{processor.processSync(c).result}</Fragment>),
        [chunks, processor]
    );
}