"use client"

import {Message} from "ai";
import {createContext, useContext} from "react";
import {useLocalStorage} from "@/hooks/use-local-storage";

interface Chats {
    [key: string]: {
        messages: Message[]
        title: string
    }
}

interface LocalChatContext {
    chats: Chats,
    setChats: (chats: Chats) => void,
}

export const localChatContext = createContext<LocalChatContext | null>(null);

export function LocalChatProvider({children}: { children: React.ReactNode }) {
    const [localChats, setLocalChats] = useLocalStorage<Chats>("local-chats", {});

    return <localChatContext.Provider value={{chats: localChats, setChats: setLocalChats}}>
        {children}
    </localChatContext.Provider>
}

export function useLocalChat(id: string) {
    const ctx = useContext(localChatContext);

    if (!ctx) throw new Error("useLocalChat must be used within a LocalChatProvider");

    function getChat(id: string) {
        const chat = ctx!.chats[id]
        if (!chat) return null
        return chat;
    }

    function getOrCreateChat(id: string) {
        const chat = getChat(id);
        if (!chat)
            return {
                messages: [],
                title: "Placeholder Title"
            }
        return chat
    }

    function replaceMessages(id: string, messages: Message[]) {
        if (messages.length === 0) return;
        const chat = getOrCreateChat(id);
        ctx!.setChats({
            ...ctx!.chats,
            [id]: {
                ...chat,
                messages
            }
        });
    }

    function getMessages(id: string) {
        const chat = getChat(id);
        if (!chat) return [];
        return chat.messages;
    }

    function addMessage(id: string, message: Message) {
        const chat = getOrCreateChat(id);
        ctx!.setChats({
            ...ctx!.chats,
            [id]: {
                ...chat,
                messages: [...chat.messages, message]
            }
        });
    }

    function getChats() {
        return Object.keys(ctx!.chats).map(id => {
            return {
                id,
                title: ctx!.chats[id].title,
            }
        });
    }

    return {
        messages: getMessages(id),
        chats: getChats(),
        replaceMessages,
        addMessage
    }
}