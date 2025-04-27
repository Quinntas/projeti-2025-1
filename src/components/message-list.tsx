import Message from "./message";
import {Message as MessageType} from "ai/react";

interface Props {
    messages: MessageType[];
    isThinking: boolean;
    isLoading: boolean
}

export const MessageList = ({messages, isThinking, isLoading}: Props) => {
    return (
        <ul className="grid auto-rows-min pb-28 flex-1 mx-auto w-[800px]">
            {messages.map((m) => (
                <Message key={m.id} message={m} isLoading={isLoading}/>
            ))}
            {isThinking && <span className="animate-pulse">Thinking...</span>}
        </ul>
    );
};
