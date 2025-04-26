"use client"

import {useChat} from "@/app/_components/hooks/use-chat";
import {ChatInput} from "@/app/_components/chat-input";
import {ChatMessage} from "./chat-message";
import {useEffect, useState} from "react";


export function Chat() {
    const [apiKey, setApiKey] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("apiKey") || ""
        }
        return ""
    })

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem("apiKey", apiKey)
        }
    }, [apiKey])

    const {messages, sendMessage} = useChat({
        apiKey
    })

    function handleSubmit(text: string, files: File[], useSearch: boolean) {
        sendMessage(text)
    }

    return <>
        <div className={"flex flex-col gap-[10px] items-center"}>
            <div className={"overflow-y-auto pb-[170px] pt-[50px] flex flex-col gap-[20px] h-full w-[800px]"}>
                {messages.map((message, index) =>
                    <ChatMessage key={`chat-message-${index}`} message={message}/>)}
            </div>

            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
                <ChatInput
                    handleSubmit={handleSubmit}
                    apiKey={apiKey}
                    onApiKeySave={setApiKey}
                />
            </div>

        </div>
    </>
}