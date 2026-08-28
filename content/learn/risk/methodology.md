---
title: "Risk Assessment Methodology"
slug: "risk/methodology"
subtitle: "How leading risk frameworks differ, where they overlap, and how to choose one that survives contact with reality"
seoDescription: "Compare ISO 31000, NIST SP 800-30, NIST RMF, the Australian ISM approach, and FAIR to choose the right risk assessment method for your context."
navigationOrder: 140
category: "Risk Assessment"
reviewStatus: "unverified"
---
:::section {"tag":"Orientation","title":"Why Methodology Choice Matters"}
:::factual
Methodology determines how consistently an organisation identifies, analyses, and communicates risk. It affects governance quality, audit defensibility, and how well technical findings translate into business decisions. Different methods optimise for different outcomes: policy alignment, compliance traceability, operational execution, or financial decision support.

Before selecting a method, start with the basics on [/learn/risk](https://link42.app/learn/risk). This page assumes you already understand core concepts such as threat, vulnerability, impact, and residual risk.
:::satirical
Pick your methodology badly and everything downstream gets weird: scoring drifts, registers become fiction, and audit season turns into interpretive dance. Pick it well and people can repeat the process, explain their choices, and disagree using evidence instead of volume.

If risk fundamentals still feel fuzzy, do future-you a favour and skim [/learn/risk](https://link42.app/learn/risk) first. This page is the "which framework should we trust in front of executives and auditors" level.
:::endsection

:::section {"tag":"ISO","title":"ISO 31000 — The Governance Wrapper"}
:::factual
ISO 31000 is a general risk management standard, not cyber-specific guidance. Its value is structural: it defines principles, a governance framework, and a process model that can be applied across strategic, operational, financial, and security risk domains.

In cybersecurity programs, ISO 31000 often acts as the top-level governance wrapper so security risk decisions align with enterprise risk language and board reporting. Reference: [https://www.iso.org/iso-31000-risk-management.html](https://www.iso.org/iso-31000-risk-management.html).
:::satirical
ISO 31000 is the "grown-up risk management" frame everyone can agree on because it is broad, tidy, and intentionally not just about cyber. It tells you to use principles, build a framework, run a repeatable process, and avoid making major decisions by gut feel plus panic.

For cyber teams, this is your passport into enterprise governance conversations. Without it, you are often the team with detailed findings but no shared business grammar. Reference: [https://www.iso.org/iso-31000-risk-management.html](https://www.iso.org/iso-31000-risk-management.html).
:::endsection

:::section {"tag":"NIST Guide","title":"NIST SP 800-30 Rev. 1 — Risk Assessment Mechanics"}
:::factual
NIST SP 800-30 Rev. 1 is a focused information security risk assessment guide. It defines a four-step flow: prepare for assessment, conduct assessment, communicate results, and maintain assessment over time.

The conduct step explicitly analyses threat sources, threat events, vulnerabilities, predisposing conditions, likelihood, and impact. SP 800-30 provides analytic depth that supports repeatable assessor practice and feeds directly into NIST RMF workflows. Reference: [https://csrc.nist.gov/pubs/sp/800/30/r1/final](https://csrc.nist.gov/pubs/sp/800/30/r1/final).
:::satirical
SP 800-30 is where NIST gets practical. Instead of vague "manage risk better" advice, it gives a four-part loop: prepare, assess, communicate, maintain. Translation: know what you are assessing, do the analysis properly, tell people what it means, then keep it current.

It also forces you to talk about real ingredients: threat sources, threat events, vulnerabilities, likelihood, and impact, not just scanner severity labels. Bonus: it plugs neatly into RMF so the paperwork actually connects to lifecycle decisions. Reference: [https://csrc.nist.gov/pubs/sp/800/30/r1/final](https://csrc.nist.gov/pubs/sp/800/30/r1/final).
:::endsection

:::section {"tag":"NIST Lifecycle","title":"NIST RMF (SP 800-37) — From Categorise to Continuous Monitoring"}
:::factual
NIST SP 800-37 Rev. 2 defines the Risk Management Framework lifecycle: prepare, categorize, select, implement, assess, authorize, and monitor. It links system impact categorization to control selection, validation, formal risk acceptance, and ongoing oversight.

RMF parallels the ISM lifecycle in important ways: both are governance-heavy, authorization-centric, and built for continuous assurance rather than one-off assessment. SP 800-30 typically provides the assessment detail inside RMF execution. Reference: [https://csrc.nist.gov/pubs/sp/800/37/r2/final](https://csrc.nist.gov/pubs/sp/800/37/r2/final).
:::satirical
RMF is the full governance marathon: prepare, categorize, select, implement, assess, authorize, monitor. It is not just "score some risks"; it is a full operating model for proving controls exist, work, and stay effective while someone senior signs their name to residual risk.

If this sounds familiar to ISM practitioners, good eye. RMF and ISM are cousins with different accents: both care deeply about lifecycle discipline and explicit authorization, not just optimistic control checklists. Reference: [https://csrc.nist.gov/pubs/sp/800/37/r2/final](https://csrc.nist.gov/pubs/sp/800/37/r2/final).
:::endsection

:::section {"tag":"Australia","title":"ISM Risk Management — Classification, SSPs, and Risk Acceptance"}
:::factual
The Australian Information Security Manual integrates risk management directly into system authorisation. Security classifications influence control expectations and shape acceptable residual risk based on organisational risk appetite.

In practice, System Security Plans document system context, controls, and treatment decisions, while Authorising Officers accept residual risk for operation. This creates traceability between technical state and governance accountability. Reference: [https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism). See also [/learn/frameworks/ism](https://link42.app/learn/frameworks/ism) and [/learn/frameworks/ism/irap](https://link42.app/learn/frameworks/ism/irap).
:::satirical
ISM treats risk as an authorisation problem, not a slide-deck problem. Your classification level is not decoration; it drives control rigor and defines how much residual risk leadership can reasonably accept without inviting regulatory pain.

System Security Plans are where theory meets accountability: what the system is, what controls exist, what gaps remain, and who accepted what risk anyway. If you need Australian government-grade traceability, this is the lane. Reference: [https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism). Deep dive links: [/learn/frameworks/ism](https://link42.app/learn/frameworks/ism) and [/learn/frameworks/ism/irap](https://link42.app/learn/frameworks/ism/irap).
:::endsection

:::section {"tag":"Quantitative","title":"FAIR — Frequency x Magnitude in Financial Terms"}
:::factual
FAIR (Factor Analysis of Information Risk) is a quantitative model that decomposes risk into Loss Event Frequency and Loss Magnitude. This supports range-based estimates, sensitivity analysis, and investment comparisons framed in financial terms.

FAIR is especially useful for strategic decisions such as control investment trade-offs, cyber insurance analysis, and board-level prioritisation where qualitative labels alone are insufficient. For rapid triage across large portfolios, qualitative methods may remain more practical. Reference: [https://www.fairinstitute.org/](https://www.fairinstitute.org/).
:::satirical
FAIR is what happens when finance asks, "Can you put that risk in dollars instead of colors?" It breaks risk into how often bad events happen and how much they cost, then forces everyone to expose their assumptions instead of hiding behind "high/medium" semantics.

Use FAIR when decisions are expensive and executives want numbers they can compare. Use qualitative methods when speed matters more than precision theatre. Best programs do both and pretend less. Reference: [https://www.fairinstitute.org/](https://www.fairinstitute.org/).
:::endsection

:::section {"tag":"Comparison","title":"Strengths, Weaknesses, and When to Use What"}
:::factual
ISO 31000 is strongest for enterprise governance alignment but intentionally high-level for cyber-specific analysis. NIST SP 800-30 is strong in assessment depth but depends on broader governance structures for lifecycle execution. NIST RMF provides robust end-to-end governance and authorization traceability, though it can be process-heavy for low-maturity teams. ISM is highly actionable in Australian regulatory contexts, especially where classification and formal authorization are central. FAIR provides decision-grade quantification but requires strong data quality and modelling discipline.

These frameworks are complementary, not mutually exclusive. Choose based on organisational maturity, regulatory obligations, and decision type: compliance assurance, operational prioritisation, or financial optimisation. Hybrid models are common and often preferable.
:::satirical
Quick truth table: ISO 31000 gives governance shape, SP 800-30 gives analyst method, RMF gives lifecycle control with signatures, ISM gives Australian authorization discipline, and FAIR gives financial math when "trust us" no longer works. Every one has blind spots if used alone.

So yes, you will probably run a hybrid. That is not failure; that is maturity. Pick the mix based on who regulates you, how mature your teams are, and whether the decision is operational, compliance-driven, or money-driven.
:::endsection

:::section {"tag":"Platform","title":"How link42 Combines These Methods"}
:::factual
link42 applies ISO-style governance structure, NIST-style assessment detail, ISM-compatible authorization thinking, and FAIR-inspired quantitative reasoning where needed. The goal is to support both defensible compliance reporting and practical prioritisation.

Threat context from [/learn/threat](https://link42.app/learn/threat) and exposure context from [/learn/vulnerability](https://link42.app/learn/vulnerability) are combined with business context to produce explainable risk recommendations. AI-assisted risk assessment workflows are coming soon at [link42.app](https://link42.app/).
:::satirical
link42 takes the useful bits and drops the framework tribalism: ISO for governance sanity, NIST for assessment structure, ISM for authorization realism, and FAIR for numbers when budget conversations get serious.

Then it combines threat intel and vulnerability reality with business context so your priority list is based on evidence, not whichever dashboard screamed loudest. AI-assisted risk assessment is coming soon at [link42.app](https://link42.app/).
:::endsection

:::section {"tag":"Next Steps","title":"Continue Learning"}
:::factual
- [**Risk Assessment Overview**](https://link42.app/learn/risk) — Revisit the core model before selecting a formal methodology.
- [**ISM Framework**](https://link42.app/learn/frameworks/ism) — Explore Australian government control and risk governance detail.
- [**IRAP Assessment Process**](https://link42.app/learn/frameworks/ism/irap) — Understand independent assessment and authorisation support.
- [**Threat Intelligence**](https://link42.app/learn/threat) — Improve likelihood analysis with adversary context.
- [**Vulnerability Management**](https://link42.app/learn/vulnerability) — Connect technical exposure to treatment priorities.
:::satirical
- [**Risk Assessment Overview**](https://link42.app/learn/risk) — Revisit the core model before selecting a formal methodology.
- [**ISM Framework**](https://link42.app/learn/frameworks/ism) — Explore Australian government control and risk governance detail.
- [**IRAP Assessment Process**](https://link42.app/learn/frameworks/ism/irap) — Understand independent assessment and authorisation support.
- [**Threat Intelligence**](https://link42.app/learn/threat) — Improve likelihood analysis with adversary context.
- [**Vulnerability Management**](https://link42.app/learn/vulnerability) — Connect technical exposure to treatment priorities.
:::endsection
