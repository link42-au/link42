---
title: "STIX & TAXII"
slug: "threat/stix-taxii"
subtitle: "The standards for sharing threat intelligence between organisations and tools"
seoDescription: "Understand STIX and TAXII standards for structured threat intelligence sharing across organisations, platforms, and security tooling."
navigationOrder: 90
category: "Threat Intelligence"
reviewStatus: "unverified"
---
:::section {"tag":"Context","title":"The Problem of Sharing"}
:::factual
Threat intelligence creates value when it can be exchanged quickly and interpreted consistently. Sharing requires both a common language for content and a common transport method for delivery. Without standards, organisations struggle to automate ingestion, correlation, and action.

Before structured standards became common, sharing was frequently ad hoc: PDF reports, email attachments, CSV files, and vendor-specific formats. Those methods are difficult to parse at scale, hard to validate, and often too slow for operational response.
:::satirical
Threat intel only helps if it leaves one inbox and reaches another tool without breaking. That means two things: everyone needs to speak the same format, and everyone needs a consistent way to move data around. Otherwise every integration becomes a custom parsing project nobody asked for.

Before standards, we mostly had artisanal intelligence sharing: PDF reports, CSV dumps, and suspiciously large email attachments. Great for chaos, terrible for automation. If your SOC has to manually normalize every feed, your response speed will always trail attacker speed.
:::endsection

:::section {"tag":"Format","title":"What is STIX?"}
:::factual
STIX stands for Structured Threat Information Expression. It is an open standard from OASIS for representing cyber threat intelligence as structured, machine-readable data. Introductory documentation is available at [https://oasis-open.github.io/cti-documentation/stix/intro.html](https://oasis-open.github.io/cti-documentation/stix/intro.html).

STIX 2.1 defines 18 domain objects and explicit relationships, allowing analysts and systems to describe actors, malware, indicators, campaigns, vulnerabilities, and observed behaviours in a consistent model. This structure supports automation, cross-platform sharing, and better analytic traceability.
:::satirical
STIX, or Structured Threat Information Expression, is the agreed grammar for cyber threat data. It is an OASIS open standard, documented at [https://oasis-open.github.io/cti-documentation/stix/intro.html](https://oasis-open.github.io/cti-documentation/stix/intro.html), and it exists so security tools can exchange intelligence without custom translators for every vendor pair.

STIX 2.1 includes 18 domain objects plus relationship logic, which means you can describe who did what, with which malware, against what target, and how confident you are. It is structured enough for machines and still meaningful for analysts, which is rarer than it should be.
:::endsection

:::section {"tag":"Objects","title":"STIX Objects"}
:::factual
Key STIX domain objects include **Indicator** for detection patterns, **Observed Data** for factual sightings, **Threat Actor** for adversary entities, **Attack Pattern** for behavioural methods, **Malware** for malicious software families, **Campaign** for coordinated activity, **Vulnerability** for known weaknesses such as CVEs, and **Report** for narrative analysis outputs.

Relationship objects connect these entities into usable intelligence graphs. For example, an Indicator may indicate Malware, a Threat Actor may use an Attack Pattern, and a Campaign may target a sector. These links are essential for automation and contextual analysis.
:::satirical
STIX objects are the building blocks of a useful threat story. Indicator is what you can detect. Observed Data is what you actually saw. Threat Actor is who is likely behind it. Attack Pattern is how they operate. Malware is the tooling. Campaign is the coordinated operation. Vulnerability captures the weak point, often tied to a CVE. Report wraps it in analyst narrative.

The magic is in relationship objects. They connect everything so intelligence is not just isolated JSON blobs. You can express that a campaign uses specific malware, that malware maps to an attack pattern, and indicators detect related activity. That connected model is why STIX scales better than flat CSV sharing.
:::endsection

:::section {"tag":"Transport","title":"What is TAXII?"}
:::factual
TAXII stands for Trusted Automated eXchange of Intelligence Information. It is the transport protocol used to exchange STIX content between producers and consumers. Introductory documentation is available at [https://oasis-open.github.io/cti-documentation/taxii/intro.html](https://oasis-open.github.io/cti-documentation/taxii/intro.html).

TAXII supports two sharing models: Collection and Channel. Collection is pull-based, where clients request objects from server-hosted collections, similar to a REST API workflow. Channel is push-oriented, where publishers deliver updates to subscribers. TAXII 2.1 uses HTTPS and JSON for interoperable exchange.
:::satirical
TAXII, short for Trusted Automated eXchange of Intelligence Information, is the delivery system for STIX. If STIX defines what the data looks like, TAXII defines how it gets from one platform to another. The official intro is at [https://oasis-open.github.io/cti-documentation/taxii/intro.html](https://oasis-open.github.io/cti-documentation/taxii/intro.html).

There are two operating modes. Collection is pull: clients ask a server for updates, like a predictable API pattern. Channel is push: publishers send updates to subscribers. TAXII 2.1 runs over HTTPS with JSON, which means existing security and integration tooling can usually support it without heroic custom engineering.
:::endsection

:::section {"tag":"Workflow","title":"How STIX/TAXII Work Together"}
:::factual
STIX and TAXII are complementary. STIX defines the data model and object semantics. TAXII defines the transport layer and API interaction model. In common deployments, a TAXII server hosts collections of STIX objects, and clients poll for updates or subscribe for delivery.

A useful analogy is language and postal service. STIX is the language that ensures both sides interpret the same concepts. TAXII is the delivery mechanism that moves those messages reliably between systems. Together they enable automation across intelligence teams, SIEM, SOAR, and case management workflows.
:::satirical
STIX and TAXII are a matched pair. STIX is the vocabulary and grammar. TAXII is the courier. One defines the message format, the other gets the message delivered. Most implementations expose STIX objects on a TAXII server, then let clients poll or subscribe depending on urgency and architecture.

If you like analogies, STIX is the language and TAXII is the postal service. Without STIX, messages are inconsistent. Without TAXII, messages are hard to move automatically. Together they reduce integration friction and let platforms like SIEM and SOAR consume intel without endless one-off converters.
:::endsection

:::section {"tag":"Adoption","title":"Real-World Usage"}
:::factual
Real-world ecosystems already use these standards. AlienVault Open Threat Exchange (OTX) supports structured intelligence sharing, and MISP supports STIX export for interoperability. Government and national security organisations, including ASD and ACSC channels, use STIX-style sharing for indicators and contextual reporting.

Commercial platforms such as Recorded Future and ThreatConnect import and export STIX data, and many security information and event management (SIEM) and security orchestration, automation, and response (SOAR) platforms can ingest STIX-based feeds. This broad tooling support makes standards-based sharing practical for both small and large teams.
:::satirical
These standards are not theoretical. OTX uses structured threat sharing, MISP can export STIX, and government ecosystems including ASD and ACSC channels distribute indicators in formats aligned to automation. In other words, this is how actual teams move intelligence, not just how standards committees write diagrams.

Commercial tools like Recorded Future and ThreatConnect also support STIX import and export, and most modern SIEM and SOAR stacks can consume those feeds. That matters because it lets teams spend less time on format conversion and more time on analysis, detection, and response decisions.
:::endsection

:::section {"tag":"Limitations","title":"Limitations"}
:::factual
STIX 2.1 can be verbose, and large JSON bundles may be operationally heavy for constrained pipelines. Adoption is also uneven. Many organisations still exchange CSV files, PDFs, or vendor-proprietary data structures. As a result, interoperability often remains partial in mixed environments.

Data quality is another constraint. A standards-compliant feed is not automatically accurate or useful. Confidence scoring, analyst validation, and source evaluation are still essential. In practical terms, garbage in still produces garbage out, even when the schema is correct.
:::satirical
STIX is powerful, but it is not lightweight poetry. The JSON can get large, and some pipelines feel that immediately. Adoption is also patchy. Plenty of teams still ship CSVs and PDFs, so standards-based sharing often coexists with legacy workflows and one-off translators.

Quality is the bigger issue anyway. A perfectly formatted STIX object can still be wrong, stale, or irrelevant. Schema compliance does not replace analyst judgment. If input quality is poor, you just get machine-readable nonsense faster, which is still nonsense.
:::endsection

:::section {"tag":"Next Steps","title":"Continue Learning"}
:::factual
- [**Threat Intelligence Overview**](https://link42.app/learn/threat) — Revisit intelligence sources, actor models, and action workflows.
- [**MITRE ATT&CK**](https://link42.app/learn/threat/mitre-attack) — Learn how attack behaviours map to a common framework.
- [**Explore threat feeds → threat10.link42.app**](https://threat10.link42.app/) — See standards-aligned threat data in threat10.
:::satirical
- [**Threat Intelligence Overview**](https://link42.app/learn/threat) — Revisit intelligence sources, actor models, and action workflows.
- [**MITRE ATT&CK**](https://link42.app/learn/threat/mitre-attack) — Learn how attack behaviours map to a common framework.
- [**Explore threat feeds → threat10.link42.app**](https://threat10.link42.app/) — See standards-aligned threat data in threat10.
:::endsection
