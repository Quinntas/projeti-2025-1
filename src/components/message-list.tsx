import {UIMessage} from "ai";
import {UserMessage} from "@/components/user-message";
import {AssistantMessage} from "@/components/assistant-message";

interface Props {
    messages: UIMessage[];
    isThinking: boolean;
    isLoading: boolean
}

export const MessageList = ({messages, isThinking, isLoading}: Props) => {
    return (
        <ul className="grid auto-rows-min mb-[120px] mt-8 flex-1 mx-auto w-[90%] sm:w-[800px]">
            {messages.map((m) => {
                return <div key={m.id}>
                    {m.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                if (m.role === "user")
                                    return <UserMessage key={`${m.id}-${i}`}>
                                        {m.content}
                                    </UserMessage>;
                                else if (m.role === "assistant")
                                    return <AssistantMessage
                                        key={`${m.id}-${i}`}
                                        isLoading={isLoading}>
                                        {m.content}
                                    </AssistantMessage>
                        }
                    })}
                    <div className={"flex items-center justify-end flex-wrap gap-2 mt-2"}>
                        {m.experimental_attachments
                            ?.filter(attachment =>
                                attachment?.contentType?.startsWith('image/'),
                            )
                            .map((attachment, index) => (
                                <img
                                    key={`${m.id}-${index}-attach`}
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className={"w-[150px]"}
                                />
                            ))}
                    </div>
                </div>
            })}
            {isThinking && <span className="animate-pulse pt-2">Thinking...</span>}
        </ul>
    );
};
