import {Analytics} from "@vercel/analytics/react";
import classNames from "classnames";
import {Inter, JetBrains_Mono} from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/components/theme-provider";
import {DesmosProvider} from "@/hooks/use-desmos";

const sans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});
const monospace = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata = {
    title: "Chatbot",
    description:
        "Chatbot is a simple chatbot built with Next.js and Tailwind CSS. It supports Markdown, Mermaid diagrams, and LaTeX equations.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={classNames(
                sans.className,
                sans.variable,
                monospace.variable
            )}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider delayDuration={0}>
                <DesmosProvider>
                    {children}
                </DesmosProvider>
            </TooltipProvider>
            <Toaster/>
        </ThemeProvider>
        <Analytics/>
        </body>
        </html>
    );
}
