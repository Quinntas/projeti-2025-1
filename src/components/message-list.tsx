import {AnimatePresence} from "framer-motion";
import Message from "./message";
import {Message as MessageType} from "ai/react";

interface Props {
    messages: MessageType[];
}

export const MessageList = ({messages}: Props) => {
    return (
        <ul className="grid auto-rows-min pb-28 flex-1 mx-auto w-[800px]">
            <AnimatePresence mode="wait">
                {messages.map((m) => (
                    <Message key={m.id} message={m}/>
                ))}
            </AnimatePresence>
        </ul>
    );
};
