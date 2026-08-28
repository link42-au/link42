---
title: "Threat Intelligence"
slug: "threat"
subtitle: "Understanding the threat landscape — what's out there, who's behind it, and what to do about it"
seoDescription: "Understand threat intelligence fundamentals, threat actors, indicators, Australian context, and practical ways to turn intel into action."
navigationOrder: 70
category: "Threat Intelligence"
reviewStatus: "unverified"
---
:::section {"tag":"Foundations","title":"What is Threat Intelligence?"}
:::factual
Threat intelligence is evidence-based knowledge about existing or emerging threats. It is not just a list of suspicious artifacts. As explained by [https://www.recordedfuture.com/threat-intelligence](https://www.recordedfuture.com/threat-intelligence), intelligence turns observations into decision support for defenders, risk owners, and leadership teams.

A practical model is data to information to intelligence. Data is raw material, such as an IP address or hash. Information is enriched data, such as attribution, prevalence, or campaign links. Intelligence is contextualised and actionable judgment, such as deciding to block, monitor, or brief based on confidence and business relevance. This analytic framing aligns with guidance in [https://csrc.nist.gov/pubs/sp/800/150/final](https://csrc.nist.gov/pubs/sp/800/150/final).
:::satirical
Threat intelligence is what happens when "we found weird stuff" becomes "here is what matters and what we are doing next." A giant pile of indicators is still just data until someone adds context and judgment. The people at [https://www.recordedfuture.com/threat-intelligence](https://www.recordedfuture.com/threat-intelligence) phrase this politely, but every SOC learns it the hard way.

Think of it like this: data is crumbs, information is labeled crumbs, and intelligence is "this actor is targeting this pattern, so update controls now." Raw IPs and hashes are useful, but they are not strategy. Intelligence is the part that tells humans and tools what action to take, which is exactly why [https://csrc.nist.gov/pubs/sp/800/150/final](https://csrc.nist.gov/pubs/sp/800/150/final) treats it as an analytic discipline rather than a feed subscription.
:::endsection

:::section {"tag":"Categories","title":"Types of Threat Intelligence"}
:::factual
**Strategic intelligence** describes high-level trends and risk implications for executives. **Tactical intelligence** focuses on tactics, techniques, and procedures (TTPs) used by adversaries so defenders can improve controls. **Operational intelligence** tracks active campaigns and imminent threats. **Technical intelligence** provides indicators of compromise (IOCs) such as domains, hashes, URLs, and IPs.

These types should connect across the organisation. Strategic priorities guide collection, tactical analysis drives detection engineering, operational reporting informs readiness, and technical artifacts feed automation. The [https://attack.mitre.org/](https://attack.mitre.org/) knowledge base is commonly used to structure tactical and operational understanding.
:::satirical
Threat intel has four layers. Strategic is for leaders asking where risk is heading. Tactical is for defenders mapping attacker behaviour, also known as TTPs (tactics, techniques, and procedures). Operational is the campaign watchtower: who is active and where. Technical is the machine layer full of IOCs like domains, hashes, URLs, and IPs.

Most teams over-collect technical signals because CSV files feel productive. Then leadership asks, "So what?" and the room gets quiet. Better teams chain all four layers: strategy sets priorities, tactics shape detections, operational updates set urgency, and technical indicators execute quickly. [https://attack.mitre.org/](https://attack.mitre.org/) helps everyone use the same language instead of inventing local dialects.
:::endsection

:::section {"tag":"Sources","title":"Sources of Threat Intelligence"}
:::factual
Useful intelligence programs blend open, commercial, government, and community sources. Open source intelligence (OSINT) inputs include ASD alerts, CISA advisories, AlienVault OTX, VirusTotal, and Shodan. Australian advisories are published at [https://www.cyber.gov.au/about-us/advisories](https://www.cyber.gov.au/about-us/advisories), and US advisories are published at [https://www.cisa.gov/news-events/cybersecurity-advisories](https://www.cisa.gov/news-events/cybersecurity-advisories).

Commercial sources such as Recorded Future, Mandiant, and CrowdStrike provide additional curation, enrichment, and actor tracking. Community channels, including Information Sharing and Analysis Centers (ISACs), contribute sector-specific observations. Government-to-government sharing, including Five Eyes collaboration, also shapes strategic context. The key is source validation and local relevance, not source volume.
:::satirical
Threat intel sources come in four flavors: free, paid, official, and community. OSINT gives you ASD alerts, CISA advisories, OTX, VirusTotal, and Shodan. If you need primary government feeds, start at [https://www.cyber.gov.au/about-us/advisories](https://www.cyber.gov.au/about-us/advisories) and [https://www.cisa.gov/news-events/cybersecurity-advisories](https://www.cisa.gov/news-events/cybersecurity-advisories) before random blog posts with dramatic titles.

Commercial providers like Recorded Future, Mandiant, and CrowdStrike often add faster context and cleaner reporting. ISAC communities add practical sector detail that generic feeds miss. Then there is the geopolitical layer, including Five Eyes sharing. The trick is quality control. More feeds do not equal more insight if your team cannot validate confidence or apply findings to your environment.
:::endsection

:::section {"tag":"Detection","title":"Indicators of Compromise (IOCs)"}
:::factual
Indicators of compromise (IOCs) are observable artifacts that may indicate malicious activity. Typical examples include IP addresses, domain names, file hashes, URLs, and email addresses. They are useful for triage and rapid control updates when paired with context and confidence.

In practice, IOCs are used in security information and event management (SIEM) rules, intrusion detection systems (IDS), blocklists, and threat hunting queries. Their limitation is lifespan. Sophisticated adversaries frequently rotate infrastructure and payloads, so IOC-only approaches degrade quickly. Durable detection requires combining IOCs with behaviour analytics and TTP coverage.
:::satirical
IOCs are the cyber equivalent of suspicious number plates: IPs, domains, hashes, URLs, and sketchy email senders. They are useful clues, especially when you need to react quickly, but they are still clues. Without context, they are just noisy strings in a dashboard.

Teams plug IOCs into SIEM alerts, intrusion detection system (IDS) signatures, blocklists, and hunting scripts. That works until attackers rotate infrastructure, which they do constantly. If your whole plan is matching yesterday's indicators, you are playing defense in the rear-view mirror. Use IOCs, but pair them with behavioural detections based on TTPs.
:::endsection

:::section {"tag":"Actors","title":"Threat Actors"}
:::factual
Threat actors include nation-state groups, cybercriminal groups, hacktivists, and insiders. Nation-state examples include APT28 (Fancy Bear), APT41, and Lazarus Group. Cybercriminal examples include ransomware groups such as LockBit and BlackCat. Different actor classes have different intent, resources, and persistence levels.

Analysts track actors using naming conventions, infrastructure overlap, malware reuse, and behavioural patterns. MITRE group profiles at [https://attack.mitre.org/groups/](https://attack.mitre.org/groups/) support common reference points, while ASD reporting conventions provide Australian context. The purpose of tracking is to improve detection and prioritisation, not merely to attach labels.
:::satirical
Not all attackers are the same species. Some are nation-state groups like APT28 (Fancy Bear), APT41, and Lazarus Group with serious resources. Some are cybercriminal businesses like LockBit and BlackCat that specialise in making everyone else miserable. Others are hacktivists or insiders, each with different motives and blast radius.

Good actor tracking is less about cool names and more about repeatable evidence: shared infrastructure, malware families, and behaviour patterns. MITRE's group catalog at [https://attack.mitre.org/groups/](https://attack.mitre.org/groups/) and ASD-style naming conventions help teams stay aligned. The objective is practical: predict likely behaviour and harden the right controls first.
:::endsection

:::section {"tag":"Australia","title":"The Australian Threat Landscape"}
:::factual
The ASD Annual Cyber Threat Report is a key baseline for Australian organisations and is available at [https://www.cyber.gov.au/about-us/reports-and-statistics/asd-cyber-threat-report](https://www.cyber.gov.au/about-us/reports-and-statistics/asd-cyber-threat-report). It consistently highlights ransomware, business email compromise, supply chain compromise, and exploitation of unpatched internet-facing systems.

For entities covered by the Security of Critical Infrastructure (SOCI) Act, threat intelligence has governance implications as well as operational value. Intelligence should inform incident planning, uplift activities, reporting obligations, and board-level risk discussions. In this context, intelligence is not optional reporting; it is a core input for resilience.
:::satirical
If you defend Australian systems, read the ASD threat report at [https://www.cyber.gov.au/about-us/reports-and-statistics/asd-cyber-threat-report](https://www.cyber.gov.au/about-us/reports-and-statistics/asd-cyber-threat-report) before your next strategy workshop. The recurring themes are familiar: ransomware pressure, business email compromise, supply chain issues, and attackers loving unpatched internet-facing assets.

The SOCI Act also raises the stakes for critical infrastructure operators. Cyber risk is now a governance issue with concrete expectations, not just an IT department concern. Threat intelligence needs to influence incident plans, uplift priorities, and executive reporting. Regulators generally prefer evidence of action over beautifully designed slide decks.
:::endsection

:::section {"tag":"Action","title":"Making Threat Intelligence Actionable"}
:::factual
The intelligence cycle is direction, collection, processing, analysis, dissemination, and feedback. Direction defines what decisions need support. Collection gathers internal and external signals. Processing normalises and enriches. Analysis produces judgments and recommendations. Dissemination sends tailored outputs to different audiences. Feedback measures usefulness and refines the next cycle.

Operational impact comes from integration. Intelligence should update SIEM detections, endpoint controls, playbooks, threat hunting hypotheses, vulnerability prioritisation, and risk briefings. Teams that only collect and report intelligence generate noise. Teams that tie intelligence to decisions and control changes reduce measurable exposure.
:::satirical
Actionable intel follows a loop, not a random newsletter schedule: direction, collection, processing, analysis, dissemination, feedback. If any step is missing, results get weird quickly. No direction means random feed hoarding. No feedback means nobody admits the report was ignored.

The value appears when intelligence lands in real workflows: SIEM rules, endpoint policies, hunting plans, incident playbooks, patch priorities, and executive risk decisions. Collecting feeds without changing controls is just cybersecurity cosplay. The goal is not to know more trivia, it is to reduce successful attacks.
:::endsection

:::section {"tag":"Next Steps","title":"Continue Learning"}
:::factual
- [**MITRE ATT&CK**](https://link42.app/learn/threat/mitre-attack) — Learn how adversary behaviour maps to tactics and techniques.
- [**STIX & TAXII**](https://link42.app/learn/threat/stix-taxii) — Learn how threat intelligence is structured and shared between tools.
- [**Vulnerability Management**](https://link42.app/learn/vulnerability) — Connect threat context to patching and remediation plans.
- [**Risk Assessment**](https://link42.app/learn/risk) — Translate cyber findings into business impact and treatment choices.
- [**See active threats → threat10.link42.app**](https://threat10.link42.app/) — Explore active intelligence in the threat10 platform.
:::satirical
- [**MITRE ATT&CK**](https://link42.app/learn/threat/mitre-attack) — Learn how adversary behaviour maps to tactics and techniques.
- [**STIX & TAXII**](https://link42.app/learn/threat/stix-taxii) — Learn how threat intelligence is structured and shared between tools.
- [**Vulnerability Management**](https://link42.app/learn/vulnerability) — Connect threat context to patching and remediation plans.
- [**Risk Assessment**](https://link42.app/learn/risk) — Translate cyber findings into business impact and treatment choices.
- [**See active threats → threat10.link42.app**](https://threat10.link42.app/) — Explore active intelligence in the threat10 platform.
:::endsection
