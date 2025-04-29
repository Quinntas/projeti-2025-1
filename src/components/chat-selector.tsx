"use client"

import {useLocalChat} from "@/hooks/use-local-chat";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface ChatSelectorProps {
    id: string
}

export function ChatSelector(props: ChatSelectorProps) {
    const {chats} = useLocalChat(props.id)

    return <div className={"absolute w-[200px] p-2 flex flex-col gap-2"}>
        <span>History</span>

        {chats.map((chat, index) => {
            return <div key={`${chat.id}-${index}`} className={"w-full"}>
                <Button variant={"outline"} className={"w-full"} asChild>
                    <Link href={`/${chat.id}`}>
                        {chat.title}
                    </Link>
                </Button>
            </div>
        })}
    </div>
}