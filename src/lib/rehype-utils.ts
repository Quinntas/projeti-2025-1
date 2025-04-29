import {Plugin} from "unified";
import {visit} from "unist-util-visit";

export const rehypeListItemParagraphToDiv: Plugin<[], unknown> = () => {
    return (tree: any) => {
        visit(tree, "element", (element) => {
            if (element.tagName === "li")
                element.children = element.children.map((child: any) => {
                    if (child.type === "element" && child.tagName === "p") child.tagName = "div";
                    return child;
                });
        });
        return tree;
    };
};
