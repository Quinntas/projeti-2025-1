"use client";

import {MARKDOWN_TEST_MESSAGE, useMarkdownProcessor,} from "@/hooks/use-markdown-processor";
import {Separator} from "@/components/ui/separator";

export default function Chat() {
    const content = useMarkdownProcessor(MARKDOWN_TEST_MESSAGE);

    return (
        <div className="px-2 lg:px-8 pb-8">
            <div className="max-w-2xl w-full mx-auto flex flex-col gap-[10px]">
                <h1 className="font-sans text-2xl font-semibold mb-4 mt-8">
                    Supported Markdown
                </h1>

                <p className="font-sans text-base">
                    Below is the markdown that is supported in the LLM responses.
                </p>

                <Separator className={"my-5"}/>

                <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {content}
                </div>
            </div>
        </div>
    );
}
