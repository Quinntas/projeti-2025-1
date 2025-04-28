"use client";

import {createElement, Fragment, useMemo,} from "react";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {unified} from "unified";
import {rehypeListItemParagraphToDiv} from "@/lib/rehype-utils";
import {rehypeComponents} from "@/lib/rehype-components";

export const ANCHOR_CLASS_NAME =
    "font-semibold underline underline-offset-[2px] decoration-1 hover:text-zinc-300 transition-colors";

export const useMarkdownProcessor = (content: string) => {
    return useMemo(() => {
        return unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeHighlight, {ignoreMissing: true})
            .use(rehypeListItemParagraphToDiv)
            .use(rehypeReact, {
                createElement,
                Fragment,
                components: rehypeComponents
            })
            .processSync(content).result;
    }, [content]);
};
