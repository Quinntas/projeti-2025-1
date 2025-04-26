"use client"

import type React from "react"
import {useRef, useState} from "react"
import {ArrowUp, ChevronDown, LightbulbIcon, Paperclip, Search} from "lucide-react"

export function ChatInput() {
    const [inputValue, setInputValue] = useState("")
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [isThinking, setIsThinking] = useState(false)
    const [selectedModel, setSelectedModel] = useState("Grok 3")
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            // Handle the file upload logic here
            console.log("File selected:", files[0].name)
            // You could add the file name to the input or show a preview
            setInputValue((prev) => prev + ` [File: ${files[0].name}]`)
        }
    }

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive)
        console.log("DeepSearch mode:", !isSearchActive ? "activated" : "deactivated")
    }

    const handleThink = () => {
        setIsThinking(true)
        console.log("Thinking...")
        // Simulate thinking process
        setTimeout(() => {
            setIsThinking(false)
            console.log("Thinking complete")
        }, 2000)
    }

    const toggleModelDropdown = () => {
        setIsModelDropdownOpen(!isModelDropdownOpen)
    }

    const selectModel = (model: string) => {
        setSelectedModel(model)
        setIsModelDropdownOpen(false)
        console.log("Selected model:", model)
    }

    const handleSubmit = () => {
        if (inputValue.trim()) {
            console.log("Submitting:", inputValue)
            // Here you would typically send the message to your API
            setInputValue("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="bg-[#1c1c1e] rounded-2xl p-3 shadow-lg">
                <div className="flex flex-col gap-3">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="How can Grok help?"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent text-gray-300 outline-none placeholder:text-gray-500 py-2 px-2"
                        />
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden"/>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={handleFileUpload}
                                    className="text-gray-400 hover:text-gray-300 p-2 rounded-full">
                                <Paperclip className="h-5 w-5"/>
                            </button>

                            <div className="flex items-center">
                                <button
                                    onClick={toggleSearch}
                                    className={`${isSearchActive ? "bg-[#3c3c3e]" : "bg-[#2c2c2e]"} text-gray-300 rounded-l-full py-1.5 px-3 flex items-center gap-1.5 text-sm`}
                                >
                                    <Search className="h-4 w-4"/>
                                    <span>DeepSearch</span>
                                </button>
                                <button
                                    className="bg-[#2c2c2e] text-gray-300 rounded-r-full py-1.5 px-2 border-l border-[#3c3c3e]">
                                    <ChevronDown className="h-4 w-4"/>
                                </button>
                            </div>

                            <button
                                onClick={handleThink}
                                className={`${isThinking ? "bg-[#3c3c3e]" : "bg-[#2c2c2e]"} text-gray-300 rounded-full py-1.5 px-3 flex items-center gap-1.5 text-sm`}
                            >
                                <LightbulbIcon className="h-4 w-4"/>
                                <span>{isThinking ? "Thinking..." : "Think"}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button onClick={toggleModelDropdown} className="text-gray-300 flex items-center gap-1">
                                    <span>{selectedModel}</span>
                                    <ChevronDown className="h-4 w-4"/>
                                </button>

                                {isModelDropdownOpen && (
                                    <div
                                        className="absolute bottom-full mb-1 right-0 bg-[#2c2c2e] rounded-lg shadow-lg overflow-hidden z-10">
                                        <div className="py-1">
                                            {["Grok 1", "Grok 2", "Grok 3", "Grok 4"].map((model) => (
                                                <button
                                                    key={model}
                                                    onClick={() => selectModel(model)}
                                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                                        selectedModel === model ? "bg-[#3c3c3e] text-white" : "text-gray-300 hover:bg-[#3c3c3e]"
                                                    }`}
                                                >
                                                    {model}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!inputValue.trim()}
                                className={`${
                                    inputValue.trim() ? "bg-[#3c3c3e] text-gray-300 hover:bg-[#4c4c4e]" : "bg-[#2c2c2e] text-gray-500"
                                } rounded-full p-1.5 transition-colors`}
                            >
                                <ArrowUp className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
