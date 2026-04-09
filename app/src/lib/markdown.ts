import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import type { Root, Element, Text, RootContent, ElementContent } from "hast";

type CalloutType =
  | "danger"
  | "caution"
  | "important"
  | "controversy"
  | "confusion"
  | "new"
  | "contribute"
  | "story";

const CALLOUT_PATTERNS: { pattern: RegExp; type: CalloutType }[] = [
  { pattern: /^🚨\s*(DANGER|CAUTION)[:\s]*/i, type: "danger" },
  { pattern: /^⚠️\s*(CAUTION)?[:\s]*/i, type: "caution" },
  { pattern: /^‼️\s*(IMPORTANT)?[:\s]*/i, type: "important" },
  { pattern: /^📜\s*(STORY)?[:\s]*/i, type: "story" },
  { pattern: /^📣\s*(CONTROVERSY)?[:\s]*/i, type: "controversy" },
  { pattern: /^🤷\s*(CONFUSION)?[:\s]*/i, type: "confusion" },
  { pattern: /^🆕\s*(NEW)?[:\s]*/i, type: "new" },
  { pattern: /^✏️\s*(CONTRIBUTE)?[:\s]*/i, type: "contribute" },
  { pattern: /^DANGER\s*/i, type: "danger" },
  { pattern: /^CAUTION\s*/i, type: "caution" },
  { pattern: /^IMPORTANT\s*/i, type: "important" },
  { pattern: /^STORY\s*/i, type: "story" },
  { pattern: /^CONTROVERSY[:\s]+/i, type: "controversy" },
  { pattern: /^CONFUSION[:\s]+/i, type: "confusion" },
  { pattern: /^CONTRIBUTE[:\s]+/i, type: "contribute" },
];

const CALLOUT_LABELS: Record<CalloutType, string> = {
  important: "Important",
  danger: "Danger",
  caution: "Caution",
  controversy: "Controversy",
  confusion: "Confusion",
  new: "New",
  contribute: "Contribute",
  story: "Story",
};

const CALLOUT_ICONS: Record<CalloutType, string> = {
  important: "◇",
  danger: "⚠",
  caution: "◇",
  controversy: "📣",
  confusion: "🤷",
  new: "🆕",
  contribute: "✏️",
  story: "💬",
};

function getTextContent(node: Element | Text | RootContent): string {
  if (node.type === "text") return (node as Text).value;
  if ("children" in node) {
    return (node.children as RootContent[]).map(getTextContent).join("");
  }
  return "";
}

function matchCalloutText(text: string): CalloutType | null {
  for (const { pattern, type } of CALLOUT_PATTERNS) {
    if (pattern.test(text.trim())) return type;
  }
  return null;
}

function cleanCalloutText(text: string, type: CalloutType): string {
  for (const { pattern, type: t } of CALLOUT_PATTERNS) {
    if (t === type && pattern.test(text.trim())) {
      return text.trim().replace(pattern, "").trim();
    }
  }
  return text.trim();
}

function makeBadge(type: CalloutType): ElementContent {
  return {
    type: "element",
    tagName: "span",
    properties: { className: ["callout-badge"] },
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { className: ["callout-icon"] },
        children: [{ type: "text", value: CALLOUT_ICONS[type] }],
      },
      {
        type: "element",
        tagName: "span",
        properties: { className: ["callout-label"] },
        children: [{ type: "text", value: CALLOUT_LABELS[type] }],
      },
    ],
  };
}

function makeCallout(type: CalloutType, contentChildren: ElementContent[]): Element {
  const badge = makeBadge(type);
  const header: ElementContent = {
    type: "element",
    tagName: "div",
    properties: { className: ["callout-header"] },
    children: [badge],
  };

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: [`callout`, `callout-${type}`],
      "data-callout": type,
      role: "note",
    },
    children: [
      header,
      {
        type: "element",
        tagName: "div",
        properties: { className: ["callout-content"] },
        children: contentChildren,
      },
    ],
  };
}

function tryH2Callout(node: Element): Element | null {
  if (node.tagName !== "h2" || !node.children.length) return null;
  const text = getTextContent(node);
  const type = matchCalloutText(text);
  if (!type) return null;

  const cleaned = cleanCalloutText(text, type);
  const content: ElementContent[] = cleaned
    ? [{ type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: cleaned }] }]
    : [];

  return makeCallout(type, content);
}

function tryBlockquoteCallout(node: Element): Element | null {
  if (node.tagName !== "blockquote" || !node.children.length) return null;

  const firstP = node.children.find(
    (c): c is Element => c.type === "element" && c.tagName === "p",
  );
  if (!firstP) return null;

  const firstPText = getTextContent(firstP);
  const type = matchCalloutText(firstPText);
  if (!type) return null;

  const leftover = cleanCalloutText(firstPText, type);
  const remaining = node.children.filter(
    (c) => c !== firstP && !(c.type === "text" && !(c as Text).value.trim()),
  ) as ElementContent[];

  const content: ElementContent[] = [];
  if (leftover) {
    content.push({
      type: "element",
      tagName: "p",
      properties: {},
      children: [{ type: "text", value: leftover }],
    });
  }
  content.push(...remaining);

  return makeCallout(type, content);
}

function rehypeCallouts() {
  return (tree: Root) => {
    const newChildren: RootContent[] = [];

    for (const node of tree.children) {
      if (node.type !== "element") {
        newChildren.push(node);
        continue;
      }

      const callout = tryH2Callout(node) || tryBlockquoteCallout(node);
      if (callout) {
        newChildren.push(callout);
      } else {
        newChildren.push(node);
      }
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

const BLOCK_TAGS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "li", "blockquote", "pre", "table", "tr",
]);

function rehypeSourceLines(lineOffset: number) {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== "element") continue;
      const el = node as Element;
      if (el.position?.start?.line) {
        el.properties = el.properties || {};
        el.properties["dataSourceLine"] = el.position.start.line + lineOffset;
      }
      if ("children" in el) {
        stampChildren(el.children as RootContent[], lineOffset);
      }
    }
  };
}

function stampChildren(children: RootContent[], lineOffset: number) {
  for (const node of children) {
    if (node.type !== "element") continue;
    const el = node as Element;
    if (BLOCK_TAGS.has(el.tagName) && el.position?.start?.line) {
      el.properties = el.properties || {};
      el.properties["dataSourceLine"] = el.position.start.line + lineOffset;
    }
    if ("children" in el) {
      stampChildren(el.children as RootContent[], lineOffset);
    }
  }
}

export async function markdownToHtml(
  markdown: string,
  sourceLineOffset = 0,
): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCallouts)
    .use(rehypeDemoteHeadings)
    .use(rehypeSourceLines, sourceLineOffset)
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
