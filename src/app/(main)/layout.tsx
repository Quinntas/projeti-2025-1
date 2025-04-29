import {ChatSelector} from "@/components/chat-selector";

export default function MainLayout({children}: { children: React.ReactNode }) {
    return <div className={"flex"}>
        <ChatSelector id={""}/>
        {children}
    </div>
}