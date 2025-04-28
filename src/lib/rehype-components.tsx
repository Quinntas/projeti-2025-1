import Link from "next/link";
import {CodeBlock} from "@/components/code-block";
import React, {Children, isValidElement} from "react";
import flattenChildren from "react-keyed-flatten-children";
import {ANCHOR_CLASS_NAME} from "@/hooks/use-markdown-processor";

export const rehypeComponents = {
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
            <p className="font-sans text-sm mb-6">
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
        return <div className="relative my-2">
                                <pre
                                    className="p-4  rounded-lg border-2 [&>code.hljs]:p-0 [&>code.hljs]:bg-transparent font-code text-sm overflow-x-auto flex items-start">
                                  {children}
                                </pre>
        </div>
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
        <blockquote className="border-l-4 pl-2 pt-2 mb-4 italic">
            {children}
        </blockquote>
    ),
}