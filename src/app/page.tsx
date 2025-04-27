"use client";

import {useRef, useState} from "react";
import {ArrowUp, ChevronDown, Key, Paperclip, Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {Toggle} from "@/components/ui/toggle";
import {cn} from "@/lib/utils";
import {MessageList} from "@/components/message-list";
import {useLocalStorage} from "@/hooks/use-local-storage";
import {useChat} from "ai/react";
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

const SUPPORTED_MODELS = [
    "o4-mini",
    "o3",
    "o3-mini",
    "gpt-4o"
] as const;

type SupportedModels = typeof SUPPORTED_MODELS[number];

const parseError = (error: Error) => {
    try {
        return JSON.parse(error.message).error;
    } catch (e) {
        console.error(e);
        return error.message;
    }
};

export default function Chat() {
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
    const [token, setToken] = useLocalStorage<string | null>("ai-token", null);
    const [model, setModel] = useLocalStorage<SupportedModels>("ai-model", SUPPORTED_MODELS[0]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {messages, input, isLoading, handleInputChange, handleSubmit: aiHandleSubmit, error} = useChat({
        body: {token, model},
    });

    const isThinking = Math.abs(messages.length % 2) == 1 && isLoading;

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setUploadedFiles(Array.from(files));
        }
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

        if (input.trim() || uploadedFiles.length > 0) {
            // @ts-expect-error asd
            aiHandleSubmit(e);
            setUploadedFiles([]);
            setIsSearchActive(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <>
            <div className="flex flex-col-reverse h-screen overflow-y-scroll">
                <div
                    className="mx-auto w-full px-2 lg:px-8 pb-8 flex flex-col justify-between stretch gap-8 flex-1">

                    {messages.length > 0 ?
                        <MessageList isLoading={isLoading} messages={messages} isThinking={isThinking}/> :
                        <EmptyMessage/>}

                    <div className="w-[810px] mx-auto fixed bottom-5 left-1/2 transform -translate-x-1/2">
                        {error ? (
                            <div className="p-3 rounded-lg bg-rose-100 border-2 border-rose-200 mb-3">
                                <p className="font-sans text-sm text-red text-rose-800">
                                    {parseError(error)}
                                </p>
                            </div>
                        ) : null}
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
                                        <TooltipProvider>
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
                                        </TooltipProvider>

                                        <TooltipProvider>
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
                                        </TooltipProvider>

                                        <Toggle
                                            pressed={isSearchActive}
                                            onPressedChange={toggleSearch}
                                            className="rounded-full py-1.5 px-3 flex items-center gap-1.5 text-sm h-auto"
                                        >
                                            <Search className="h-4 w-4"/>
                                            <span>Search</span>
                                        </Toggle>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
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

                                        <Button
                                            size="icon"
                                            type="submit"
                                            disabled={!input.trim() && uploadedFiles.length === 0}
                                            variant={!input.trim() && uploadedFiles.length === 0 ? "ghost" : "default"}
                                            className="rounded-full"
                                        >
                                            <ArrowUp className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                </div>
                            </form>
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