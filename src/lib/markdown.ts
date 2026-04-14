import type { CompileOptions } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Root, Element, Text, RootContent, ElementContent } from "hast";
import { CLAIMS, type ClaimSource } from "./claims";

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

// [[cite:id|visible claim text]] — wraps text in hoverable span
// [[cite:id]] — bare marker (small superscript indicator)
const CITE_RE = /\[\[cite:([a-z0-9-]+)(?:\|([^\]]*))?\]\]/g;

function makeCiteSpan(
  claimId: string,
  verified: boolean,
  children: (Text | Element)[],
): Element {
  const marker: Element = {
    type: "element",
    tagName: "sup",
    properties: { className: ["cite-marker"] },
    children: [{ type: "text", value: verified ? "↗" : "⚠" }],
  };

  return {
    type: "element",
    tagName: "span",
    properties: {
      className: [
        "cite-ref",
        verified ? "cite-verified" : "cite-unverified",
      ],
      dataClaim: claimId,
      dataVerified: String(verified),
      role: "doc-noteref",
    },
    children: [...children, marker],
  };
}

function splitTextWithCitations(
  value: string,
  claims: Record<string, ClaimSource>,
): (Text | Element)[] {
  const nodes: (Text | Element)[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(CITE_RE)) {
    const claimId = match[1];
    const wrappedText = match[2]; // undefined for bare {{cite:id}}
    const claim = claims[claimId];
    const verified = claim?.verified ?? false;
    const before = value.slice(lastIndex, match.index);

    if (wrappedText !== undefined) {
      // Wrapped syntax: text before the wrapped portion stays outside
      if (before) {
        nodes.push({ type: "text", value: before });
      }
      nodes.push(
        makeCiteSpan(claimId, verified, [
          { type: "text", value: wrappedText },
        ]),
      );
    } else {
      // Bare marker: insert after preceding text
      if (before) {
        nodes.push({ type: "text", value: before });
      }
      nodes.push(makeCiteSpan(claimId, verified, []));
    }

    lastIndex = match.index! + match[0].length;
  }

  const after = value.slice(lastIndex);
  if (after) {
    nodes.push({ type: "text", value: after });
  }

  return nodes;
}

function walkCitations(
  children: (RootContent | ElementContent)[],
  claims: Record<string, ClaimSource>,
): (RootContent | ElementContent)[] {
  const result: (RootContent | ElementContent)[] = [];

  for (const child of children) {
    if (child.type === "text") {
      const text = child as Text;
      if (CITE_RE.test(text.value)) {
        CITE_RE.lastIndex = 0;
        result.push(
          ...(splitTextWithCitations(text.value, claims) as ElementContent[]),
        );
        continue;
      }
    }

    if (child.type === "element") {
      const el = child as Element;
      el.children = walkCitations(
        el.children,
        claims,
      ) as ElementContent[];
    }

    result.push(child);
  }

  return result;
}

function rehypeCitations() {
  return (tree: Root) => {
    tree.children = walkCitations(
      tree.children,
      CLAIMS,
    ) as RootContent[];
  };
}

export function createMdxOptions(sourceLineOffset = 0) {
  return {
    format: "mdx" as const,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeCallouts,
      rehypeCitations,
      [rehypeSourceLines, sourceLineOffset],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["heading-anchor"],
          },
        },
      ],
    ],
  } as Omit<CompileOptions, "outputFormat" | "providerImportSource">;
}
