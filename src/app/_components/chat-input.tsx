"use client"

import {useRef, useState} from "react"
import {ArrowUp, ChevronDown, Paperclip, Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import {Toggle} from "@/components/ui/toggle"
import {cn} from "@/lib/utils"

const models = [
    "gemini-1.5-pro",
    "gemini-2.5-flash-preview-04-17",
    "gemini-2.5-pro-preview-03-25",
]

interface ChatInputProps {
    handleSubmit: (text: string, files: File[], useSearch: boolean) => void
}

export function ChatInput(props: ChatInputProps) {
    const [textInput, setTextInput] = useState("")
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [selectedModel, setSelectedModel] = useState(models[0])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setUploadedFiles(Array.from(files))
        }
    }

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive)
    }

    const handleSubmit = () => {
        if (textInput.trim() || uploadedFiles.length > 0) {
            props.handleSubmit(textInput, uploadedFiles, isSearchActive)
            setTextInput("")
            setUploadedFiles([])
            setIsSearchActive(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="w-[800px] mx-auto">
            <div className="bg-card rounded-2xl p-3 shadow-lg border">
                <div className="flex flex-col gap-3">
                    <div className="relative w-full">
                        <textarea
                            placeholder="Enter text here..."
                            data-slot="input"
                            value={textInput}
                            rows={1}
                            className="p-1 w-full bg-transparent focus:ring-0 focus:outline-none placeholder:text-muted-foreground resize-none overflow-hidden min-h-[24px] max-h-[144px]"
                            onChange={(e) => {
                                e.target.style.height = 'auto'
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px`
                                setTextInput(e.target.value)
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
                                        >
                                            <Paperclip className="h-5 w-5"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Upload file</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Toggle
                                pressed={isSearchActive}
                                onPressedChange={toggleSearch}
                                className="rounded-l-full rounded-r-none py-1.5 px-3 flex items-center gap-1.5 text-sm h-auto"
                            >
                                <Search className="h-4 w-4"/>
                                <span>Search</span>
                            </Toggle>
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                        <span>{selectedModel}</span>
                                        <ChevronDown className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {models.map((model) => (
                                        <DropdownMenuItem
                                            key={model}
                                            onClick={() => {
                                                setSelectedModel(model)
                                            }}
                                            className={cn(
                                                selectedModel === model && "bg-accent"
                                            )}
                                        >
                                            {model}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                size="icon"
                                onClick={handleSubmit}
                                disabled={!textInput.trim() && uploadedFiles.length === 0}
                                variant={!textInput.trim() && uploadedFiles.length === 0 ? "ghost" : "default"}
                                className="rounded-full"
                            >
                                <ArrowUp className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}