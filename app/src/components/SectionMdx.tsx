import { compileMDX } from "next-mdx-remote/rsc";
import type { Section } from "@/lib/content";
import { createMdxOptions } from "@/lib/markdown";
import { SECTION_COMPONENTS } from "@/lib/section-component-registry";

interface Props {
  section: Section;
}

function demoteMarkdownHeadings(source: string) {
  let insideFence = false;

  return source
    .split("\n")
    .map((line) => {
      if (/^(```|~~~)/.test(line.trim())) {
        insideFence = !insideFence;
        return line;
      }

      if (insideFence) {
        return line;
      }

      const match = line.match(/^(#{1,5})(\s+.*)$/);
      if (!match) {
        return line;
      }

      return `${match[1]}#${match[2]}`;
    })
    .join("\n");
}

export async function SectionMdx({ section }: Props) {
  const source = demoteMarkdownHeadings(
    section.content
      .replace(/\{\{cite:([^}]+)\}\}/g, "[[cite:$1]]")
      .replace(/<(?=\d)/g, "&lt;"),
  );

  const { content } = await compileMDX({
    source,
    components: SECTION_COMPONENTS[section.sourcePath] ?? {},
    options: {
      parseFrontmatter: false,
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: createMdxOptions(section.sourceLineOffset),
    },
  });

  return content;
}
