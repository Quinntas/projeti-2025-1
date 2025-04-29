import {Chat} from "@/components/chat";

export default async function ChatWithId({
                                             params,
                                         }: {
    params: Promise<{ id: string }>
}) {
    const searchParams = await params;

    return <Chat id={searchParams.id}/>
}