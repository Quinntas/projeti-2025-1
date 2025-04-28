"use client";

import {useMarkdownProcessor,} from "@/hooks/use-markdown-processor";
import {Separator} from "@/components/ui/separator";
import dedent from "dedent";


const MARKDOWN_TEST_MESSAGE = dedent`
# Heading level 1

This is the first paragraph.

This is the second paragraph.

This is the third paragraph.

## Heading level 2

This is an [anchor](https://github.com).

### Heading level 3

This is **bold** and _italics_.

#### Heading level 4

This is \`inline\` code.

This is a code block:

\`\`\`tsx
const Message = () => {
  return <div>hi</div>;
};
\`\`\`

\`\`\`python
def add(a, b):
    return a + b

print(add(1, 2)) # 3
\`\`\`

##### Heading level 5

This is an unordered list:

- One
- Two
- Three, and **bold**

This is an ordered list:

1. One
1. Two
1. Three

This is a complex list:

1. **Bold**: One
    - One
    - Two
    - Three

2. **Bold**: Three
    - One
    - Two
    - Three

3. **Bold**: Four
    - One
    - Two
    - Three

###### Heading level 6

> This is a blockquote.

This is a table:

| Vegetable | Description |
|-----------|-------------|
| Carrot    | A crunchy, orange root vegetable that is rich in vitamins and minerals. It is commonly used in soups, salads, and as a snack. |
| Broccoli  | A green vegetable with tightly packed florets that is high in fiber, vitamins, and antioxidants. It can be steamed, boiled, stir-fried, or roasted. |
| Spinach   | A leafy green vegetable that is dense in nutrients like iron, calcium, and vitamins. It can be eaten raw in salads or cooked in various dishes. |
| Bell Pepper | A colorful, sweet vegetable available in different colors such as red, yellow, and green. It is often used in stir-fries, salads, or stuffed recipes. |
| Tomato    | A juicy fruit often used as a vegetable in culinary preparations. It comes in various shapes, sizes, and colors and is used in salads, sauces, and sandwiches. |
| Cucumber   | A cool and refreshing vegetable with a high water content. It is commonly used in salads, sandwiches, or as a crunchy snack. |
| Zucchini | A summer squash with a mild flavor and tender texture. It can be sautéed, grilled, roasted, or used in baking recipes. |
| Cauliflower | A versatile vegetable that can be roasted, steamed, mashed, or used to make gluten-free alternatives like cauliflower rice or pizza crust. |
| Green Beans | Long, slender pods that are low in calories and rich in vitamins. They can be steamed, stir-fried, or used in casseroles and salads. |
| Potato | A starchy vegetable available in various varieties. It can be boiled, baked, mashed, or used in soups, fries, and many other dishes. |

This is a mermaid diagram:

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

This is a LaTeX equation:

\`\`\`latex
\[ F = \frac{{G \cdot m_1 \cdot m_2}}{{r^2}} \]
\`\`\`

\`\`\`latex
\[ L[f(t)] = \int_0^{\infty} e^{-st} f(t) dt \]
\`\`\`

\`\`\`latex
\[F(x) = \int_{a}^{b} f(x) \, dx\]
\`\`\`

This is a desmos diagram:
\`\`\`desmos
y=x^{2}
\`\`\``;

export default function Chat() {
    const content = useMarkdownProcessor(MARKDOWN_TEST_MESSAGE);

    return (
        <div className="px-2 lg:px-8 pb-8">
            <div className="max-w-2xl w-full mx-auto flex flex-col gap-[10px]">
                <h1 className="font-sans text-2xl font-semibold mb-4 mt-8">
                    Supported Markdown
                </h1>

                <p className="font-sans text-base">
                    Below is the markdown that is supported in the LLM responses.
                </p>

                <Separator className={"my-5"}/>

                <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {content}
                </div>
            </div>
        </div>
    );
}
