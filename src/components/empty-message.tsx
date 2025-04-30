export const EmptyMessage = () => {
    return (
        <div
            className="max-w-2xl mx-auto h-screen flex items-center justify-center w-full p-4 lg:p-8 rounded-lg ">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">How to Use the Chat Bot</h2>
                <div className="space-y-2">
                    <p className="">
                        Welcome! This chat bot supports various formatting options including Markdown, Mermaid diagrams,
                        and LaTeX equations.
                    </p>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Getting Started:</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Type your question or request in the chat input</li>
                            <li>Press Enter or click Send to submit</li>
                            <li>The bot will respond with formatted text, code, diagrams, or equations</li>
                        </ul>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Supported Features:</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Markdown formatting (headings, lists, code blocks, etc.)</li>
                            <li>Mermaid diagrams (sequence, flow, class diagrams, etc.)</li>
                            <li>LaTeX equations in code blocks</li>
                            <li>Syntax highlighting for code snippets</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
