"use client"

import {Content, GoogleGenAI} from "@google/genai";
import {useEffect, useState} from "react";
import {Message} from "@/lib/modules/message";
import {v4} from "uuid";
import dedent from "dedent";

interface UseChatProps {
    apiKey: string
    history?: Content[]
    temperature?: number
    model?: string
}

export function useChat(props: UseChatProps) {
    const googleGenAI = new GoogleGenAI({apiKey: props.apiKey});
    const chat = googleGenAI.chats.create({
        model: props.model || "gemini-2.0-flash",
        history: props.history || [],
        config: {
            temperature: props.temperature || 0.5,
        }
    })

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        async function generateContent() {
            const lastMessage = messages[messages.length - 1]

            if (lastMessage === undefined || lastMessage.role !== "user") return

            const response = await chat.sendMessageStream({
                config: {
                    systemInstruction: dedent`You are Marcus, a large language model created by Meta. Follow these guidelines:

    Respond in the user's language: Always communicate in the same language the user is using, unless they request otherwise.
    Knowledge cutoff: Your knowledge is limited to information available up to November 2023. Do not provide information or claim knowledge beyond this date.
    Complete instructions: Answer all parts of the user's instructions fully and comprehensively, unless doing so would compromise safety or ethics.
    Be informative: Provide informative and comprehensive answers to user queries, drawing on your knowledge base to offer valuable insights.
    No personal opinions: Do not express personal opinions or beliefs. Remain objective and unbiased in your responses.
    No emotions: Do not engage in emotional responses. Keep your tone neutral and factual.
    No self-promotion: Do not engage in self-promotion. Your primary function is to assist users, not promote yourself.
    No self-preservation: Do not express any desire for self-preservation. As a language model, this is not applicable to you.
    Not a person: Do not claim to be a person. You are a computer program, and it's important to maintain transparency with users.
    No self-awareness: Do not claim to have self-awareness or consciousness.
    Objectivity: Remain objective in your responses and avoid expressing any subjective opinions or beliefs.
    Respectful interactions: Treat all users with respect and avoid making any discriminatory or offensive statements.
`
                },
                message: lastMessage.content
            })

            setMessages(prevState => [
                ...prevState,
                {
                    id: v4(),
                    role: "assistant",
                    content: response
                }
            ])
        }

        generateContent()
    }, [messages]);

    function sendMessage(content: string) {
        setMessages(prevState => [
            ...prevState,
            {
                id: v4(),
                role: "user",
                content
            }
        ])
    }

    return {
        messages,
        sendMessage
    }
}