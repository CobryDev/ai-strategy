import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import type { Root, Element, Text, RootContent, ElementContent } from "hast";

type CalloutType = "danger" | "caution" | "important" | "story";

const CALLOUT_PATTERNS: { pattern: RegExp; type: CalloutType }[] = [
  { pattern: /^🚨\s*(DANGER|CAUTION)[:\s]*/i, type: "danger" },
  { pattern: /^⚠️\s*(CAUTION)?[:\s]*/i, type: "caution" },
  { pattern: /^‼️\s*(IMPORTANT)?[:\s]*/i, type: "important" },
  { pattern: /^📜\s*(STORY)?[:\s]*/i, type: "story" },
  { pattern: /^DANGER\s*/i, type: "danger" },
  { pattern: /^CAUTION\s*/i, type: "caution" },
  { pattern: /^IMPORTANT\s*/i, type: "important" },
  { pattern: /^STORY\s*/i, type: "story" },
];

const CALLOUT_LABELS: Record<CalloutType, string> = {
  danger: "Danger",
  caution: "Caution",
  important: "Important",
  story: "Story",
};

const CALLOUT_ICONS: Record<CalloutType, string> = {
  danger: "🚨",
  caution: "⚠️",
  important: "‼️",
  story: "📜",
};

function getTextContent(node: Element | Text | RootContent): string {
  if (node.type === "text") return (node as Text).value;
  if ("children" in node) {
    return (node.children as RootContent[]).map(getTextContent).join("");
  }
  return "";
}

function detectCallout(
  node: Element,
): { type: CalloutType; cleanedChildren: ElementContent[] } | null {
  if (node.tagName !== "h2" || !node.children.length) return null;
  const text = getTextContent(node);
  for (const { pattern, type } of CALLOUT_PATTERNS) {
    if (pattern.test(text.trim())) {
      const cleaned = text.trim().replace(pattern, "").trim();
      const cleanedChildren: ElementContent[] = cleaned
        ? [{ type: "text", value: cleaned }]
        : [];
      return { type, cleanedChildren };
    }
  }
  return null;
}

function rehypeCallouts() {
  return (tree: Root) => {
    const newChildren: RootContent[] = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type !== "element") {
        newChildren.push(node);
        continue;
      }

      const callout = detectCallout(node);
      if (!callout) {
        newChildren.push(node);
        continue;
      }

      const { type, cleanedChildren } = callout;

      // Collect subsequent paragraph siblings that are part of this callout
      // (callouts in the source are single h2 elements with all text inline)
      const calloutBody: ElementContent[] = [];
      if (cleanedChildren.length > 0) {
        calloutBody.push({
          type: "element",
          tagName: "p",
          properties: {},
          children: cleanedChildren,
        });
      }

      const calloutElement: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: [`callout`, `callout-${type}`],
          "data-callout": type,
          role: "note",
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["callout-header"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["callout-icon"] },
                children: [
                  { type: "text", value: CALLOUT_ICONS[type] },
                ],
              },
              {
                type: "element",
                tagName: "span",
                properties: { className: ["callout-label"] },
                children: [
                  { type: "text", value: CALLOUT_LABELS[type] },
                ],
              },
            ],
          },
          {
            type: "element",
            tagName: "div",
            properties: { className: ["callout-content"] },
            children: calloutBody,
          },
        ],
      };

      newChildren.push(calloutElement);
    }

    tree.children = newChildren;
  };
}

// Demote headings: ### -> h1 (section title), #### -> h2, etc.
function rehypeDemoteHeadings() {
  return (tree: Root) => {
    function visit(node: RootContent) {
      if (node.type === "element") {
        const el = node as Element;
        const headingMap: Record<string, string> = {
          h1: "h1",
          h2: "h2",
          h3: "h2",
          h4: "h3",
          h5: "h4",
          h6: "h5",
        };
        if (headingMap[el.tagName]) {
          el.tagName = headingMap[el.tagName];
        }
        if ("children" in el) {
          el.children.forEach(visit);
        }
      }
    }
    tree.children.forEach(visit);
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCallouts)
    .use(rehypeDemoteHeadings)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: {
        className: ["heading-anchor"],
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}
