---
title: "Risk Assessment"
slug: "risk"
subtitle: "How threat, vulnerability, and business context combine into decisions about what to protect and why"
seoDescription: "Understand cybersecurity risk assessment: threat, vulnerability, impact, risk appetite, qualitative vs quantitative methods, and how link42 combines data into prioritised decisions."
navigationOrder: 130
category: "Risk Assessment"
reviewStatus: "unverified"
---
:::section {"tag":"Core Concept","title":"What is Cybersecurity Risk?"}
:::factual
Cybersecurity risk is usually expressed as a combination of likelihood and consequence. A practical shorthand is Risk = Threat x Vulnerability x Impact. A threat source (for example a criminal group, insider, or accidental actor) uses a vulnerability (a weakness in technology, process, or people) to create impact on an asset the organisation values. That impact may be financial, operational, legal, safety-related, or reputational. This framing is consistent with ISO 27005 guidance on information security risk management and NIST SP 800-30 Rev. 1, which both emphasise understanding threat events, predisposing conditions, likelihood, and adverse impact.

The key operational point is that not all risks are equal. Some can be accepted because the consequence is minor or the event is unlikely. Others are intolerable because even one occurrence would be severe. A mature program therefore ranks risks rather than treating every vulnerability or alert as equally urgent. References: ISO 27005 and NIST SP 800-30 Rev. 1 ([https://csrc.nist.gov/pubs/sp/800/30/r1/final](https://csrc.nist.gov/pubs/sp/800/30/r1/final)).
:::satirical
Cyber risk is what happens when someone who wants to hurt you (threat) finds a way in (vulnerability) and then breaks something expensive, regulated, or business-critical (impact). The common formula is Risk = Threat x Vulnerability x Impact. It is not magic maths, but it is a useful sanity check: no motivated attacker means lower pressure, no exploitable weakness means lower opportunity, no meaningful consequence means lower business urgency. ISO 27005 and NIST SP 800-30 Rev. 1 both describe this same basic logic, just with more formal language and fewer coffee-fuelled war stories.

Also, every risk item does not deserve a red panic banner. Some are acceptable trade-offs, some are fix-now issues, and some are paperwork theatre unless the context changes. If your process cannot distinguish those, you do not have risk management, you have an anxiety pipeline. References: ISO 27005 and NIST SP 800-30 Rev. 1 ([https://csrc.nist.gov/pubs/sp/800/30/r1/final](https://csrc.nist.gov/pubs/sp/800/30/r1/final)).
:::endsection

:::section {"tag":"Model","title":"The Three Pillars"}
:::factual
A useful way to explain risk to technical and non-technical stakeholders is to separate it into three pillars: threat, vulnerability, and impact. Threat answers who might target you and with what capability, intent, and opportunity. Vulnerability answers what weaknesses exist in systems, configurations, code, identity controls, or business processes. Impact answers what happens if exploitation succeeds: downtime, data loss, fraud, legal exposure, recovery cost, and mission disruption.

In practice, organisations often have good data for the first two pillars but weaker analysis for the third. Threat intelligence can indicate active campaigns and attacker behaviour. Vulnerability management can show exposure and patch status. Impact requires business knowledge: which systems drive revenue, which data triggers regulatory obligations, and which outages matter most. link42 treats these pillars as connected inputs rather than isolated dashboards, because prioritisation quality depends on all three.
:::satirical
Risk conversations become dramatically less chaotic when you split them into threat, vulnerability, and impact. Threat is "who might come after us and how serious are they." Vulnerability is "what doors did we accidentally leave open." Impact is "what burns if they get through." People usually love talking about threat feeds and CVEs because they are concrete and public. Impact is harder because it requires calling business owners and asking uncomfortable questions about money, downtime, contracts, and regulators.

If you skip impact, you are not prioritising risk, you are prioritising whichever scanner made the loudest noise today. That is efficient only if your strategy is "work hard, achieve confusion." link42 links threat intelligence, vulnerability exposure, and business impact so the output is an ordered decision list instead of three disconnected piles of facts.
:::endsection

:::section {"tag":"Context","title":"Business Context is the Missing Piece"}
:::factual
Threat and vulnerability data are broadly available. What makes risk assessment organisation-specific is business context. Sector matters because adversaries, legal obligations, and operational tolerances differ. A finance provider, public hospital, and university can face the same vulnerability but very different consequences. Data classification matters because personal information (PII, meaning personally identifiable information), health records, payment data, and classified material each attract different compliance duties and breach impacts.

Architecture also changes risk posture. Internet-facing SaaS platforms, hybrid enterprise networks, and air-gapped operational technology environments have different attack surfaces and detection options. Existing controls matter: strong identity, segmentation, backups, and incident response can substantially reduce residual risk. Finally, constraints matter. Budget, staffing, and delivery timelines determine treatment realism. Good assessments therefore capture context explicitly instead of assuming a generic "average organisation" baseline that fits nobody.
:::satirical
Public threat feeds and CVE databases are shared by everyone. Your risk profile is not. The missing ingredient is business context: what you do, what you store, what would hurt, and what you can actually fix this quarter. Finance does not face the same regulatory blast radius as education. A clinic holding health data does not have the same breach consequences as a low-sensitivity blog. Same bug, completely different board-level conversation.

Then there is reality: attack surface, existing controls, and resources. An internet-facing SaaS with weak identity controls is not equivalent to an isolated OT system with strict change windows. A team of two analysts cannot execute a "patch everything instantly" plan, regardless of how inspirational the spreadsheet looks. Context is where risk assessment stops being theoretical and starts being useful.
:::endsection

:::section {"tag":"Lifecycle","title":"Risk Assessment vs Risk Management"}
:::factual
Risk assessment and risk management are related but different activities. Assessment identifies and evaluates risks by analysing threats, vulnerabilities, likelihood, and impact. Management decides treatment actions and tracks outcomes over time. Common treatment options are: accept (risk is tolerable), mitigate (implement controls to reduce likelihood or impact), transfer (for example insurance or contractual allocation), and avoid (stop the activity creating the risk).

The Australian Information Security Manual (ISM) aligns with this broader management lifecycle through phases such as define, select, implement, assess, authorise, and monitor. In other words, assessment is an input; management is the governance process that turns analysis into accountable decisions. Teams often over-invest in scoring models but under-invest in ownership, deadlines, and reassessment cadence. A risk without an owner, treatment plan, and review date is documentation, not management.
:::satirical
Assessment is the diagnosis. Management is the treatment plan plus follow-up appointments. Mixing them up is how organisations produce beautiful risk heatmaps and then change absolutely nothing. Assessment tells you what can go wrong and how bad it might be. Management decides whether you accept it, mitigate it, transfer it, or avoid it. Those are business decisions with security input, not just security team homework.

The ISM lifecycle (define, select, implement, assess, authorise, monitor) is a management structure, not a one-off checklist. If you stop at "we assessed it," congratulations, you have produced expensive awareness. If you continue to ownership, treatment, and monitoring, you have risk management.
:::endsection

:::section {"tag":"Measurement","title":"Qualitative vs Quantitative Risk"}
:::factual
Qualitative risk assessment uses categories such as Low, Medium, High, and Critical. Its strengths are speed and communication clarity, especially for cross-functional decision-making. Its weakness is subjectivity: two teams may rate the same scenario differently without calibrated criteria. Quantitative risk assessment estimates numeric loss, often in currency terms. A classic model uses Annual Loss Expectancy (ALE) = Single Loss Expectancy (SLE) x Annual Rate of Occurrence (ARO). This supports budget and investment analysis but requires stronger data quality assumptions.

Most organisations blend both methods. Qualitative scoring handles broad portfolio triage. Quantitative modelling is applied to high-value decisions such as major architecture changes, cyber insurance strategy, or board-level investment cases. FAIR (Factor Analysis of Information Risk) is the most recognised quantitative framework in cybersecurity and provides structured decomposition of frequency and magnitude. Reference: [https://www.fairinstitute.org/](https://www.fairinstitute.org/).
:::satirical
Qualitative risk is the familiar traffic-light approach: Low, Medium, High, Critical. Everyone understands it quickly, which is why it survives every methodology argument. The downside is that "High" can mean five different things depending on who scored it and how much sleep they got. Quantitative risk tries to put numbers on loss, often with ALE = SLE x ARO (Annual Loss Expectancy equals Single Loss Expectancy times Annual Rate of Occurrence). Harder to do, better for money conversations.

In reality, mature teams use both. Use qualitative ratings to manage the full backlog and keep operations moving. Use quantitative models for the expensive, strategic choices where "trust us, it feels risky" is unlikely to unlock funding. FAIR (Factor Analysis of Information Risk) is the popular framework here because it forces clear assumptions instead of hand-wavy numerology. Reference: [https://www.fairinstitute.org/](https://www.fairinstitute.org/).
:::endsection

:::section {"tag":"Governance","title":"Risk Appetite and Tolerance"}
:::factual
Risk appetite is the total level and type of risk an organisation is willing to pursue or retain in support of objectives. Risk tolerance defines acceptable variation around that appetite for specific activities or systems. These are governance settings set by executive leadership and the board, informed by legal obligations, strategic goals, and stakeholder expectations. Security teams advise, but they do not unilaterally set enterprise appetite.

A practical statement might be: "We accept Medium residual risk for non-critical internal systems but require Low residual risk for systems handling classified or safety-critical data." This turns abstract policy into operational guidance for control selection, exception handling, and escalation. Without explicit appetite and tolerance, teams either over-control low-value systems or under-protect critical assets, both of which waste resources and increase unmanaged exposure.
:::satirical
Risk appetite is how much uncertainty leadership is willing to live with. Risk tolerance is how far individual systems can drift before someone has to escalate. Translation: this is a board and executive conversation, not a "security said no" sticker pack. Security provides evidence and options; leadership chooses trade-offs and owns the consequences.

A useful policy sounds like: "Medium residual risk is fine for non-critical internal services, but systems with classified or safety-critical data must land at Low residual risk." That single line prevents months of argument, because teams know where strict controls are mandatory and where pragmatic acceptance is allowed. No appetite statement means every project negotiates risk from scratch, repeatedly, loudly, and usually late.
:::endsection

:::section {"tag":"Platform","title":"The link42 Approach"}
:::factual
link42 is designed to combine the four inputs that most teams currently manage in separate tools. threat10 contributes threat intelligence context: active adversary behaviour, campaign indicators, and attacker capability trends. patch8 contributes vulnerability exposure and remediation state. rule1 contributes framework-aligned control guidance, including ISM mapping and implementation expectations. System profiles contribute business context: criticality, data sensitivity, architecture, ownership, and constraints.

These inputs are fused into an AI-assisted risk assessment workflow that prioritises recommendations with explicit reasoning, rather than opaque scores. The objective is to reduce analyst time spent stitching evidence together and increase decision confidence for technical leaders and executives. This capability aligns with Phase 5C of the platform roadmap: integrated, explainable, context-aware risk prioritisation that supports both operational triage and governance reporting.
:::satirical
Most security teams already have all the ingredients for risk decisions; they are just scattered across too many dashboards. link42 pulls them together. threat10 tells you who is active and what tactics are trending. patch8 shows where you are exposed. rule1 maps control expectations and framework obligations. System profiles add the business reality: what is critical, what data is sensitive, who owns the system, and what constraints are non-negotiable.

Then the platform does the part people normally do in twelve browser tabs: synthesize evidence, explain the reasoning, and produce prioritised recommendations that humans can challenge or approve. The point is not replacing judgement; it is eliminating avoidable glue work and making trade-offs explicit. This is the intent of link42 Phase 5C: practical, explainable, context-aware risk assessment at platform scale.
:::endsection

:::section {"tag":"Next Steps","title":"Continue Learning"}
:::factual
If you want to apply these concepts in a structured way, continue with formal methodologies and then map them to control frameworks and operational data sources. The sequence below moves from conceptual model to execution detail.
:::satirical
If this all makes sense in theory but feels messy in practice, good news: everyone starts there. Follow the sequence below to move from "interesting model" to "repeatable process people can actually run."
:::endsection
