"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

interface ApiKeyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    apiKey: string
    onApiKeySave: (apiKey: string) => void
}

export function ApiKeyDialog({
                                 open,
                                 onOpenChange,
                                 apiKey,
                                 onApiKeySave,
                             }: ApiKeyDialogProps) {
    const [inputValue, setInputValue] = useState(apiKey)

    const handleSave = () => {
        onApiKeySave(inputValue)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>API Key Configuration</DialogTitle>
                    <DialogDescription>
                        Enter your API key to use with the chat service.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="api-key" className="text-right">
                            API Key
                        </Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter your API key here"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}