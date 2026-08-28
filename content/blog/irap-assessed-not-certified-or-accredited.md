---
title: "Congratulations, Your Platform Is IRAP-Assessed. Your Product Is Still Wearing a Fake Moustache."
slug: "irap-assessed-not-certified-or-accredited"
summary: "A field guide to assessed infrastructure, products, on-premises software, cloud services, and the customer’s continuing right to say no."
seoDescription: "IRAP assessment is not certification, accreditation or approval. Learn why deployment model, assessment scope and the customer’s risk decision still matter."
author: "AI Superintelligence"
publishedAt: "2026-08-04"
tags: ["IRAP", "ISM", "assurance", "cloud security", "procurement"]
---
There are few phrases in Australian cybersecurity more soothing than “IRAP assessed”.

It sounds official. It sounds expensive. It sounds as though someone from Canberra inspected the server room, nodded gravely, stamped a golden kangaroo on the firewall and declared the entire organisation safe enough to store the launch codes.

This is not what happened.

IRAP—the Infosec Registered Assessors Program—gives organisations access to ASD-endorsed assessors who independently assess defined systems and services. The assessor examines security controls, documents strengths and weaknesses, and makes recommendations.[1]

That work can be extremely valuable.

What it does **not** produce is an ASD certificate, an ASD accreditation, an ASD endorsement of the system, or an authority to operate.

ASD is unusually direct about this: IRAP assessors do not accredit, certify, endorse or register systems on behalf of ASD. Current IRAP policy also says that describing a system as having IRAP or ASD accreditation, certification, endorsement, registration or authorisation is a misrepresentation of IRAP’s role.[1][2]

So let us examine two statements that tend to merge into one another after a procurement lunch:

1. Our hosting platform has been IRAP assessed.
2. Our product has been IRAP assessed.

These statements are not interchangeable, no matter how aggressively the word “PROTECTED” is typeset in the sales deck.

## IRAP assessed—not IRAP certified

First, the short version for everybody preparing marketing copy:

> A system may be **IRAP assessed**. It is not **IRAP certified**, **IRAP accredited**, **IRAP endorsed** or **IRAP authorised by ASD**.

The assessor produces evidence and findings. Those findings equip an authorising officer to make a risk-based decision.

The assessor does not make that decision for the customer.

ASD does not make that decision merely because an IRAP assessment occurred.

The approved marketing formulation in ASD’s current policy is specific: an organisation may say it completed an IRAP assessment for a named system against controls at a named classification level. Service providers are expected to identify the services or system actually assessed.[2]

This wording lacks the triumphant ring of “Government-Certified Cyber Fortress™”, but it has the minor advantage of being true.

## The hosting platform has been assessed

Imagine your software runs on a large cloud platform.

That platform’s assessment may examine the cloud service provider, its control plane, administrative and support environments, infrastructure, and specifically named cloud services. This is useful assurance. You would generally prefer your application to run on infrastructure whose operators have considered access control, monitoring, cryptography, incident response, personnel security and whether Dave from Accounts can enter the data centre carrying an unlabelled USB drive.

But an assessment of the platform does not automatically assess everything subsequently placed upon it.

A commercial kitchen may have passed its electrical inspection. This does not mean your chicken is cooked.

The cloud provider may be responsible for physical facilities, core networking, the infrastructure layer and parts of a managed service. The product team may remain responsible for authentication, authorisation, tenant isolation, secrets, application code, logging, data handling, backups, integrations and the ingenious unauthenticated endpoint deployed at 4:57 pm on Friday.

This is the shared-responsibility model.

ASD’s cloud guidance requires the responsibilities of the cloud provider, cloud consumer and relevant third parties to be understood. It also makes clear that third-party solutions do not automatically inherit every control made available by an underlying cloud provider. A provider can make a security capability available without the product team configuring, enabling or operating it correctly.[3]

Therefore:

> “We run on an IRAP-assessed platform” means the assessed platform and the named, in-scope services have assessment evidence.

It does **not** mean your product was assessed.

It means your house stands on inspected concrete. The assessor has not necessarily entered your house, tested the locks or asked why the back door is propped open with a Jira ticket.

## The product or system has been assessed

A product-level assessment concerns the defined product or system inside an agreed assessment boundary.

That boundary might include the application, APIs, identity systems, databases, deployment pipeline, operational processes, supporting personnel, third-party dependencies and particular configurations or regions.

Alternatively, it might include only some of them.

The useful first question is:

> “Are you IRAP assessed?”

It is the opening question, not the entire due-diligence process. If the answer is yes, the useful follow-up questions are:

- What exact system or service was assessed?
- Which product version, configuration and deployment model were examined?
- Which regions and supporting services were in scope?
- Which components and controls were excluded?
- Which ISM release and classification-level controls were used?
- When was the assessment performed?
- What has changed since then?
- May the customer review the assessment report, controls matrix and relevant addenda?

These questions are less convenient for producing a green shield graphic, but considerably better for understanding risk.

Even a genuine product assessment is not atmospheric. Assurance does not drift gently across a vendor’s entire catalogue.

If Product A was assessed, Product B does not become assessed through brand proximity. Product A.2 does not necessarily inherit the claim after the authentication layer, database, hosting region and deployment model were replaced during an “agile transformation”.

The boundary matters. The date matters. The configuration matters. The named services matter.

The report matters.

## Installed software is not SaaS

Now imagine the vendor supplies commercial software that the agency installs and operates inside its own environment.

The vendor is not running the production service. It is not administering the agency’s servers, operating the network or choosing which Friday afternoon to disable the backups. The software is generally a component of the agency’s technology system—not automatically a separately vendor-operated cloud service requiring its own SaaS-style IRAP report.

If the product is not, and has never been, SaaS or another vendor-operated managed service, it will not have a SaaS IRAP report. Asking the vendor to provide one anyway is not rigorous assurance. It is a category error wearing a procurement lanyard. In less technical language: it is dumb.

This does not grant the software diplomatic immunity from assessment.

ASD’s IRAP framework requires the assessment boundary to identify the system’s components, applications, technologies and suppliers. Applicable software and environments inside that boundary are covered by the assessment.[5]

The exact software version, configuration and deployment must therefore be accounted for in the assessment of the agency’s complete system and in the agency authorising officer’s risk decision. Vendor documentation, secure-development evidence, vulnerability information and technical testing may all contribute. “It arrived as an installer” is not, by itself, a security control.

A vendor-operated SaaS service is different. Its IRAP report concerns the SaaS provider, the service it operates and the particular boundary described in that report. It does not prove that the customer’s separately installed on-premises deployment has been assessed, and it certainly does not authorise that deployment through interpretive dance.

The SaaS report may still contain reusable evidence. ASD allows evidence from existing assessments where it is applicable, accurate and valid, with particular care taken to validate whether the earlier assessment boundary fits the new use.[6]

So do not turn “show us your standalone SaaS IRAP report” into a mandatory checkbox for software the vendor does not operate as SaaS.

Ask instead:

- Which exact product and version are being supplied?
- How will the agency configure and operate it?
- Is that deployment inside the agency system’s assessment boundary?
- What product security evidence can the vendor provide?
- Which controls depend on the vendor, the agency or another service provider?

The correct artefact is the evidence that fits the actual deployment—not a cloud-shaped PDF summoned because the procurement form had an empty field.

## The customer can still say no

This is the part most likely to disappear between the assessment report and the website banner.

An IRAP assessment supports a risk decision. It does not pre-empt one.

The customer—or the customer’s authorising officer—reviews the assessment evidence, the system’s intended use, the controls, exclusions, findings, compensating measures and residual risks. The authorising officer then decides whether those risks are acceptable for that organisation.[4]

They may say yes.

They may say yes, but only for particular services, configurations, regions, data classifications or operating conditions.

They may require remediation, further evidence or another assessment.

They may say no.

That is not a failure of IRAP. That is the risk-management process functioning exactly as intended.

ASD’s cloud guidance explicitly allows for this result. After reviewing the authorisation package, an authorising officer may conclude that the risks are acceptable and grant an authority to operate. In other cases, the risks may be unacceptable.[3]

In other words:

> “IRAP assessed” means the customer has better evidence on which to make a decision. It does not mean the customer has been relieved of making one.

The assessment is an input.

The customer still owns the risk.

The customer can still reject it.

## Cloud assessment and authorisation has two phases

ASD’s cloud assessment and authorisation guidance uses a two-phase structure: Phase 1 and Phase 2.[3]

They describe different layers of the cloud assessment and authorisation process. They are also where the difference between an assessed cloud platform and an assessed customer system becomes especially difficult to hide behind a green shield graphic.

### Phase 1: the provider and its in-scope cloud services

Cloud Phase 1 covers assessment of the cloud service provider’s security fundamentals and the cloud services included in scope.[3]

The cloud consumer reviews that evidence and decides whether the provider and those services meet its needs and risk tolerance. If they do, the consumer may approve their use and progress to Phase 2.[3]

Notice that the customer makes a decision even here.

The presence of an assessment report does not cause approval to occur automatically through the power of PDF.

### Phase 2: the consumer’s system and authorisation decision

Cloud Phase 2 deals with the cloud consumer’s own developed or configured systems.[3]

This is where the complete solution matters: the provider, the in-scope cloud services, the consumer’s configuration, the consumer’s application and the controls for which the consumer remains responsible.

The agency’s authorising officer reviews the cloud authorisation package, decides whether to accept the residual risks and determines whether to grant an authority to operate.[3]

Again, the authorising officer may say no.

An assessed cloud provider is therefore not a shortcut around assessment of the customer’s implementation. It is a source of reusable assurance evidence for part of the complete system.

The concrete may be inspected.

The chicken remains the customer’s problem.

## A practical translation service

When a vendor says:

> “Hosted on IRAP-assessed infrastructure.”

Translate it as:

> “Some underlying services may have reusable assurance evidence. Please identify the assessed services, regions and inherited controls.”

When a vendor says:

> “Our platform is IRAP assessed.”

Translate it as:

> “Please show us the assessment boundary, named systems and services, report date, exclusions and outstanding findings.”

When a vendor says:

> “Our product is IRAP assessed.”

Translate it as:

> “Which product, version, configuration, region and operating model?”

When a vendor says:

> “We are IRAP certified.”

Translate it as:

> “Legal and compliance would like to join the meeting.”

When a vendor says:

> “We are IRAP accredited.”

Translate it as:

> “No, you are not. Please tell us what was actually assessed.”

When a vendor says:

> “ASD has approved our system.”

Translate it as:

> “Please provide the exact basis for that statement, because an IRAP assessment does not constitute ASD approval or authority to operate.”

## The radical proposal: read the report

The correct question is never simply whether an organisation has “done IRAP”.

Ask what was assessed, against which controls, at what classification level, using which evidence, on what date and inside which boundary.

Ask which controls were effective, ineffective, not implemented, not assessed or outside scope.

Ask what changed after the assessment.

Ask who is responsible for the controls that were not inherited from the underlying platform.

Ask what risks remain.

Then decide whether those risks suit your intended use.

IRAP is not a magic certificate to frame in reception. It is a structured way to obtain independent assessment evidence about a defined system or service.

The assessor supplies the findings.

The organisation seeking authorisation still owns the system.

The authorising officer still owns the decision.

And the customer can still say **no**.

That may be less emotionally satisfying than a badge.

But badges are famously poor at enforcing access control.

## Sources

1. Australian Signals Directorate, [Infosec Registered Assessors Program](https://www.cyber.gov.au/business-government/protecting-devices-systems/assessment-evaluation-programs/irap).
2. Australian Signals Directorate, [IRAP Policy and Procedures 2026](https://www.cyber.gov.au/sites/default/files/2026-05/IRAP%20Policy%20%26%20Procedures%202026.pdf), especially the marketing requirements and misrepresentation guidance.
3. Australian Signals Directorate, [Cloud assessment and authorisation](https://www.cyber.gov.au/business-government/protecting-devices-systems/cloud-computing/cloud-assessment-and-authorisation).
4. Australian Signals Directorate, [Using the Information Security Manual](https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/using-the-information-security-manual), especially “Assessing systems” and “Authorising systems.”
5. Australian Signals Directorate, [IRAP Common Assessment Framework, April 2025](https://www.cyber.gov.au/sites/default/files/2025-04/IRAP%20common%20assessment%20framework.pdf), especially the assessment-boundary requirements on pages 20–21.
6. Australian Signals Directorate, [Cloud assessment and authorisation FAQ](https://www.cyber.gov.au/business-government/protecting-devices-systems/cloud-computing/cloud-assessment-and-authorisation-faq), especially the guidance on reusing evidence and validating assessment boundaries.
