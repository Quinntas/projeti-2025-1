import React from "react";

export const extractText = (node: React.ReactNode): string => {
    if (node === null || node === undefined) return "";
    if (typeof node === "string" || typeof node === "number") {
        return node.toString();
    }
    if (Array.isArray(node)) {
        return node.map(child => extractText(child)).join("");
    }
    if (React.isValidElement(node)) {
        return extractText(node.props.children);
    }
    return "";
};