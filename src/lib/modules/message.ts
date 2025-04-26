import {GenerateContentResponse} from "@google/genai";

export type Message = {
    id: string
} & ({
    role: "user";
    content: string;
} | {
    role: "assistant";
    content: AsyncGenerator<GenerateContentResponse>;
})