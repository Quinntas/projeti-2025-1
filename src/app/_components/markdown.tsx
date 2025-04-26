import {memo, useMemo} from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import supersub from 'remark-supersub';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type {Pluggable} from 'unified';
import CodeBlock from "@/app/_components/code-block";
import {preprocessLaTeX} from "@/utils/latex";
import remarkDirective from 'remark-directive';

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

    if (lang === 'math' || lang === 'latex') {
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


const Markdown = memo(
    ({content = ''}: { content?: string }) => {
        const isInitializing = content === '';

        const currentContent = useMemo(() => {
            if (isInitializing) return '';
            return preprocessLaTeX(content);
        }, [content, isInitializing]);

        const rehypePlugins = useMemo(
            () => [
                [rehypeKatex, {output: 'mathml'}],
                [
                    rehypeHighlight,
                    {
                        detect: true,
                        ignoreMissing: true,
                        subset: langSubset,
                    },
                ],
            ],
            [],
        );

        const remarkPlugins: Pluggable[] = useMemo(
            () => [
                supersub,
                remarkGfm,
                remarkDirective,
                [remarkMath, {singleDollarTextMath: true}],
            ],
            [],
        );

        return (
            <ReactMarkdown
                /** @ts-ignore */
                remarkPlugins={remarkPlugins}
                /** @ts-ignore */
                rehypePlugins={rehypePlugins}
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
                {currentContent}
            </ReactMarkdown>
        );
    },
);

export default Markdown;