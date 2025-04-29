import {Chat} from "@/components/chat";
import {v4} from "uuid";

export default function Home() {
    return <Chat id={v4()}/>
}