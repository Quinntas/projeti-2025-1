import {Message} from "ai/react";
import {UserMessage} from "./user-message";
import {AssistantMessage} from "./assistant-message";

interface Props {
    message: Message;
    isLoading: boolean
}

export default function Message({message, isLoading}: Props) {
    switch (message.role) {
        case "user":
            return <UserMessage>{message.content}</UserMessage>;
        case "assistant":
            return <AssistantMessage isLoading={isLoading}>{message.content}</AssistantMessage>;
        default:
            throw new Error(`Unknown message role: ${message.role}`);
    }
}
