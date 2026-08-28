---
title: "MITRE ATT&CK"
slug: "threat/mitre-attack"
subtitle: "A knowledge base of adversary tactics and techniques based on real-world observations"
seoDescription: "Learn how MITRE ATT&CK structures real-world adversary behaviour into tactics and techniques for detection, emulation, and security assessment."
navigationOrder: 80
category: "Threat Intelligence"
reviewStatus: "unverified"
---
:::section {"tag":"Foundations","title":"What is MITRE ATT&CK?"}
:::factual
MITRE ATT&CK stands for Adversarial Tactics, Techniques, and Common Knowledge. It is a globally accessible, open knowledge base maintained by MITRE Corporation and documented at [https://attack.mitre.org/](https://attack.mitre.org/). It captures how adversaries behave in real intrusions, based on observed and documented activity.

ATT&CK is valuable because it standardises language between threat intelligence, detection engineering, incident response, and leadership reporting. Instead of vague statements like "advanced attack activity," teams can reference specific techniques and associated mitigations, improving technical precision and operational coordination.
:::satirical
MITRE ATT&CK, short for Adversarial Tactics, Techniques, and Common Knowledge, is basically a well-maintained encyclopedia of how attackers break into systems. It is free, public, and available at [https://attack.mitre.org/](https://attack.mitre.org/), which is great because nobody needs another proprietary taxonomy war.

The real benefit is shared language. Instead of "we saw suspicious things," teams can say "we observed T1566 activity" and everyone from SOC to management knows what that means. Clear naming does not stop attacks by itself, but it does stop internal confusion from slowing response.
:::endsection

:::section {"tag":"Matrix","title":"The ATT&CK Matrix"}
:::factual
The Enterprise ATT&CK matrix at [https://attack.mitre.org/matrices/enterprise/](https://attack.mitre.org/matrices/enterprise/) is organised by tactics and techniques. Tactics represent adversary goals, the why. Techniques represent implementation methods, the how. Sub-techniques provide finer granularity for detection and analysis.

There are 14 enterprise tactics spanning the attack lifecycle from Reconnaissance to Impact. For example, Initial Access is a tactic, Phishing (T1566) is a technique, and Spearphishing Attachment (T1566.001) is a sub-technique. This structure supports consistent mapping across detections, incidents, and assessments.
:::satirical
The matrix is the part everyone screenshots. It is at [https://attack.mitre.org/matrices/enterprise/](https://attack.mitre.org/matrices/enterprise/) and it separates attacker goals from methods. Tactics are the why, techniques are the how, and sub-techniques are the "exactly which flavor of pain are we discussing" level of detail.

ATT&CK tracks 14 enterprise tactics from Reconnaissance to Impact. Example: Initial Access is the goal, Phishing (T1566) is the method, and Spearphishing Attachment (T1566.001) is the specific variant. That hierarchy is why ATT&CK works for both high-level reporting and gritty detection tuning.
:::endsection

:::section {"tag":"Tactics","title":"Tactics Explained"}
:::factual
- **Reconnaissance** — Adversaries gather information about targets before engaging.
- **Resource Development** — Adversaries build or acquire infrastructure, tools, and accounts.
- **Initial Access** — Adversaries gain an initial foothold in the target environment.
- **Execution** — Adversaries run malicious code in victim systems.
- **Persistence** — Adversaries maintain access across restarts or credential changes.
- **Privilege Escalation** — Adversaries obtain higher permissions for broader control.
- **Defense Evasion** — Adversaries avoid detection and bypass security controls.
- **Credential Access** — Adversaries steal passwords, tokens, or authentication secrets.
- **Discovery** — Adversaries map hosts, users, and services inside the environment.
- **Lateral Movement** — Adversaries move from one system to another.
- **Collection** — Adversaries gather data relevant to their objective.
- **Command and Control** — Adversaries communicate with compromised systems remotely.
- **Exfiltration** — Adversaries transfer stolen data out of the environment.
- **Impact** — Adversaries disrupt, destroy, or manipulate operations and data.
:::satirical
- **Reconnaissance** — They research you first, because chaos still needs planning.
- **Resource Development** — They set up domains, tooling, and fake identities before launch.
- **Initial Access** — They get in through phishing, exploits, or weak access controls.
- **Execution** — They run code where your defenders really wish they would not.
- **Persistence** — They install ways to stay even after cleanup attempts.
- **Privilege Escalation** — They turn limited access into admin-level power.
- **Defense Evasion** — They hide activity and sidestep your security controls.
- **Credential Access** — They steal secrets that unlock more systems.
- **Discovery** — They inventory your network like unwelcome consultants.
- **Lateral Movement** — They hop between systems hunting high-value assets.
- **Collection** — They gather whatever data supports monetisation or mission goals.
- **Command and Control** — They keep remote control channels alive.
- **Exfiltration** — They move stolen data out before anyone notices.
- **Impact** — They encrypt, erase, alter, or otherwise break things deliberately.
:::endsection

:::section {"tag":"Operations","title":"How to Use ATT&CK"}
:::factual
MITRE guidance at [https://attack.mitre.org/resources/getting-started/](https://attack.mitre.org/resources/getting-started/) highlights four common use cases. **Detection and Analytics** maps rules and telemetry to specific techniques. **Threat Intelligence** uses ATT&CK to describe adversary behaviour consistently. **Adversary Emulation** simulates realistic attack paths for purple teaming and validation. **Assessment** measures defensive coverage and identifies control gaps.

Using ATT&CK effectively requires continuous refinement. As detections mature and adversary behaviour changes, mappings and test scenarios should be updated. Teams that treat ATT&CK as a living framework generally achieve stronger detection quality and more defensible reporting to stakeholders.
:::satirical
MITRE's getting-started guide at [https://attack.mitre.org/resources/getting-started/](https://attack.mitre.org/resources/getting-started/) boils usage into four practical modes. Detection and Analytics tells you what you can actually see. Threat Intelligence gives everyone common labels. Adversary Emulation tests whether controls work outside slideware. Assessment shows where your coverage is thin.

ATT&CK only helps if you keep it current. Attackers change, tooling changes, and your environment definitely changes. Update mappings, retest assumptions, and measure improvements over time. Otherwise you end up with a beautiful matrix snapshot that was accurate two quarters ago.
:::endsection

:::section {"tag":"Tooling","title":"ATT&CK Navigator"}
:::factual
ATT&CK Navigator at [https://mitre-attack.github.io/attack-navigator/](https://mitre-attack.github.io/attack-navigator/) is an interactive interface for visualising ATT&CK coverage. Teams use it to create heat maps, compare group technique usage, and track progress across control uplift programs.

Navigator layers are particularly useful for communicating with mixed audiences. Analysts can model detailed detection status, while leadership can view high-level capability gaps. This improves prioritisation by linking technical debt to adversary-relevant exposure.
:::satirical
ATT&CK Navigator at [https://mitre-attack.github.io/attack-navigator/](https://mitre-attack.github.io/attack-navigator/) is where your matrix turns into readable heat maps instead of wall-sized spreadsheets. You can compare actor behavior, map your detections, and spot weak coverage fast.

It is also handy for translating engineer speak into leadership speak. Analysts get detail; decision-makers get a clear visual of what is covered and what is not. Fewer misunderstandings, better prioritisation, less "we thought this was already done" at governance meetings.
:::endsection

:::section {"tag":"Australia","title":"ATT&CK and the ISM"}
:::factual
ATT&CK can support Australian Information Security Manual (ISM) implementation by connecting adversary behaviours to specific control outcomes. For example, T1566 Phishing maps directly to controls on email filtering, user awareness, and malicious content handling.

Cross-framework mapping resources from the Center for Threat-Informed Defense are available at [https://center-for-threat-informed-defense.github.io/mappings-explorer/](https://center-for-threat-informed-defense.github.io/mappings-explorer/), including links between ATT&CK and NIST SP 800-53 controls. These mappings help teams justify control investments with threat-informed evidence.
:::satirical
ATT&CK is useful for ISM work because it answers the classic question: "Which controls reduce which attacker behaviors?" Take T1566 Phishing. You can tie it to practical controls like email filtering and user awareness training, then measure if that risk is actually shrinking.

The mappings explorer at [https://center-for-threat-informed-defense.github.io/mappings-explorer/](https://center-for-threat-informed-defense.github.io/mappings-explorer/) helps connect ATT&CK to frameworks like NIST SP 800-53. That is useful when budget owners ask for proof that control spend maps to real-world threats rather than generic compliance checklists.
:::endsection

:::section {"tag":"Next Steps","title":"Continue Learning"}
:::factual
- [**STIX & TAXII**](https://link42.app/learn/threat/stix-taxii) — Learn how ATT&CK-aligned intelligence is packaged and shared between systems.
- [**Threat Intelligence Overview**](https://link42.app/learn/threat) — Revisit source quality, actor tracking, and operational integration.
- [**Explore threat data → threat10.link42.app**](https://threat10.link42.app/) — Explore ATT&CK-relevant threat data in threat10.
:::satirical
- [**STIX & TAXII**](https://link42.app/learn/threat/stix-taxii) — Learn how ATT&CK-aligned intelligence is packaged and shared between systems.
- [**Threat Intelligence Overview**](https://link42.app/learn/threat) — Revisit source quality, actor tracking, and operational integration.
- [**Explore threat data → threat10.link42.app**](https://threat10.link42.app/) — Explore ATT&CK-relevant threat data in threat10.
:::endsection
