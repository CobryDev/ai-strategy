export const siteConfig = {
  name: "Honest AI Guide",
  title: "The Enterprise Guide to AI Adoption",
  description:
    "An opinionated, practical guide to adopting AI across your organization, from strategy and governance to pilots, tooling, and change management.",
  url: "https://honestai.guide",
  socialImagePath: "/logo.png",
  keywords: [
    "enterprise AI adoption",
    "AI strategy guide",
    "AI governance",
    "AI implementation",
    "AI playbook",
    "business AI adoption",
  ],
} as const;

export function getSocialImageUrl() {
  return new URL(siteConfig.socialImagePath, siteConfig.url).toString();
}
