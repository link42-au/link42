---
title: "Security Frameworks"
slug: "frameworks"
subtitle: "Standards and guidelines that define how organisations protect their systems"
seoDescription: "Security framework fundamentals across Australia, New Zealand, and international standards."
navigationOrder: 10
category: "Foundations"
reviewStatus: "verified"
---
:::section {"tag":"Foundations","title":"What is a Security Framework?"}
:::factual
A security framework is a structured set of controls, principles, and governance practices used to reduce cyber risk in a consistent way. Frameworks exist so organisations do not have to reinvent security architecture from scratch for every system. They create a shared language for technical teams, executives, regulators, and assessors. Good frameworks connect policy decisions to operational controls, evidence, and accountability.

Standards and guidelines are related but not identical. A standard is usually something you are measured against formally, such as [ISO/IEC 27001](https://www.iso.org/isoiec-27001-information-security.html). A guideline provides implementation direction that may be mandated by policy context but is often applied through risk-based tailoring, such as the [NIST Cybersecurity Framework (CSF)](https://www.nist.gov/cyberframework) and the Australian [Information Security Manual (ISM)](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism). In practice, mature programs use both: standards for assurance and guidelines for execution.
:::satirical
A security framework is what you adopt when you want outcomes better than "everyone do your best". It is a repeatable way to decide what controls matter, who owns them, and how you prove they work. Without one, security posture usually depends on whichever team shouted loudest in planning. With one, you can actually track maturity, defend budget requests, and survive audits with your dignity mostly intact.

Quick translation: standards are the exam, guidelines are the study plan. [ISO/IEC 27001](https://www.iso.org/isoiec-27001-information-security.html) is a formal standard often used for certification. [NIST CSF](https://www.nist.gov/cyberframework) and the Australian [ISM](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism) are practical guidance frameworks you use to build and run controls sensibly. You generally need all of this eventually, unless your strategy is "wait for an incident to prioritise for us."
:::endsection

:::section {"tag":"Australia","title":"Australian Frameworks"}
:::factual
In Australia, three core references appear repeatedly in public-sector and critical-infrastructure security programs. The [Information Security Manual (ISM)](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism), maintained by the Australian Signals Directorate (ASD), provides detailed control guidance. The [Essential Eight](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight) is ASD's prioritised mitigation subset for common threats. The [Protective Security Policy Framework (PSPF)](https://www.protectivesecurity.gov.au/) defines broader protective-security obligations for Australian Government entities.

For critical infrastructure, legal obligations may also arise under the [Security of Critical Infrastructure Act 2018 (Cth), as amended](https://www.legislation.gov.au/C2022C00139/latest/text). This means framework selection is not purely academic. It directly influences architecture decisions, operational controls, evidence requirements, and assurance pathways. Even private organisations that supply government often inherit these requirements contractually.
:::satirical
The Australian stack is pretty clear once you stop fighting it: [ISM](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism) for broad control depth, [Essential Eight](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight) for urgent mitigation priorities, and [PSPF](https://www.protectivesecurity.gov.au/) for whole-of-government protective-security policy. Ignore one and some part of your governance story gets weird fast.

If you touch critical infrastructure, the [SOCI Act](https://www.legislation.gov.au/C2022C00139/latest/text) enters the chat and the compliance conversation gets very real. Also, many suppliers discover "voluntary" controls become mandatory the moment a contract says so. Framework mapping early is cheaper than emergency mapping during procurement, IRAP prep, or regulatory scrutiny.
:::endsection

:::section {"tag":"New Zealand","title":"New Zealand Frameworks"}
:::factual
New Zealand's primary government framework is the [New Zealand Information Security Manual (NZISM)](https://nzism.gcsb.govt.nz/), published by the Government Communications Security Bureau (GCSB) via the National Cyber Security Centre (NCSC). NZISM provides mandatory and recommended controls for government environments, with strong alignment to risk management, classification handling, and assurance practices.

Organisations working across Australia and New Zealand should expect conceptual overlap between NZISM and ISM but not perfect equivalence. The safest approach is to map controls explicitly rather than assuming one jurisdiction's wording satisfies another's assurance expectations. This reduces duplicated engineering while preserving audit and policy traceability in both countries.
:::satirical
In New Zealand, the main reference is [NZISM](https://nzism.gcsb.govt.nz/) from GCSB/NCSC. Think of it as the official manual for running government-grade security without improvising your controls in quarterly panic mode. It is detailed, structured, and absolutely worth learning if you operate in NZ public-sector contexts.

Yes, it feels very similar to Australia's ISM in philosophy. No, you still cannot just relabel one set of documents and call it compliance. Cross-jurisdiction work needs deliberate control mapping, or you end up with dual frameworks, triple spreadsheets, and exactly zero people happy during assurance reviews.
:::endsection

:::section {"tag":"Global Baselines","title":"International Standards"}
:::factual
Four globally referenced frameworks are commonly used as baseline models. [ISO/IEC 27001](https://www.iso.org/isoiec-27001-information-security.html) defines requirements for an information security management system (ISMS), and [ISO/IEC 27002](https://www.iso.org/standard/75652.html) provides implementation guidance for controls. [NIST CSF 2.0](https://www.nist.gov/cyberframework) gives outcome-oriented governance and capability functions. [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) provides detailed control catalogs, while the [CIS Controls](https://www.cisecurity.org/controls/cis-controls-list) offer practical prioritised safeguards.

A brief comparison: ISO 27001 is strongest for formal certification and management-system assurance; NIST CSF is excellent for executive-to-technical risk communication; NIST 800-53 is deep and prescriptive for control engineering; CIS Controls are concise and implementation-focused for rapid uplift. Most mature organisations blend these references based on regulatory context, sector obligations, and operational complexity.

For new teams, it helps to separate framework purpose from implementation tooling. Frameworks define what security outcomes are expected; tooling defines how you execute and evidence those outcomes. A team can use cloud-native controls, endpoint tools, and SIEM platforms in many different combinations while still mapping cleanly to ISO, NIST, CIS, or ISM expectations. The key is maintaining traceability from each control statement to measurable implementation and review cadence.
:::satirical
Internationally, you will keep seeing the same heavy hitters: [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html) and [ISO 27002](https://www.iso.org/standard/75652.html), [NIST CSF 2.0](https://www.nist.gov/cyberframework), [NIST 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final), and the [CIS Controls](https://www.cisecurity.org/controls/cis-controls-list). Different packaging, same mission: reduce the number of terrible surprises in your environment.

If you want certification conversations, start with ISO 27001. If you want risk and leadership alignment, NIST CSF is excellent. If you want granular control detail, 800-53 has all the knobs. If you need practical uplift now, CIS is very usable. Real programs usually mix these instead of joining framework fandom wars.

Also, frameworks tell you where to end up, not which dashboard to buy. You can absolutely spend a fortune on security tooling and still fail framework outcomes if ownership, evidence, and review discipline are weak. The teams that do this well map every control to an owner, a process, and proof. The teams that do it badly map controls to a procurement list and hope the audit has low standards.
:::endsection

:::section {"tag":"Decision Guide","title":"Which Framework Applies to You?"}
:::factual
Start with jurisdiction and regulatory obligations, then tailor by business risk. Australian Government entities generally align to the [ISM](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism) and [PSPF](https://www.protectivesecurity.gov.au/). New Zealand Government entities align to [NZISM](https://nzism.gcsb.govt.nz/). Private-sector organisations commonly adopt [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html) or [NIST CSF](https://www.nist.gov/cyberframework) as primary governance anchors.

For critical infrastructure operators, consider obligations under the [SOCI Act](https://www.legislation.gov.au/C2022C00139/latest/text) and align with ISM guidance where appropriate, especially when government-connected assurance is expected. In all cases, begin with scope, data sensitivity, and threat profile, then build a control map that can produce evidence, not just policy text.

Framework choice should also account for customer expectations, board reporting maturity, and internal operating model. A smaller organisation may begin with NIST CSF or CIS-style uplift, then formalise around ISO 27001 as governance matures. A government supplier may invert that path and map directly to ISM from the start because contractual assurance requirements are immediate.
:::satirical
Framework selection is less mystery and more paperwork geography. Australian Government? Use [ISM](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism) and [PSPF](https://www.protectivesecurity.gov.au/). NZ Government? Use [NZISM](https://nzism.gcsb.govt.nz/). Private sector? Usually [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html) or [NIST CSF](https://www.nist.gov/cyberframework), depending on customers and assurance needs.

Running critical infrastructure in Australia means the [SOCI Act](https://www.legislation.gov.au/C2022C00139/latest/text) is relevant, and ISM alignment often becomes strategically smart whether or not someone calls it mandatory in your first meeting. Pick a framework stack you can actually operate, evidence, and improve, not one that just looks impressive on a slide.

Also factor in customers, board expectations, and team capacity. Some organisations sensibly start with NIST CSF and CIS-style uplift, then move toward ISO 27001 once governance muscle builds. Others map straight to ISM because supplier contracts force high-assurance evidence from day one. Strategy beats framework cosplay every time.
:::endsection

:::section {"tag":"Next Steps","title":"Continue Learning"}
:::factual
- [**The Australian ISM**](https://link42.app/learn/frameworks/ism) — Learn how the ISM is structured and applied in practice.
- [**The New Zealand ISM**](https://link42.app/learn/frameworks/nzism) — Compare NZISM controls and classification context.
- [**PICERL Incident Response**](https://link42.app/learn/frameworks/picerl) — Understand the six-phase incident response lifecycle.
- [**Risk Assessment Methodology**](https://link42.app/learn/risk/methodology) — Connect framework controls to real risk treatment decisions.
:::satirical
- [**The Australian ISM**](https://link42.app/learn/frameworks/ism) — Learn how the ISM is structured and applied in practice.
- [**The New Zealand ISM**](https://link42.app/learn/frameworks/nzism) — Compare NZISM controls and classification context.
- [**PICERL Incident Response**](https://link42.app/learn/frameworks/picerl) — Understand the six-phase incident response lifecycle.
- [**Risk Assessment Methodology**](https://link42.app/learn/risk/methodology) — Connect framework controls to real risk treatment decisions.
:::endsection
