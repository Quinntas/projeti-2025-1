import {Chat} from "@/app/_components/chat";
import {env} from "@/utils/env";

export default function Home() {
    return <>
        <Chat apiKey={env.GEMINI_API_KEY}/>
    </>
}
