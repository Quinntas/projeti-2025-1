"use client";

import {useEffect, useRef, useState} from "react";
import {ArrowUp, Ban, ChevronDown, Key, Paperclip, Search, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipTrigger,} from "@/components/ui/tooltip";
import {Toggle} from "@/components/ui/toggle";
import {cn} from "@/lib/utils";
import {MessageList} from "@/components/message-list";
import {useLocalStorage} from "@/hooks/use-local-storage";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {EmptyMessage} from "@/components/empty-message";
import {useChat} from "@ai-sdk/react";
import {useLocalChat} from "@/hooks/use-local-chat";
import {Message} from "ai";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar";

const SUPPORTED_MODELS = [
    "o4-mini",
    "o3",
    "o3-mini",
    "gpt-4o"
] as const;

type SupportedModels = typeof SUPPORTED_MODELS[number];

interface ChatProps {
    id: string
}

export function Chat(props: ChatProps) {
    const {messages: initialMessages, addMessage, replaceMessages} = useLocalChat(props.id)
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
    const [token, setToken] = useLocalStorage<string | null>("ai-token", null);
    const [model, setModel] = useLocalStorage<SupportedModels>("ai-model", SUPPORTED_MODELS[0]);
    const [uploadedFiles, setUploadedFiles] = useState<FileList | undefined>(undefined);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {state} = useSidebar()

    const {messages, input, stop, status, handleInputChange, handleSubmit: aiHandleSubmit, error} = useChat({
        body: {token, model, isSearchActive},
        id: props.id,
        initialMessages,
        onFinish: (m) => {
            const msgs = messages as Message[]
            msgs[msgs.length - 1] = m
            replaceMessages(props.id, msgs)
        }
    });

    if (error) console.error(error);

    useEffect(() => {
        replaceMessages(props.id, messages)
    }, [messages.length]);

    const isLoading = status === "streaming" || status === 'submitted';
    const isThinking = Math.abs(messages.length % 2) == 1 && isLoading;
    const isReady = status === "ready" && input.trim();

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) setUploadedFiles(files);
    };

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Please configure your API key");
            setApiKeyDialogOpen(true);
            return;
        }

        if (input.trim() || !uploadedFiles) {
            aiHandleSubmit(e, {
                experimental_attachments: uploadedFiles
            });
            setUploadedFiles(undefined);
            setIsSearchActive(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && isReady) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <>
            <header className={"w-full p-1 fixed top-0 bg-transparent z-20"}>
                <SidebarTrigger
                    className={cn(state === "expanded" ? "opacity-0 invisible" : "opacity-100 visible")}/>
            </header>

            <div className="min-h-screen overflow-y-scroll w-full">
                <div
                    className="mx-auto w-full px-2 lg:px-8 relative pb-8 flex flex-col items-center justify-center stretch gap-8 flex-1">

                    {messages.length > 0 ?
                        <MessageList isLoading={isLoading} messages={messages} isThinking={isThinking}/> :
                        <EmptyMessage/>}

                    <div className={"w-full flex items-center justify-center fixed bottom-5"}>
                        <div
                            className="w-[95%] sm:w-[810px] ">
                            {error ? (
                                <div className="p-3 rounded-lg bg-rose-100 border-2 border-rose-200 mb-3">
                                    <p className="font-sans text-sm text-red text-rose-800">
                                        {error.message}
                                    </p>
                                </div>
                            ) : null}

                            {uploadedFiles &&
                                <div className={"flex flex-row flex-wrap gap-3 items-end justify-start my-3 mx-4"}>
                                    {Array.from(uploadedFiles).map((file, index) => (
                                        <div
                                            key={`file-preview-${index}`}
                                            className={"relative"}
                                        >
                                            <Button
                                                variant={"destructive"}
                                                size={"icon"}
                                                onClick={() => {
                                                    const newFiles = Array.from(uploadedFiles || []).filter((_, i) => i !== index);
                                                    const dt = new DataTransfer();
                                                    newFiles.forEach(file => dt.items.add(file));
                                                    setUploadedFiles(dt.files);
                                                }}
                                                className={"rounded-full w-6 h-6 absolute -top-2 -right-2"}
                                            >
                                                <X className={"w-4 h-4"}/>
                                            </Button>

                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-[150px]"
                                            />
                                        </div>
                                    ))}
                                </div>}


                            <div className="bg-card rounded-2xl p-3 shadow-lg border">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    <div className="relative w-full">
                                    <textarea
                                        placeholder="Ask a question..."
                                        data-slot="input"
                                        value={input}
                                        rows={1}
                                        className="p-1 w-full bg-transparent focus:ring-0 focus:outline-none placeholder:text-muted-foreground resize-none overflow-hidden min-h-[24px] max-h-[144px]"
                                        onChange={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px`;
                                            handleInputChange(e);
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            multiple
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleFileUpload}
                                                        type="button"
                                                    >
                                                        <Paperclip className="h-5 w-5"/>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Upload file</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setApiKeyDialogOpen(true)}
                                                        type="button"
                                                    >
                                                        <Key className="h-5 w-5"/>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Configure API Key</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Toggle
                                                        pressed={isSearchActive}
                                                        onPressedChange={toggleSearch}
                                                        className="rounded-full py-1.5 px-3 flex items-center gap-1.5 text-sm h-auto"
                                                    >
                                                        <Search className="h-4 w-4"/>
                                                        <span>Search</span>
                                                    </Toggle>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Search for messages using google
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm"
                                                            className="flex items-center gap-1">
                                                        <span>{model}</span>
                                                        <ChevronDown className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {SUPPORTED_MODELS.map((m) => (
                                                        <DropdownMenuItem
                                                            key={m}
                                                            onClick={() => setModel(m)}
                                                            className={cn(
                                                                m === model && "bg-accent"
                                                            )}
                                                        >
                                                            {m}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {isLoading ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            disabled={!isLoading}
                                                            onClick={stop}
                                                            variant={!isLoading ? "ghost" : "default"}
                                                            className="rounded-full"
                                                        >
                                                            <Ban className="h-5 w-5"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Stop generating</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            type="submit"
                                                            disabled={!isReady}
                                                            variant={!isReady ? "ghost" : "default"}
                                                            className="rounded-full"
                                                        >
                                                            <ArrowUp className="h-5 w-5"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Send message</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>API Key</DialogTitle>
                        <DialogDescription>
                            Enter your OpenAI API key to use the chat functionality.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={token || ""}
                        type="password"
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="********"
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}