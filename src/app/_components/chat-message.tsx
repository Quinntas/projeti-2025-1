"use client"

import {useEffect, useState} from "react"
import {GenerateContentResponse} from "@google/genai"
import {Message} from "@/lib/modules/message"
import 'katex/dist/katex.min.css'
import MarkdownLite from "@/app/_components/markdown";

interface ChatMessageProps {
    message: Message
}

export function ChatMessage({message}: ChatMessageProps) {
    const [content, setContent] = useState<string>("")

    useEffect(() => {
        switch (message.role) {
            case "user": {
                setContent(message.content)
                break
            }
            case "assistant": {
                async function streamContent() {
                    for await (const chunk of message.content as AsyncGenerator<GenerateContentResponse>) {
                        setContent((prevState) => `${prevState}${chunk.text}`)
                    }
                }

                streamContent()
                break
            }
        }
    }, [message])

    return <>
        {message.role === "user" ? (
            <div className="w-full flex items-center justify-end ">
                <div className="rounded-lg bg-muted p-3 shadow-sm border">
                    <p className="whitespace-pre-wrap leading-6">{content}</p>
                </div>
            </div>
        ) : (
            <MarkdownLite content={content}/>
        )}
    </>
}
