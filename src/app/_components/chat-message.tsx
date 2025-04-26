"use client"

import {useEffect, useState} from "react"
import {GenerateContentResponse} from "@google/genai"
import {Message} from "@/lib/modules/message"
import 'katex/dist/katex.min.css'
import Markdown from "@/app/_components/markdown";
import {AnimatePresence, motion} from "framer-motion"

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

    return (
        <AnimatePresence mode="wait">
            {message.role === "user" ? (
                <motion.div
                    className="w-full flex items-center justify-end"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.95}}
                    transition={{duration: 0.3}}
                >
                    <motion.div
                        className="rounded-lg bg-muted p-3 shadow-sm border"
                        initial={{scale: 0.95}}
                        animate={{scale: 1}}
                        transition={{type: "spring", stiffness: 300, damping: 30}}
                    >
                        <p className="whitespace-pre-wrap leading-6">{content}</p>
                    </motion.div>
                </motion.div>
            ) : (
                <Markdown content={content}/>
            )}
        </AnimatePresence>
    )
}