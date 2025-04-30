"use client"

import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import {useLocalChat} from "@/hooks/use-local-chat";
import Link from "next/link";
import {NotebookPen} from "lucide-react";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {chats} = useLocalChat("")
    const {state} = useSidebar()

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className={"flex items-center justify-between"}>
                    <SidebarTrigger
                        className={cn(state === "expanded" ? "block" : "hidden")}
                    />

                    <Tooltip>
                        <TooltipTrigger>
                            <Link href={"/"}>
                                <NotebookPen className={"w-5 h-5"}/>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            New Chat
                        </TooltipContent>
                    </Tooltip>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>History</SidebarGroupLabel>
                    {chats.map((chat) => (
                        <SidebarGroupContent key={`side-bar-chat-${chat.id}`}>
                            <SidebarMenu>
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`/${chat.id}`}>
                                            {chat.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                asd
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
