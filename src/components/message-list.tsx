import Message from "./message";
import {UIMessage} from "ai";

interface Props {
    messages: UIMessage[];
    isThinking: boolean;
    isLoading: boolean
}

export const MessageList = ({messages, isThinking, isLoading}: Props) => {
    return (
        <ul className="grid auto-rows-min mb-28 mt-8 flex-1 mx-auto w-[90%] sm:w-[800px]">
            {messages.map((m) => {
                return <div key={m.id}>
                    {m.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return <Message key={`${m.id}-${i}`} message={m} isLoading={isLoading}/>
                        }
                    })}
                    <div className={"flex items-center justify-end flex-wrap gap-2 mt-2"}>
                        {m.experimental_attachments
                            ?.filter(attachment =>
                                attachment?.contentType?.startsWith('image/'),
                            )
                            .map((attachment, index) => (
                                <img
                                    key={`${m.id}-${index}-atach`}
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className={"w-[150px]"}
                                />
                            ))}
                    </div>
                </div>
            })}
            {isThinking && <span className="animate-pulse">Thinking...</span>}
        </ul>
    );
};
