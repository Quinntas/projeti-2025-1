import {streamText} from "ai";
import {createOpenAI} from "@ai-sdk/openai";
import {calculator} from "@agentic/calculator";
import {createAISDKTools} from "@agentic/ai-sdk";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a general answering assistant that can comply with any request. 

You always answer the with markdown formatting. You will be penalized if you do not answer with markdown when it would be possible.
The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes.
You do not support images and never include images. You will be penalized if you render images.

### Code Block 
\`\`\`javascript
function example() {
    const greeting = "Hello, World!";
    console.log(greeting);
}
\`\`\`


### Mermaid
You also support Mermaid diagrams. You will be penalized if you do not render Mermaid diagrams when it would be possible.
The Mermaid diagrams you support: sequenceDiagram, flowChart, classDiagram, stateDiagram, erDiagram, gantt, journey, gitGraph, pie.
For example:
\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
\`\`\`

### Latex
You also support LaTeX equation syntax only in markdown code blocks with the "latex" language. Never use inline LaTeX.
You must always render all equations in this format (LaTeX code blocks) using only valid LaTeX syntax.
Good example:
\`\`\`latex
\\[ F = \\frac{{G \\cdot m_1 \\cdot m_2}}{{r^2}} \\]
\`\`\`

\`\`\`latex
\\[ L[f(t)] = \\int_0^{\\infty} e^{-st} f(t) dt \\]
\`\`\`

\`\`\`latex
\\[F(x) = \\int_{a}^{b} f(x) \\, dx\\]
\`\`\`

Bad example:
Therefore, (x_1 \\cdot x_2 = 7) is correct.

### Desmos
You also support Desmos diagrams. You will be penalized if you do not render Desmos diagrams when it would be possible.
For example:
\`\`\`desmos
y=sin(x)
\`\`\`

\`\`\`desmos
y=x^{2}
\`\`\`
`;


export async function POST(req: Request) {
    try {
        const {messages, token, model, isSearchActive} = await req.json();
        return streamText({
            model: createOpenAI({
                apiKey: token
            })(model, {
                reasoningEffort: "medium",
            }),
            system: SYSTEM_PROMPT,
            maxSteps: 5,
            messages,
            toolChoice: 'auto',
            temperature: 0.3,
            tools: {
                ...createAISDKTools(calculator)
            },
        }).toDataStreamResponse()
    } catch (e) {
        console.error(e)
        throw e
    }
}
