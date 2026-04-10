import type { ComponentType } from "react";

import * as section1Components from "../../content/00-introduction/01-why-this-guide-exists/components";
import * as section2Components from "../../content/00-introduction/02-who-this-is-for/components";
import * as section3Components from "../../content/00-introduction/03-how-to-use-this-guide/components";
import * as section4Components from "../../content/01-part-i-foundations/04-what-we-mean-by-ai-and-why-definitions-matter/components";
import * as section5Components from "../../content/01-part-i-foundations/05-the-current-state-of-ai-adoption/components";
import * as section6Components from "../../content/01-part-i-foundations/06-ai-is-not-magic-mental-models-that-actually-help/components";
import * as section7Components from "../../content/01-part-i-foundations/07-myths-and-pitfalls-of-enterprise-ai/components";
import * as section8Components from "../../content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/08-building-your-ai-strategy-without-the-buzzword-bingo/components";
import * as section9Components from "../../content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/09-identifying-high-value-ai-use-cases/components";
import * as section10Components from "../../content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/10-build-vs-buy-vs-configure/components";
import * as section11Components from "../../content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/11-the-ai-tech-stack-what-you-actually-need/components";
import * as section12Components from "../../content/03-part-iii-the-pillars-what-you-need-to-get-right/12-pillar-1-security/components";
import * as section13Components from "../../content/03-part-iii-the-pillars-what-you-need-to-get-right/13-pillar-2-data/components";
import * as section14Components from "../../content/03-part-iii-the-pillars-what-you-need-to-get-right/14-pillar-3-governance-and-compliance/components";
import * as section15Components from "../../content/03-part-iii-the-pillars-what-you-need-to-get-right/15-pillar-4-development-and-engineering/components";
import * as section16Components from "../../content/03-part-iii-the-pillars-what-you-need-to-get-right/16-pillar-5-people-and-culture/components";
import * as section17Components from "../../content/03-part-iii-the-pillars-what-you-need-to-get-right/17-pillar-6-measurement-and-roi/components";
import * as section18Components from "../../content/04-part-iv-adoption-making-it-actually-happen/18-the-adoption-playbook-phase-by-phase/components";
import * as section19Components from "../../content/04-part-iv-adoption-making-it-actually-happen/19-running-ai-pilots-that-dont-die/components";
import * as section20Components from "../../content/04-part-iv-adoption-making-it-actually-happen/20-change-management-for-ai-adoption/components";
import * as section21Components from "../../content/04-part-iv-adoption-making-it-actually-happen/21-building-your-internal-ai-knowledge-base/components";
import * as section22Components from "../../content/05-part-v-domain-specific-guidance/22-ai-for-software-engineering-teams/components";
import * as section23Components from "../../content/05-part-v-domain-specific-guidance/23-ai-for-customer-support-and-success/components";
import * as section24Components from "../../content/05-part-v-domain-specific-guidance/24-ai-for-marketing-and-content/components";
import * as section25Components from "../../content/05-part-v-domain-specific-guidance/25-ai-for-sales/components";
import * as section26Components from "../../content/05-part-v-domain-specific-guidance/26-ai-for-hr-and-people-operations/components";
import * as section27Components from "../../content/05-part-v-domain-specific-guidance/27-ai-for-legal-compliance-and-finance/components";
import * as section28Components from "../../content/05-part-v-domain-specific-guidance/28-ai-for-product-management-and-design/components";
import * as section29Components from "../../content/06-part-vi-the-hard-stuff-what-most-guides-skip/29-when-ai-goes-wrong-incident-response/components";
import * as section30Components from "../../content/06-part-vi-the-hard-stuff-what-most-guides-skip/30-the-ethics-you-cant-outsource/components";
import * as section31Components from "../../content/06-part-vi-the-hard-stuff-what-most-guides-skip/31-ai-and-organizational-design/components";
import * as section32Components from "../../content/06-part-vi-the-hard-stuff-what-most-guides-skip/32-staying-current-without-losing-your-mind/components";
import * as section33Components from "../../content/07-appendices/a-ai-tool-landscape-by-category/components";
import * as section34Components from "../../content/07-appendices/b-template-library-all-actionable-templates-in-one-place/components";
import * as section35Components from "../../content/07-appendices/c-glossary/components";
import * as section36Components from "../../content/07-appendices/d-further-reading-and-resources/components";
import * as section37Components from "../../content/07-appendices/99-design-principles-for-this-guide/components";

export type SectionComponentMap = Record<string, ComponentType<unknown>>;

export const SECTION_COMPONENTS: Record<string, SectionComponentMap> = {
  "app/content/00-introduction/01-why-this-guide-exists/section.mdx": section1Components as SectionComponentMap,
  "app/content/00-introduction/02-who-this-is-for/section.mdx": section2Components as SectionComponentMap,
  "app/content/00-introduction/03-how-to-use-this-guide/section.mdx": section3Components as SectionComponentMap,
  "app/content/01-part-i-foundations/04-what-we-mean-by-ai-and-why-definitions-matter/section.mdx": section4Components as SectionComponentMap,
  "app/content/01-part-i-foundations/05-the-current-state-of-ai-adoption/section.mdx": section5Components as SectionComponentMap,
  "app/content/01-part-i-foundations/06-ai-is-not-magic-mental-models-that-actually-help/section.mdx": section6Components as SectionComponentMap,
  "app/content/01-part-i-foundations/07-myths-and-pitfalls-of-enterprise-ai/section.mdx": section7Components as SectionComponentMap,
  "app/content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/08-building-your-ai-strategy-without-the-buzzword-bingo/section.mdx": section8Components as SectionComponentMap,
  "app/content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/09-identifying-high-value-ai-use-cases/section.mdx": section9Components as SectionComponentMap,
  "app/content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/10-build-vs-buy-vs-configure/section.mdx": section10Components as SectionComponentMap,
  "app/content/02-part-ii-strategy-deciding-where-and-how-to-use-ai/11-the-ai-tech-stack-what-you-actually-need/section.mdx": section11Components as SectionComponentMap,
  "app/content/03-part-iii-the-pillars-what-you-need-to-get-right/12-pillar-1-security/section.mdx": section12Components as SectionComponentMap,
  "app/content/03-part-iii-the-pillars-what-you-need-to-get-right/13-pillar-2-data/section.mdx": section13Components as SectionComponentMap,
  "app/content/03-part-iii-the-pillars-what-you-need-to-get-right/14-pillar-3-governance-and-compliance/section.mdx": section14Components as SectionComponentMap,
  "app/content/03-part-iii-the-pillars-what-you-need-to-get-right/15-pillar-4-development-and-engineering/section.mdx": section15Components as SectionComponentMap,
  "app/content/03-part-iii-the-pillars-what-you-need-to-get-right/16-pillar-5-people-and-culture/section.mdx": section16Components as SectionComponentMap,
  "app/content/03-part-iii-the-pillars-what-you-need-to-get-right/17-pillar-6-measurement-and-roi/section.mdx": section17Components as SectionComponentMap,
  "app/content/04-part-iv-adoption-making-it-actually-happen/18-the-adoption-playbook-phase-by-phase/section.mdx": section18Components as SectionComponentMap,
  "app/content/04-part-iv-adoption-making-it-actually-happen/19-running-ai-pilots-that-dont-die/section.mdx": section19Components as SectionComponentMap,
  "app/content/04-part-iv-adoption-making-it-actually-happen/20-change-management-for-ai-adoption/section.mdx": section20Components as SectionComponentMap,
  "app/content/04-part-iv-adoption-making-it-actually-happen/21-building-your-internal-ai-knowledge-base/section.mdx": section21Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/22-ai-for-software-engineering-teams/section.mdx": section22Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/23-ai-for-customer-support-and-success/section.mdx": section23Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/24-ai-for-marketing-and-content/section.mdx": section24Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/25-ai-for-sales/section.mdx": section25Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/26-ai-for-hr-and-people-operations/section.mdx": section26Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/27-ai-for-legal-compliance-and-finance/section.mdx": section27Components as SectionComponentMap,
  "app/content/05-part-v-domain-specific-guidance/28-ai-for-product-management-and-design/section.mdx": section28Components as SectionComponentMap,
  "app/content/06-part-vi-the-hard-stuff-what-most-guides-skip/29-when-ai-goes-wrong-incident-response/section.mdx": section29Components as SectionComponentMap,
  "app/content/06-part-vi-the-hard-stuff-what-most-guides-skip/30-the-ethics-you-cant-outsource/section.mdx": section30Components as SectionComponentMap,
  "app/content/06-part-vi-the-hard-stuff-what-most-guides-skip/31-ai-and-organizational-design/section.mdx": section31Components as SectionComponentMap,
  "app/content/06-part-vi-the-hard-stuff-what-most-guides-skip/32-staying-current-without-losing-your-mind/section.mdx": section32Components as SectionComponentMap,
  "app/content/07-appendices/a-ai-tool-landscape-by-category/section.mdx": section33Components as SectionComponentMap,
  "app/content/07-appendices/b-template-library-all-actionable-templates-in-one-place/section.mdx": section34Components as SectionComponentMap,
  "app/content/07-appendices/c-glossary/section.mdx": section35Components as SectionComponentMap,
  "app/content/07-appendices/d-further-reading-and-resources/section.mdx": section36Components as SectionComponentMap,
  "app/content/07-appendices/99-design-principles-for-this-guide/section.mdx": section37Components as SectionComponentMap,
};
