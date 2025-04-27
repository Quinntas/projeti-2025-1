import {Root} from "hast";
import mermaid from "mermaid";
import Link from "next/link";
import React, {Children, createElement, Fragment, isValidElement, useEffect, useMemo, useRef, useState,} from "react";
import flattenChildren from "react-keyed-flatten-children";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {Plugin, unified} from "unified";
import {visit} from "unist-util-visit";
// @ts-expect-error
import {HtmlGenerator, parse} from "latex.js";
import {Button} from "@/components/ui/button";
import {Check, Copy, RefreshCcw} from "lucide-react";
import dedent from "dedent";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {toast} from "sonner";
import {prismTheme} from "@/lib/prism-theme";

export const ANCHOR_CLASS_NAME =
    "font-semibold underline underline-offset-[2px] decoration-1 hover:text-zinc-300 transition-colors";

const rehypeListItemParagraphToDiv: Plugin<[], Root> = () => {
    return (tree: any) => {
        visit(tree, "element", (element) => {
            if (element.tagName === "li") {
                element.children = element.children.map((child: any) => {
                    if (child.type === "element" && child.tagName === "p") {
                        child.tagName = "div";
                    }
                    return child;
                });
            }
        });
        return tree;
    };
};

export const useMarkdownProcessor = (content: string) => {
    useEffect(() => {
        mermaid.initialize({startOnLoad: false, theme: "forest"});
    }, []);

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
                components: {
                    a: ({href, children}: JSX.IntrinsicElements["a"]) => (
                        <Link
                            href={href ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className={ANCHOR_CLASS_NAME}
                        >
                            {children}
                        </Link>
                    ),
                    h1: ({children, id}: JSX.IntrinsicElements["h1"]) => (
                        <h1
                            className="font-sans font-semibold text-2xl  mb-6 mt-6"
                            id={id}
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({children, id}: JSX.IntrinsicElements["h2"]) => (
                        <h2
                            className="font-sans font-medium text-2xl  mb-6 mt-6"
                            id={id}
                        >
                            {children}
                        </h2>
                    ),
                    h3: ({children, id}: JSX.IntrinsicElements["h3"]) => (
                        <h3
                            className="font-sans font-semibold text-xl  mb-6 mt-2"
                            id={id}
                        >
                            {children}
                        </h3>
                    ),
                    h4: ({children, id}: JSX.IntrinsicElements["h4"]) => (
                        <h4
                            className="font-sans font-medium text-xl  my-6"
                            id={id}
                        >
                            {children}
                        </h4>
                    ),
                    h5: ({children, id}: JSX.IntrinsicElements["h5"]) => (
                        <h5
                            className="font-sans font-semibold text-lg  my-6"
                            id={id}
                        >
                            {children}
                        </h5>
                    ),
                    h6: ({children, id}: JSX.IntrinsicElements["h6"]) => (
                        <h6
                            className="font-sans font-medium text-lg  my-6"
                            id={id}
                        >
                            {children}
                        </h6>
                    ),
                    p: (props: JSX.IntrinsicElements["p"]) => {
                        return (
                            <p className="font-sans text-sm  mb-6">
                                {props.children}
                            </p>
                        );
                    },
                    strong: ({children}: JSX.IntrinsicElements["strong"]) => (
                        <strong className=" font-semibold">
                            {children}
                        </strong>
                    ),
                    em: ({children}: JSX.IntrinsicElements["em"]) => (
                        <em>{children}</em>
                    ),
                    code: CodeBlock,
                    pre: ({children}: JSX.IntrinsicElements["pre"]) => {
                        return <>
                            <div className="relative mb-6">
                                <pre
                                    className="p-4 rounded-lg border-2  [&>code.hljs]:p-0 [&>code.hljs]:bg-transparent font-code text-sm overflow-x-auto flex items-start">
                                  {children}
                                </pre>
                            </div>
                        </>
                    },
                    ul: ({children}: JSX.IntrinsicElements["ul"]) => (
                        <ul className="flex flex-col gap-3  my-6 pl-3 [&_ol]:my-3 [&_ul]:my-3">
                            {Children.map(
                                flattenChildren(children).filter(isValidElement),
                                (child, index) => (
                                    <li key={index} className="flex gap-2 items-start">
                                        <div className="w-1 h-1 rounded-full bg-current block shrink-0 mt-1"/>
                                        {child}
                                    </li>
                                )
                            )}
                        </ul>
                    ),
                    ol: ({children}: JSX.IntrinsicElements["ol"]) => (
                        <ol className="flex flex-col gap-3  my-6 pl-3 [&_ol]:my-3 [&_ul]:my-3">
                            {Children.map(
                                flattenChildren(children).filter(isValidElement),
                                (child, index) => (
                                    <li key={index} className="flex gap-2 items-start">
                                        <div
                                            className="font-sans text-sm  font-semibold shrink-0 min-w-[1.4ch]"
                                            aria-hidden
                                        >
                                            {index + 1}.
                                        </div>
                                        {child}
                                    </li>
                                )
                            )}
                        </ol>
                    ),
                    li: ({children}: JSX.IntrinsicElements["li"]) => (
                        <div className="font-sans text-sm">{children}</div>
                    ),
                    table: ({children}: JSX.IntrinsicElements["table"]) => (
                        <div className="overflow-x-auto mb-6">
                            <table className="table-auto border-2 ">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({children}: JSX.IntrinsicElements["thead"]) => (
                        <thead className="">{children}</thead>
                    ),
                    th: ({children}: JSX.IntrinsicElements["th"]) => (
                        <th className="border-2  p-2 font-sans text-sm font-semibold ">
                            {children}
                        </th>
                    ),
                    td: ({children}: JSX.IntrinsicElements["td"]) => (
                        <td className="border-2  p-2 font-sans text-sm ">
                            {children}
                        </td>
                    ),
                    blockquote: ({children}: JSX.IntrinsicElements["blockquote"]) => (
                        <blockquote className="border-l-4 pl-2 pt-2 italic">
                            {children}
                        </blockquote>
                    ),
                },
            })
            .processSync(content).result;
    }, [content]);
};

const extractText = (node: React.ReactNode): string => {
    if (node === null || node === undefined) return "";
    if (typeof node === "string" || typeof node === "number") {
        return node.toString();
    }
    if (Array.isArray(node)) {
        return node.map(child => extractText(child)).join("");
    }
    if (React.isValidElement(node)) {
        return extractText(node.props.children);
    }
    return "";
};


const CodeBlock = ({children, className}: JSX.IntrinsicElements["code"]) => {
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (copied) {
            const interval = setTimeout(() => setCopied(false), 1000);
            return () => clearTimeout(interval);
        }
    }, [copied]);

    if (className) {
        const language: 'mermaid' | 'latex' | (string & {}) = className.split("-")[1];

        const CONTENT: Record<string, JSX.Element> = {
            mermaid: <Mermaid content={children?.toString() || ""}/>,
            latex: <Latex content={children?.toString() ?? ""}/>
        }

        return (
            <>
                <code ref={ref} className={`${className} flex-grow flex-shrink my-auto`}>
                    {
                        CONTENT[language] ??
                        <SyntaxHighlighter style={prismTheme} language={language}>
                            {extractText(children)}
                        </SyntaxHighlighter>
                    }
                </code>
                <div className="flex absolute top-[10px] group right-[10px] flex-col gap-1 flex-grow-0 flex-shrink-0 ">
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        aria-label="copy to clipboard"
                        title="Copy to clipboard"
                        className={"invisible group-hover:visible"}
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
                        {copied ? (
                            <Check className="w-4 h-4"/>
                        ) : (
                            <Copy className="w-4 h-4"/>
                        )}
                    </Button>
                </div>
            </>
        );
    }

    return (
        <code className="inline-block font-code  p-0.5 -my-0.5 rounded">
            {children}
        </code>
    );
};

const Latex = ({content}: { content: string }) => {
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

const Mermaid = ({content}: { content: string }) => {
    const [diagram, setDiagram] = useState<string | boolean>(true);

    useEffect(() => {
        const render = async () => {
            const id = `mermaid-svg-${Math.round(Math.random() * 10000000)}`;

            if (await mermaid.parse(content, {suppressErrors: true})) {
                const {svg} = await mermaid.render(id, content);
                setDiagram(svg);
            } else {
                setDiagram(false);
            }
        };
        render();
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
            <div className="font-sans flex items-center justify-center text-sm h-[60px]">
                <p>
                    Unable to render this diagram. Try copying it into the{" "}
                    <Link
                        href="https://mermaid.live/edit"
                        className={ANCHOR_CLASS_NAME}
                        target="_blank"
                    >
                        Mermaid Live Editor
                    </Link>
                    .
                </p>
            </div>
        );
    } else {
        return <div dangerouslySetInnerHTML={{__html: diagram ?? ""}}/>;
    }
};

export const MARKDOWN_TEST_MESSAGE = dedent`
# Heading level 1

This is the first paragraph.

This is the second paragraph.

This is the third paragraph.

## Heading level 2

This is an [anchor](https://github.com).

### Heading level 3

This is **bold** and _italics_.

#### Heading level 4

This is \`inline\` code.

This is a code block:

\`\`\`tsx
const Message = () => {
  return <div>hi</div>;
};
\`\`\`

\`\`\`python
def add(a, b):
    return a + b

print(add(1, 2)) # 3
\`\`\`

##### Heading level 5

This is an unordered list:

- One
- Two
- Three, and **bold**

This is an ordered list:

1. One
1. Two
1. Three

This is a complex list:

1. **Bold**: One
    - One
    - Two
    - Three
  
2. **Bold**: Three
    - One
    - Two
    - Three
  
3. **Bold**: Four
    - One
    - Two
    - Three

###### Heading level 6

> This is a blockquote.

This is a table:

| Vegetable | Description |
|-----------|-------------|
| Carrot    | A crunchy, orange root vegetable that is rich in vitamins and minerals. It is commonly used in soups, salads, and as a snack. |
| Broccoli  | A green vegetable with tightly packed florets that is high in fiber, vitamins, and antioxidants. It can be steamed, boiled, stir-fried, or roasted. |
| Spinach   | A leafy green vegetable that is dense in nutrients like iron, calcium, and vitamins. It can be eaten raw in salads or cooked in various dishes. |
| Bell Pepper | A colorful, sweet vegetable available in different colors such as red, yellow, and green. It is often used in stir-fries, salads, or stuffed recipes. |
| Tomato    | A juicy fruit often used as a vegetable in culinary preparations. It comes in various shapes, sizes, and colors and is used in salads, sauces, and sandwiches. |
| Cucumber   | A cool and refreshing vegetable with a high water content. It is commonly used in salads, sandwiches, or as a crunchy snack. |
| Zucchini | A summer squash with a mild flavor and tender texture. It can be sautéed, grilled, roasted, or used in baking recipes. |
| Cauliflower | A versatile vegetable that can be roasted, steamed, mashed, or used to make gluten-free alternatives like cauliflower rice or pizza crust. |
| Green Beans | Long, slender pods that are low in calories and rich in vitamins. They can be steamed, stir-fried, or used in casseroles and salads. |
| Potato | A starchy vegetable available in various varieties. It can be boiled, baked, mashed, or used in soups, fries, and many other dishes. |

This is a mermaid diagram:

\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
\`\`\`

This is a LaTeX equation:

\`\`\`latex
\[ F = \frac{{G \cdot m_1 \cdot m_2}}{{r^2}} \]
\`\`\`

\`\`\`latex
\[ L[f(t)] = \int_0^{\infty} e^{-st} f(t) dt \]
\`\`\`

\`\`\`latex
\[F(x) = \int_{a}^{b} f(x) \, dx\]
\`\`\``;
