export interface ClaimSource {
  id: string;
  source: string;
  claims: string[];
  links: { label: string; url: string }[];
  verified: boolean;
}

export const CLAIMS: Record<string, ClaimSource> = {
  // ── Major Research Reports ──────────────────────────────────────

  "spglobal": {
    id: "spglobal",
    source: "S&P Global Market Intelligence — \"Voice of the Enterprise: AI & Machine Learning, Use Cases 2025\"",
    claims: [
      "42% of companies abandoned most AI initiatives (up from 17%)",
      "Average organization scrapped 46% of POCs before production",
    ],
    links: [
      { label: "S&P Global", url: "https://www.spglobal.com/market-intelligence/en/news-insights/research/ai-experiences-rapid-adoption-but-with-mixed-outcomes-highlights-from-vote-ai-machine-learning" },
      { label: "CIO Dive", url: "https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590/" },
    ],
    verified: true,
  },

  "mit-nanda": {
    id: "mit-nanda",
    source: "MIT Project NANDA — \"The GenAI Divide: State of AI in Business 2025\"",
    claims: [
      "95% of generative AI pilots deliver no measurable P&L impact",
      "Purchased solutions succeed ~67% vs. internal builds ~33%",
    ],
    links: [
      { label: "Fortune", url: "https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/" },
      { label: "Mind the Product", url: "https://www.mindtheproduct.com/why-most-ai-products-fail-key-findings-from-mits-2025-ai-report/" },
    ],
    verified: true,
  },

  "menlo-ventures": {
    id: "menlo-ventures",
    source: "Menlo Ventures — \"2025: The State of Generative AI in the Enterprise\"",
    claims: [
      "76% of AI solutions purchased (up from 53%)",
      "Enterprise AI spending hit $37B",
      "Coding = $4B / 55% of departmental spend",
      "AI spending grew from $1.7B to $37B since 2023",
    ],
    links: [
      { label: "Menlo Ventures", url: "https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/" },
    ],
    verified: true,
  },

  "brynjolfsson": {
    id: "brynjolfsson",
    source: "Brynjolfsson, Li & Raymond — \"Generative AI at Work\" (NBER/QJE)",
    claims: [
      "5,172 customer support agents studied",
      "14–15% increase in issues resolved per hour",
      "30–35% gains for less experienced workers",
    ],
    links: [
      { label: "NBER", url: "https://www.nber.org/papers/w31161" },
      { label: "QJE", url: "https://academic.oup.com/qje/article/140/2/889/7990658" },
      { label: "arXiv", url: "https://arxiv.org/abs/2304.11771" },
    ],
    verified: true,
  },

  "klarna": {
    id: "klarna",
    source: "Klarna — AI Assistant Press Release (Feb 2024)",
    claims: [
      "2.3M conversations in first month",
      "Two-thirds of customer chats handled by AI",
      "700 FTE equivalent",
      "Resolution time 11 min → <2 min",
      "$40M profit improvement",
    ],
    links: [
      { label: "Klarna", url: "https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" },
      { label: "OpenAI", url: "https://openai.com/index/klarna/" },
    ],
    verified: true,
  },

  "pew-research": {
    id: "pew-research",
    source: "Pew Research Center — \"U.S. Workers Are More Worried Than Hopeful About Future AI Use in the Workplace\" (Feb 2025)",
    claims: [
      "50% more concerned than excited about AI at work",
      "~5,000 respondents",
      "13-point increase in concern from four years earlier",
    ],
    links: [
      { label: "Pew Research", url: "https://www.pewresearch.org/social-trends/2025/02/25/u-s-workers-are-more-worried-than-hopeful-about-future-ai-use-in-the-workplace/" },
      { label: "Worker views", url: "https://www.pewresearch.org/social-trends/2025/02/25/workers-views-of-ai-use-in-the-workplace/" },
    ],
    verified: true,
  },

  "upguard": {
    id: "upguard",
    source: "UpGuard — \"State of Shadow AI\" Report (Nov 2025)",
    claims: [
      "80%+ of workers use unapproved AI tools",
      "Nearly 90% of security professionals use unapproved tools",
      "50% use unapproved tools regularly",
    ],
    links: [
      { label: "UpGuard", url: "https://www.upguard.com/resources/the-state-of-shadow-ai" },
      { label: "Cybersecurity Dive", url: "https://www.cybersecuritydive.com/news/shadow-ai-employee-trust-upguard/805280/" },
    ],
    verified: true,
  },

  "endkoo": {
    id: "endkoo",
    source: "ENDKOO — \"AI ROI Analysis: Insights from 200 B2B Deployments\" (Denis Atlan)",
    claims: [
      "200 B2B deployments in France (2022–2025)",
      "Median ROI +159.8% over 24 months",
      "73% success rate",
      "8-month median breakeven",
    ],
    links: [
      { label: "ResearchGate", url: "https://www.researchgate.net/publication/398573151_AI_ROI_Analysis_Insights_from_200_B2B_Deployments" },
      { label: "GitHub", url: "https://github.com/denisatlan/ai-roi-dataset" },
      { label: "Hugging Face", url: "https://huggingface.co/datasets/ENDKOO/ai-roi-b2b-france-200-deployments" },
    ],
    verified: true,
  },

  "mckinsey": {
    id: "mckinsey",
    source: "McKinsey — AI Surveys (various years)",
    claims: [
      "78% of organizations using AI in some form",
      "Organizations that redesigned workflows before selecting technology were ~3x as likely to report significant financial returns",
    ],
    links: [
      { label: "McKinsey State of AI", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
    ],
    verified: false,
  },

  "oecd": {
    id: "oecd",
    source: "OECD — AI adoption statistics",
    claims: [
      "Firm-level adoption at 20.2% across member countries in 2025",
    ],
    links: [
      { label: "OECD AI Observatory", url: "https://oecd.ai/" },
    ],
    verified: false,
  },

  "census": {
    id: "census",
    source: "U.S. Census Bureau — Business Trends and Outlook Survey",
    claims: [
      "9.7% of U.S. firms used AI in early-to-mid 2025 (up from 3.7% in late 2023)",
    ],
    links: [
      { label: "Census Bureau", url: "https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html" },
    ],
    verified: true,
  },

  "alice-labs": {
    id: "alice-labs",
    source: "Alice Labs — Global AI Adoption Index 2026",
    claims: [
      "Most methodologically careful cross-national comparison",
      "No single global AI adoption rate",
    ],
    links: [],
    verified: false,
  },

  // ── Productivity & Developer Studies ────────────────────────────

  "pg-study": {
    id: "pg-study",
    source: "Procter & Gamble Study (776 experienced product professionals)",
    claims: [
      "Individuals using AI performed as well as a team of two working without it",
    ],
    links: [],
    verified: false,
  },

  "ms-developer-rcts": {
    id: "ms-developer-rcts",
    source: "Microsoft/Accenture/Fortune 100 Developer RCTs (~5,000 developers)",
    claims: [
      "26% increase in completed pull requests",
    ],
    links: [],
    verified: false,
  },

  "penn-wharton": {
    id: "penn-wharton",
    source: "Penn Wharton Review",
    claims: [
      "Labor cost savings 10–55%, average ~25%",
    ],
    links: [],
    verified: false,
  },

  "faros": {
    id: "faros",
    source: "Faros AI — Developer Telemetry Study",
    claims: [
      "10,000+ developers across 1,255 teams",
      "Developers write more code but no measurable improvement in delivery velocity at organizational level",
    ],
    links: [
      { label: "Faros AI", url: "https://www.faros.ai/" },
    ],
    verified: false,
  },

  "cmr-meta": {
    id: "cmr-meta",
    source: "California Management Review / Meta-analysis of 371 estimates",
    claims: [
      "No robust, publication-bias-free relationship between AI adoption and aggregate labor-market productivity",
    ],
    links: [],
    verified: false,
  },

  "llm-dev-review": {
    id: "llm-dev-review",
    source: "July 2025 Systematic Review (37 studies on LLM-assisted software development)",
    claims: [
      "Code-quality regressions and rework frequently offset headline speed gains",
    ],
    links: [],
    verified: false,
  },

  "dora": {
    id: "dora",
    source: "Google DORA Report (2024/2025)",
    claims: [
      "Developers estimate 17% individual effectiveness improvement",
      "Software delivery instability climbed ~10%",
      "60% of developers in teams with lower delivery speeds or greater instability",
    ],
    links: [
      { label: "DORA Research", url: "https://dora.dev/research/" },
    ],
    verified: true,
  },

  "ms-copilot-research": {
    id: "ms-copilot-research",
    source: "Microsoft Internal Research (Jan 2025) on Copilot",
    claims: [
      "Coding speed +29%",
      "Code review time +47%",
      "30% more static analysis warnings",
      "41% more complexity",
      "Up to 4.94x more technical debt",
    ],
    links: [],
    verified: false,
  },

  // ── Security & Threat Research ──────────────────────────────────

  "owasp": {
    id: "owasp",
    source: "OWASP — Top 10 for LLM Applications 2025",
    claims: [
      "Prompt injection = #1 vulnerability",
      "Appears in 73% of production AI deployments",
    ],
    links: [
      { label: "OWASP", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" },
    ],
    verified: true,
  },

  "cisco-leaks": {
    id: "cisco-leaks",
    source: "Cisco — 2025 Study on AI Data Leaks",
    claims: [
      "46% of organizations experienced internal data leaks through generative AI",
    ],
    links: [],
    verified: false,
  },

  "cybsafe": {
    id: "cybsafe",
    source: "CybSafe Research",
    claims: [
      "38% of employees share confidential data with AI platforms without approval",
    ],
    links: [
      { label: "CybSafe", url: "https://www.cybsafe.com/" },
    ],
    verified: false,
  },

  "echoleak": {
    id: "echoleak",
    source: "EchoLeak / Microsoft Copilot Zero-Click Vulnerability",
    claims: [
      "Data exfiltration from OneDrive, SharePoint, and Teams without user interaction",
    ],
    links: [],
    verified: false,
  },

  "copilot-cve": {
    id: "copilot-cve",
    source: "GitHub Copilot CVE-2025-53773",
    claims: [
      "CVSS 9.6",
      "Complete system takeover through prompt injection in code comments",
    ],
    links: [],
    verified: false,
  },

  "ai-safety-report": {
    id: "ai-safety-report",
    source: "International AI Safety Report 2026",
    claims: [
      "Sophisticated attackers bypass best-defended models ~50% of the time with 10 attempts",
    ],
    links: [],
    verified: false,
  },

  "schneier": {
    id: "schneier",
    source: "Bruce Schneier & Barath Raghavan — IEEE Spectrum (early 2026)",
    claims: [
      "Distinction between code and data that tamed SQL injection doesn't exist inside a language model",
    ],
    links: [],
    verified: false,
  },

  "ncsc": {
    id: "ncsc",
    source: "UK NCSC Assessment (Dec 2025)",
    claims: [
      "Prompt injection may never be fully mitigated like SQL injection",
    ],
    links: [
      { label: "NCSC", url: "https://www.ncsc.gov.uk/" },
    ],
    verified: false,
  },

  // ── Shadow AI & Employee Behavior ───────────────────────────────

  "software-ag": {
    id: "software-ag",
    source: "Software AG Research",
    claims: [
      "50% of employees use unauthorized AI tools",
      "46% would continue even if banned",
    ],
    links: [],
    verified: false,
  },

  "ms-shadow-ai": {
    id: "ms-shadow-ai",
    source: "Microsoft Research — UK Employees",
    claims: [
      "71% of UK employees use unapproved AI tools",
      "51% at least weekly",
    ],
    links: [],
    verified: false,
  },

  "gartner": {
    id: "gartner",
    source: "Gartner",
    claims: [
      "69% of organizations suspect employees using prohibited public GenAI tools",
      "40% of enterprise applications will feature AI agents by end of 2026",
      "15% of IT leaders considering/piloting autonomous AI agents",
    ],
    links: [
      { label: "Gartner", url: "https://www.gartner.com/" },
    ],
    verified: false,
  },

  "writer-axios": {
    id: "writer-axios",
    source: "Writer / Axios Survey",
    claims: [
      "41% of Millennial/Gen Z employees sabotaging AI strategy",
      "42% of C-suite say AI is \"tearing company apart\"",
      "80% success rate with formal AI strategy vs. 37% without",
      "35% of employees pay out of pocket for AI tools",
    ],
    links: [],
    verified: false,
  },

  // ── Governance & Compliance ─────────────────────────────────────

  "isaca": {
    id: "isaca",
    source: "ISACA Research",
    claims: [
      "Only 28% have formal, comprehensive AI use policy",
    ],
    links: [
      { label: "ISACA", url: "https://www.isaca.org/" },
    ],
    verified: false,
  },

  "ibm-governance": {
    id: "ibm-governance",
    source: "IBM Research",
    claims: [
      "Only 37% have governance policies actively implemented",
      "44% developing but not implemented",
    ],
    links: [],
    verified: false,
  },

  "fisher-phillips": {
    id: "fisher-phillips",
    source: "Fisher Phillips — Acceptable Use Policy Template",
    claims: [],
    links: [
      { label: "Fisher Phillips", url: "https://www.fisherphillips.com/" },
    ],
    verified: false,
  },

  "kpmg": {
    id: "kpmg",
    source: "KPMG — AI Governance Guidance",
    claims: [
      "Responsible AI governance as \"first order of business\"",
    ],
    links: [],
    verified: false,
  },

  "ms-adaptive-gov": {
    id: "ms-adaptive-gov",
    source: "Microsoft — Adaptive Governance Framework (April 2026)",
    claims: [
      "Three-tier risk classification model",
      "\"Agents don't create access problems; they expose the ones you already have, faster\"",
    ],
    links: [],
    verified: false,
  },

  // ── ROI & Measurement ───────────────────────────────────────────

  "larridin": {
    id: "larridin",
    source: "Larridin (March 2026)",
    claims: [
      "80% survey satisfaction vs. 35% actual sustained usage",
      "Five-link measurement chain",
      "Power users generate 10–50x more value",
    ],
    links: [
      { label: "Larridin", url: "https://larridin.com/" },
    ],
    verified: false,
  },

  "servicenow": {
    id: "servicenow",
    source: "ServiceNow",
    claims: [
      "54% deflection on common forms",
      "12–17 minutes saved per case",
      "~$5.5M annualized savings",
    ],
    links: [],
    verified: false,
  },

  "esusu": {
    id: "esusu",
    source: "Esusu",
    claims: [
      "Automated 64% of email interactions",
      "10-point CSAT lift",
    ],
    links: [],
    verified: false,
  },

  "qualcomm": {
    id: "qualcomm",
    source: "Qualcomm",
    claims: [
      "~2,400 hours saved per month across 70 workflows",
      "Vetted 25+ use cases",
    ],
    links: [],
    verified: false,
  },

  "deloitte": {
    id: "deloitte",
    source: "Deloitte — 2025 Survey of 1,854 Executives",
    claims: [
      "Most organizations achieve satisfactory ROI in 2–4 years",
      "Only 6% see payback in under a year",
      "47% of enterprise AI users made major decisions based on hallucinated content",
    ],
    links: [],
    verified: false,
  },

  "worklytics": {
    id: "worklytics",
    source: "Worklytics",
    claims: [
      "Generic AI training = 23% sustained adoption",
      "Role-specific training = 67% sustained adoption",
    ],
    links: [
      { label: "Worklytics", url: "https://www.worklytics.co/" },
    ],
    verified: false,
  },

  // ── AI Capabilities & Failure Modes ─────────────────────────────

  "hallucination-research": {
    id: "hallucination-research",
    source: "Hallucination Research",
    claims: [
      "RAG reduces hallucination by up to 71%",
      "Mathematical proof that hallucinations are structurally inevitable",
      "34% more likely to use high-confidence language when wrong",
    ],
    links: [],
    verified: false,
  },

  "sycophancy": {
    id: "sycophancy",
    source: "Sycophancy Benchmarks",
    claims: [
      "Sycophancy scores increasing from 0.07 to 0.19–0.23 in newer models",
    ],
    links: [],
    verified: false,
  },

  "forrester-hallucination": {
    id: "forrester-hallucination",
    source: "Forrester",
    claims: [
      "Each enterprise employee costs ~$14,200/year in hallucination verification",
      "$67.4B global cost of hallucination-related issues",
    ],
    links: [],
    verified: false,
  },

  // ── People & Culture ────────────────────────────────────────────

  "coca-cola": {
    id: "coca-cola",
    source: "Coca-Cola — AI Approach",
    claims: [
      "Only 2 of ~2,000 marketing employees have \"AI\" in job title",
      "Cross-functional \"digital council\"",
    ],
    links: [],
    verified: false,
  },

  "vizient": {
    id: "vizient",
    source: "Vizient — AI Champion Program",
    claims: [
      "4x estimated ROI",
      "~$700K savings in first year",
    ],
    links: [],
    verified: false,
  },

  "lumen": {
    id: "lumen",
    source: "Lumen Technologies",
    claims: [
      "90%+ Copilot licensing",
      "\"Gently tapped\" leaders whose teams weren't adopting",
    ],
    links: [],
    verified: false,
  },

  "bayer": {
    id: "bayer",
    source: "Bayer Data Academy",
    claims: [
      "Multi-tier training program",
      "90% of learners reported improved innovation or process improvements",
    ],
    links: [],
    verified: false,
  },

  "datacamp": {
    id: "datacamp",
    source: "DataCamp 2026 Survey",
    claims: [
      "82% provide some AI training",
      "59% still report skills gap",
      "35% have mature organization-wide programs",
    ],
    links: [
      { label: "DataCamp", url: "https://www.datacamp.com/" },
    ],
    verified: false,
  },

  // ── Data Readiness ──────────────────────────────────────────────

  "braincuber": {
    id: "braincuber",
    source: "Braincuber — Minimum Viable Dataset / Retailer Case Study",
    claims: [
      "Mid-market retailer spent $187K on recommendation engine before discovering data was unusable",
    ],
    links: [],
    verified: false,
  },

  "premai": {
    id: "premai",
    source: "PremAI Analysis",
    claims: [
      "80% of RAG failures trace to ingestion and chunking layer",
    ],
    links: [],
    verified: false,
  },

  "gigli": {
    id: "gigli",
    source: "Andrea Gigli — Data Readiness Checklist (Jan 2026)",
    claims: [
      "24 yes/no questions across six dimensions",
    ],
    links: [],
    verified: false,
  },

  "transcend": {
    id: "transcend",
    source: "Transcend — 2025 Analysis",
    claims: [
      "Four recurring data blockers",
    ],
    links: [
      { label: "Transcend", url: "https://transcend.io/" },
    ],
    verified: false,
  },

  // ── Environmental Impact ────────────────────────────────────────

  "nature-sustainability": {
    id: "nature-sustainability",
    source: "Nature Sustainability — AI Carbon/Water Footprint",
    claims: [
      "32.6–79.7 million tons CO₂ in 2025",
      "312–765 billion liters water",
    ],
    links: [],
    verified: false,
  },

  "iea": {
    id: "iea",
    source: "IEA — Data Center Electricity Projections",
    claims: [
      "Global data center demand to double by 2030 to ~945 TWh",
    ],
    links: [
      { label: "IEA", url: "https://www.iea.org/" },
    ],
    verified: true,
  },

  "goldman-sachs": {
    id: "goldman-sachs",
    source: "Goldman Sachs Research",
    claims: [
      "~60% of increasing data center electricity demand met by fossil fuels",
      "~220M tons carbon emissions",
    ],
    links: [],
    verified: false,
  },

  // ── Specific Incidents ──────────────────────────────────────────

  "air-canada": {
    id: "air-canada",
    source: "Air Canada AI Chatbot",
    claims: [
      "Invented a refund policy the airline had to honor",
    ],
    links: [],
    verified: true,
  },

  "samsung-chatgpt": {
    id: "samsung-chatgpt",
    source: "Samsung / ChatGPT Incident (2023)",
    claims: [
      "Engineers pasted proprietary source code into ChatGPT",
    ],
    links: [],
    verified: true,
  },

  "dpd": {
    id: "dpd",
    source: "DPD AI Chatbot",
    claims: [
      "Manipulated into swearing at customer and criticizing the company",
    ],
    links: [],
    verified: true,
  },

  "jpmorgan": {
    id: "jpmorgan",
    source: "JPMorgan Chase",
    claims: [
      "$12M loss from prompt injection targeting virtual assistant",
    ],
    links: [],
    verified: false,
  },

  "openclaw": {
    id: "openclaw",
    source: "OpenClaw Security Crisis (early 2026)",
    claims: [
      "135,000+ GitHub stars",
      "Critical vulnerabilities",
      "21,000+ exposed instances",
    ],
    links: [],
    verified: false,
  },

  // ── Other Named Sources ─────────────────────────────────────────

  "a16z": {
    id: "a16z",
    source: "Andreessen Horowitz (a16z) enterprise survey",
    claims: [
      "37% use 5+ models",
    ],
    links: [],
    verified: false,
  },

  "nexos": {
    id: "nexos",
    source: "Nexos.ai",
    claims: [
      "84% of AI initiatives with C-level sponsorship achieve positive ROI vs. 23% without",
    ],
    links: [],
    verified: false,
  },

  "forvis-mazars": {
    id: "forvis-mazars",
    source: "Forvis Mazars",
    claims: [
      "Only 15% of organizations fully prepared for advanced AI",
    ],
    links: [],
    verified: false,
  },

  "mindstudio": {
    id: "mindstudio",
    source: "MindStudio",
    claims: [
      "Human-in-the-loop workflows achieve 99.9% accuracy",
    ],
    links: [],
    verified: false,
  },

  "modelop": {
    id: "modelop",
    source: "ModelOp",
    claims: [
      "44% of organizations say governance is \"too slow\"",
    ],
    links: [],
    verified: false,
  },

  "wolters-kluwer": {
    id: "wolters-kluwer",
    source: "Wolters Kluwer 2025 Benchmark",
    claims: [
      "AI legal research tools averaged 89% accuracy",
    ],
    links: [],
    verified: false,
  },

  "csa": {
    id: "csa",
    source: "Cloud Security Alliance",
    claims: [
      "Agentic AI Red Teaming Guide",
    ],
    links: [
      { label: "CSA", url: "https://cloudsecurityalliance.org/" },
    ],
    verified: true,
  },

  "dataiku": {
    id: "dataiku",
    source: "Dataiku",
    claims: [
      "Hub-and-spoke model = 3x more likely to scale AI",
    ],
    links: [],
    verified: false,
  },

  "thomson-reuters": {
    id: "thomson-reuters",
    source: "Thomson Reuters",
    claims: [
      "Firms with 3+ AI use cases: 160% avg ROI vs. 40% for one",
    ],
    links: [],
    verified: false,
  },

  // ── EU AI Act ───────────────────────────────────────────────────

  "ecnl-fria": {
    id: "ecnl-fria",
    source: "ECNL/DIHR Guide — FRIA Template",
    claims: [
      "Most operational interpretation of Fundamental Rights Impact Assessment",
    ],
    links: [],
    verified: false,
  },

  "gpai-guidelines": {
    id: "gpai-guidelines",
    source: "July 2025 GPAI Guidelines",
    claims: [
      "Fine-tuning >1/3 of original training compute triggers provider obligations",
    ],
    links: [],
    verified: false,
  },

  "digital-omnibus": {
    id: "digital-omnibus",
    source: "Digital Omnibus Proposal",
    claims: [
      "Would push high-risk deadline to Dec 2, 2027",
      "Currently in trilogue",
    ],
    links: [],
    verified: false,
  },
};

export function getClaim(id: string): ClaimSource | undefined {
  return CLAIMS[id];
}

export function getAllClaims(): ClaimSource[] {
  return Object.values(CLAIMS);
}
