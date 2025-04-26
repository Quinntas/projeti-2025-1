import {Analytics} from "@vercel/analytics/react";
import classNames from "classnames";
import {Inter, JetBrains_Mono} from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/components/theme-provider";

const sans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});
const monospace = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata = {
    title: "LLM Markdown",
    description:
        "App demo for rendering rich-text (markdown) from a Large Language Model.",
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
                {children}
            </TooltipProvider>
            <Toaster/>
        </ThemeProvider>
        <Analytics/>
        </body>
        </html>
    );
}
