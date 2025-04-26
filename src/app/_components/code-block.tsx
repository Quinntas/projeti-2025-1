import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {InfoIcon} from 'lucide-react';
import React, {RefObject, useRef, useState} from 'react';

export type CodeBarProps = {
    lang: string;
    error?: boolean;
    plugin?: boolean;
    blockIndex?: number;
    allowExecution?: boolean;
    codeRef: RefObject<HTMLElement | null>;
};

type CodeBlockProps = Pick<
    CodeBarProps,
    'lang' | 'plugin' | 'error' | 'allowExecution' | 'blockIndex'
> & {
    codeChildren: React.ReactNode;
    classProp?: string;
};

const CodeBar: React.FC<CodeBarProps> = React.memo(
    ({lang, plugin = null}) => {
        const [isCopied, setIsCopied] = useState(false);
        return (
            <div
                className="relative flex items-center justify-between rounded-tl-md rounded-tr-md bg-muted px-4 py-2 ">
                <span className="">{lang}</span>
                {plugin === true ? (
                    <InfoIcon className="ml-auto flex h-4 w-4 gap-2 "/>
                ) : (
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            size={"sm"}
                            variant={"ghost"}
                            className={"cursor-pointer"}
                            onClick={() => {
                                setIsCopied(!isCopied);
                            }}
                        >
                            {isCopied ? <span>Copied!</span> : <span>Copy</span>}
                        </Button>
                    </div>
                )}
            </div>
        );
    },
);

const CodeBlock: React.FC<CodeBlockProps> = ({
                                                 lang,
                                                 blockIndex,
                                                 codeChildren,
                                                 classProp = '',
                                                 plugin = null,
                                                 error,
                                             }) => {
    const codeRef = useRef<HTMLElement | null>(null);

    const isNonCode = (plugin === true || error === true);
    const language = isNonCode ? 'json' : lang;

    return (
        <div className="w-full rounded-md border text-xs">
            <CodeBar
                lang={lang}
                error={error}
                codeRef={codeRef}
                blockIndex={blockIndex}
                plugin={plugin === true}
            />
            <div className={cn(classProp, 'overflow-y-auto p-4')}>
                <code
                    ref={codeRef}
                    className={cn(
                        isNonCode ? '!whitespace-pre-wrap' : `hljs language-${language} !whitespace-pre`,
                    )}
                >
                    {codeChildren}
                </code>
            </div>
        </div>
    );
};

export default CodeBlock;