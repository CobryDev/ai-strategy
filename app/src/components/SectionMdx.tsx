import { compileMDX } from "next-mdx-remote/rsc";
import type { Section } from "@/lib/content";
import { createMdxOptions } from "@/lib/markdown";
import { SECTION_COMPONENTS } from "@/lib/section-component-registry";

interface Props {
  section: Section;
}

export async function SectionMdx({ section }: Props) {
  const source = section.content.replace(
    /\{\{cite:([^}]+)\}\}/g,
    "[[cite:$1]]",
  ).replace(/<(?=\d)/g, "&lt;");

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
