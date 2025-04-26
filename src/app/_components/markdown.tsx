import {memo} from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import supersub from 'remark-supersub';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type {PluggableList} from 'unified';
import {ArtifactProvider} from "@/app/_components/artifact-provider";
import {CodeBlockProvider} from "@/app/_components/codeblock-provider";
import CodeBlock from "@/app/_components/code-block";

export const langSubset = [
    'python',
    'javascript',
    'java',
    'go',
    'bash',
    'c',
    'cpp',
    'csharp',
    'css',
    'diff',
    'graphql',
    'json',
    'kotlin',
    'less',
    'lua',
    'makefile',
    'markdown',
    'objectivec',
    'perl',
    'php',
    'php-template',
    'plaintext',
    'python-repl',
    'r',
    'ruby',
    'rust',
    'scss',
    'shell',
    'sql',
    'swift',
    'typescript',
    'vbnet',
    'wasm',
    'xml',
    'yaml',
];


type TCodeProps = {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
};

export const codeNoExecution: React.ElementType = memo(({className, children}: TCodeProps) => {
    const match = /language-(\w+)/.exec(className ?? '');
    const lang = match && match[1];

    if (lang === 'math') {
        return children;
    } else if (typeof children === 'string' && children.split('\n').length === 1) {
        return (
            <code className={className}>
                {children}
            </code>
        );
    } else {
        return <CodeBlock lang={lang ?? 'text'} codeChildren={children} allowExecution={false}/>;
    }
});


type TAnchorProps = {
    href: string;
    children: React.ReactNode;
};

export const a: React.ElementType = memo(({href, children}: TAnchorProps) => {
    return (
        <a
            href={href}
            target={"_blank"}
        >
            {children}
        </a>
    );
});

type TParagraphProps = {
    children: React.ReactNode;
};

export const p: React.ElementType = memo(({children}: TParagraphProps) => {
    return <p className="mb-2 whitespace-pre-wrap">{children}</p>;
});

const MarkdownLite = memo(
    ({content = ''}: { content?: string; codeExecution?: boolean }) => {
        const rehypePlugins: PluggableList = [
            [rehypeKatex, {output: 'mathml'}],
            [
                rehypeHighlight,
                {
                    detect: true,
                    ignoreMissing: true,
                    subset: langSubset,
                },
            ],
        ];

        return (
            <ArtifactProvider>
                <CodeBlockProvider>
                    <ReactMarkdown
                        remarkPlugins={[
                            /** @ts-ignore */
                            supersub,
                            remarkGfm,
                            [remarkMath, {singleDollarTextMath: true}],
                        ]}
                        /** @ts-ignore */
                        rehypePlugins={rehypePlugins}
                        // linkTarget="_new"
                        components={
                            {
                                code: codeNoExecution,
                                a,
                                p,
                            } as {
                                [nodeType: string]: React.ElementType;
                            }
                        }
                    >
                        {content}
                    </ReactMarkdown>
                </CodeBlockProvider>
            </ArtifactProvider>
        );
    },
);

export default MarkdownLite;