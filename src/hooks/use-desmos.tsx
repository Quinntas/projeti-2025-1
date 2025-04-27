"use client"
import React, {createContext, useContext, useState} from "react"
import Script from "next/script"

export interface DesmosContextType {
    scriptLoaded: boolean
    initCalculator: (
        container: HTMLDivElement,
        options?: Record<string, any>
    ) => any | null

    addExpression: (
        calculator: any,
        id: string,
        latex: string
    ) => void
}

const DesmosContext = createContext<DesmosContextType | null>(null)

export const DesmosProvider: React.FC<React.PropsWithChildren<{}>> = ({
                                                                          children,
                                                                      }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false)

    const initCalculator = (
        container: HTMLDivElement,
        options: Record<string, any> = {expressions: true}
    ) => {
        if (
            typeof window === "undefined" ||
            !(window as any).Desmos ||
            !scriptLoaded
        ) {
            console.warn("Desmos is not ready yet.")
            return null
        }
        const CalcConstructor = (window as any).Desmos.GraphingCalculator
        return new CalcConstructor(container, options)
    }

    const addExpression = (calculator: any, id: string, latex: string) => {
        if (!calculator || !latex.trim()) return;
        calculator.setExpression({id, latex});
    }

    return (
        <>
            <Script
                id="desmos-api"
                async
                src="https://www.desmos.com/api/v1.5/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
                strategy="afterInteractive"
                onLoad={() => setScriptLoaded(true)}
            />

            <DesmosContext.Provider value={{scriptLoaded, initCalculator, addExpression}}>
                {children}
            </DesmosContext.Provider>
        </>
    )
}

export function useDesmos(): DesmosContextType {
    const ctx = useContext(DesmosContext)
    if (!ctx) {
        throw new Error("useDesmos must be used within a DesmosProvider")
    }
    return ctx
}