"use client"
import {useEffect, useRef, useState} from "react";
import Script from "next/script";
import {v4 as uuidv4} from "uuid";

export default function Desmos() {
    const divRef = useRef<HTMLDivElement>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [calculator, setCalculator] = useState<any>(null);
    const [expr, setExpr] = useState("");

    useEffect(() => {
        if (scriptLoaded && divRef.current) {
            const calc = new (window as any).Desmos.GraphingCalculator(divRef.current, {
                expressions: true,
            });
            setCalculator(calc);
        }
    }, [scriptLoaded]);

    const addExpression = () => {
        if (calculator && expr.trim()) {
            calculator.setExpression({id: uuidv4(), latex: expr});
            setExpr("");
        }
    };

    return (
        <>
            <Script
                src="https://www.desmos.com/api/v1.5/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
                strategy="afterInteractive"
                onLoad={() => setScriptLoaded(true)}
            />

            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    value={expr}
                    onChange={(e) => setExpr(e.target.value)}
                    placeholder="Enter LaTeX expression"
                    className="border px-2 py-1 flex-1"
                />
                <button
                    onClick={addExpression}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Add
                </button>
            </div>

            <div
                ref={divRef}
                id="calculator"
                className="w-[600px] h-[400px] border"
            />
        </>
    );
}