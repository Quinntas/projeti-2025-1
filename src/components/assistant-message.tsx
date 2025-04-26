import {useMarkdownProcessor} from "@/hooks/use-markdown-processor";

interface Props {
    children: string;
}

export const AssistantMessage = ({children}: Props) => {
    const content = useMarkdownProcessor(children);

    return <>
        {content}
    </>
};
