---
title: "Why Users Don’t Use Privacy (Yet): Insights from On-Chain Privacy Experience"
description: "This research examines why on-chain privacy tools see low adoption despite strong user interest, focusing on how different user profiles experience emerging privacy products. Interviews reveal that confusion about privacy guarantees, heavy and technical setup, unsafe defaults, and lack of trust/verification drive drop-off, pointing to a need for privacy UX that is transparent, testable, and human-centered rather than power-user-only."
date: "2025-12-02"
authors:
  - "Nicole Yeh"
tags:
  - privacy
  - user experience
  - privacy experience
cover: "/privacy-experience-report.webp"   # only if post uses a cover image
---

## Purpose of the Research

Despite growing awareness of on-chain privacy, adoption of privacy tools remains low. Many users say they care about privacy but invest little effort in it, often finding existing tools too complex or opaque.

This research explored how users with different technical backgrounds and privacy needs experience emerging privacy-focused products.

Our **hypothesis** was that privacy UX needs differ by both user profile and use case, and that a one-size-fits-all approach limits adoption. We sought to map user journeys, uncover pain points, and identify both design opportunities and technical challenges to improve the overall experience.

## **Key Findings and Pain Points**

Through qualitative interviews, we identified recurring themes across all tools tested:

1. **Unclear Privacy Boundaries:** Users misunderstood what was actually private and when. Many assumed “shielded” meant fully anonymous.
2. **Trust Without Proof:** Users relied on project reputation rather than verifiable evidence; they wanted on-chain or third-party proof of trustworthiness.
3. **Overly Technical Setup:** Both technical and non-technical users found setup flows cognitively heavy and error-prone, often requiring advanced steps (ENS, RPCs, manual deployment).
4. **Unsafe Defaults and Feedback Gaps:** Privacy options were hidden or defaulted to public. Users wanted visible privacy indicators and persistent confirmations.
5. **Verification Anxiety:** Fear of irreversible actions made users hesitant to use or test privacy tools with real funds.
6. **Context-Specific Privacy Motivation:** Users desired privacy for specific scenarios (e.g., voting, large transfers) rather than universally.
7. **Educational Gaps:** Even advanced users struggled with the concepts (stealth addresses, relayers, shielded votes), highlighting the need for layered, human-readable explanations.
8. **Desired Qualities:** Transparency, control, safety nets (test modes), and project longevity consistently built confidence.

## **Overall Conclusion**

Users don’t reject privacy, they reject *invisible, unverified, or cognitively heavy privacy*. To expand adoption, privacy tools must evolve from “power-user cryptography” to *trustable, testable, and human-centered infrastructure.*

## **Acknowledgements**

This study would not have been possible without the pioneering work of the privacy projects we examined: **Fluidkey, Railgun, Privacy Pool, Flashbots,** and **Shutter (Shielded Voting DAO)**.

These projects represent the forefront of privacy innovation in the Ethereum ecosystem. Our intention is not to critique, but to learn from the leaders who are already shaping the future of private, verifiable, and user-respecting blockchain experiences. We are deeply grateful for their ongoing efforts to make privacy usable and accessible for all.

---

## Methodology

We conducted **five one-on-one qualitative interviews** to explore how users interact with different privacy-focused on-chain tools and to understand their perceptions, challenges, and motivations around using them.

Each participant was assigned **one privacy product**—either MEV Protection (Flashbots), Shielded Voting DAO, Privacy Pool, Fluidkey, or Railgun, along with a **specific usage task** (e.g., *create an account and deposit funds*). Participants were asked to **think aloud** as they completed the task, while the interviewer observed and probed to clarify their reasoning, expectations, and emotional responses.

Following the task, participants reflected on their **overall experience**, discussing what felt intuitive or confusing, what built or reduced trust, and whether they would consider using the tool again—and under what circumstances.

## Thematic affinity mapping

1. *Grouping similar sentiments like “Confusing trust boundary” or “Fear of revealing info unknowingly”*
2. *Color coding for which product each feedback came from — that way you can see patterns across categories*

### **Pattern 1: Confusion Around What’s Actually Private**

*Behavior: Users frequently misunderstood what data or actions were protected versus exposed.*

- Many assumed “shielded” meant *full anonymity*, only to discover that votes or transactions were private *temporarily* or *partially*.
- Participants were unsure when privacy applied. E.g., whether frontends, relayers, or RPCs could still leak information.

**Quotes & Evidence:**

> “I thought shielded would mean my vote would always be private… weird that I had to hover to see details.”
> 

![Snapshot UI](public/articles/privacy-experience-report/snapshot-UI1.webp)

Snapshot UI

> “There are so many leaks if I’m using Alchemy… what is the point?”
> 

![Privacy Pool Github](public/articles/privacy-experience-report/Privacy-Pool-Github_1.webp)

Privacy Pool Github

**Design implication:**

→ Tools need **explicit, contextual privacy indicators** (e.g., *“Your address is hidden until reveal phase”*) and **plain-language explanations** of privacy boundaries.

### **Pattern 2: Lack of Trust Transparency**

*Behavior: Trust decisions were driven by brand reputation, not by verifiable or visible assurances.*

- Users “trusted” Flashbots or Railgun because they’d heard of them, not because the interface provided proof.
- Even technically advanced users questioned how much custody or data the service retained.

**Quotes:**

> “I trusted Shutter because the personal risk is low and I’ve heard of them, not because the UI proved anything.”
> 

> “I’ve heard of Railgun before, so I’d trust it a little bit more”
> 

> “If the last release was three months ago and not many stars, I don’t feel confident.”
> 

![Railgun Github](public/articles/privacy-experience-report/Railgun-Github_1.webp)

Railgun Github

> “Only you and Fluidkey can see all your transactions… Fluidkey team? Operator? What does that mean?”
> 

![Fluidkey UI](public/articles/privacy-experience-report/Fluidkey-UI_1.webp)

Fluidkey UI

**Design implication:**

→ Build **visible trust cues** (audits, social proof, age of project) and integrate **verifiable trust mechanisms** like on-chain proofs or audit links.

### **Pattern 3: Overly Technical Setup and Cognitive Overload**

*Behavior: Participants found setup flows fragmented, verbose, or opaque, especially when required to buy ENS, deploy tokens, or manage RPCs.*

- Even power users noted “a ton of clicks and signatures” with little feedback on what each did.
- Non-technical users struggled to understand why new wallets, seeds, or denominations were needed.

**Quotes:**

> “There were a ton of clicks and signatures, I didn’t even know what I was agreeing to.”
> 

> “Why do I need to buy an ENS just to test?”
> 

![Snapshot UI](public/articles/privacy-experience-report/Snapshot UI_2.webp)

Snapshot UI

![Snapshot UI](public/articles/privacy-experience-report/Snapshot UI_3.webp)

Snapshot UI

> “I would never trust online generated seed, that’s the basic of crypto security.”
> 

![Privacy Pool UI](public/articles/privacy-experience-report/Privacy Pool UI.webp)

Privacy Pool UI

**Design implication:**

→ Simplify setup with **guided onboarding**, **progressive disclosure**, and **test modes** for safe experimentation.

### **Pattern 4: Usability Frictions: Defaults, Navigation, and Feedback**

*Behavior: Users struggled with hidden controls, unclear defaults, and missing confirmations.*

- Privacy options were buried (“tiny text in the Voting tab”).
- Defaults often undermined privacy (“Any” = public).
- Feedback was fleeting or unclear (“confirmation disappears too fast”).

**Quotes:**

> “Defaults matter, it should default to shielded.”
> 

> “Where are the privacy controls? It’s just this tiny text.”
> 

![Snapshot/Shutter UI](public/articles/privacy-experience-report/Snapshot_Shutter UI_1.webp)

Snapshot/Shutter UI

> “If it’s private by default, that’s perfect. I shouldn’t have to think about it.”
> 

![Flashbot UI](public/articles/privacy-experience-report/Flashbot UI_1.webp)

Flashbot UI

**Design implication:**

→ Adopt **privacy-by-default**, ensure **clear visual status indicators**, and maintain **persistent confirmation messages** for key actions.

### **Pattern 5: Verification Anxiety and Fear of Loss**

*Behavior: Users feared doing irreversible or unverified actions (e.g., sending funds or proofs without visible confirmation).*

- Several wanted test modes or dry runs before risking real funds.
- Even confident users double-checked contract addresses or waited to see funds reappear.

**Quotes:**

> “There’s no testing mode. I wouldn’t send 1 ETH through something untested.”
> 

![Flashbot UI](public/articles/privacy-experience-report/Flashbot UI_2.webp)

Flashbot UI

> “I want to see the contract before confirming the transaction.”
> 

![Etherscan of Privacy Pool tx](public/articles/privacy-experience-report/Etherscan of Privacy Pool tx.webp)

Etherscan of Privacy Pool tx

![Privacy Pool contract on Etherscan](public/articles/privacy-experience-report/Privacy Pool contract on Etherscan.webp)

Privacy Pool contract on Etherscan

> “I wouldn’t download something random, even on this machine.”
> 

![Railgun UI](public/articles/privacy-experience-report/Railgun UI_1.webp)

Railgun UI

**Design implication:**

→ Provide **sandbox or test networks**, **verifiable confirmations**, and **transaction visibility before finalization**.

### **Pattern 6: Context-Specific Privacy Motivation**

*Behavior: Motivation to use privacy tools varied by context.*

- Some wanted privacy for governance (voting), others only for large transfers or identity separation.
- “Compliant privacy” was seen by technical users as “not real privacy.”

**Quotes:**

> “Compliant privacy is like giving up, it’s not really privacy at all.”
> 

> “For large fund transfers I’d plan ahead, so waiting isn’t a big issue.”
> 

![Privacy Pool UI](public/articles/privacy-experience-report/Privacy Pool UI_2.webp)

Privacy Pool UI

**Design implication:**

→ Offer **flexible privacy levels** and **context-aware defaults** that adapt to intent (e.g., governance vs payments).

### **Pattern 7: Educational Gaps and Mental Model Mismatches**

*Behavior: Even advanced users struggled to articulate how features like stealth addresses, shielded voting, or relayers work.*

- Ambiguous labels (“Power user,” “Shielded,” “ASP”) created anxiety or alienation.
- Users appreciated inline explanations and step-by-step guidance.

**Quotes:**

> “A normal user probably doesn’t know what stealth addresses are, even I’m not sure I could define it.”
> 

![Fluidkey UI](public/articles/privacy-experience-report/Fluidkey UI_3.webp)

Fluidkey UI

> “‘Power user’ makes me feel like maybe I’m not technical enough.”
> 

![Fluidkey UI](public/articles/privacy-experience-report/Fluidkey UI_4.webp)

Fluidkey UI

**Design implication:**

→ Use **layered education** (simple upfront, expandable detail), avoid jargon, and provide **interactive onboarding tours**.

### **Pattern 8: Desired Qualities in Privacy Tools**

*Behavior: Across all interviews, users consistently valued:*

- **Transparency:** showing what’s happening
- **Control:** ability to verify and customize
- **Safety nets:** test modes, confirmations, and clear recovery paths
- **Reputation & longevity:** older, audited, widely used projects feel safer

**Quotes:**

> “Anything that makes me feel a little bit more safe is important, like links to audits, social proof.”
> 

![Fluidkey UI](public/articles/privacy-experience-report/Fluidkey UI_5.webp)

Fluidkey UI

> “Older apps that have been around longer feel safer.”
> 

**Design implication:**

→ Frame privacy as *trustable infrastructure* — emphasizing stability, safety, and proof over abstraction.

## Map to p**ain points vs opportunities and provide design suggestions**

*Summarize the themes we identified as pain points and opportunities*

| Theme | Core Pain Point | Design Opportunity |
| --- | --- | --- |
| 1. Clarity of privacy scope | Users can’t tell what’s private | Add visible privacy indicators |
| 2. Trust verification | Users rely on brand, not proof | Include audits and on-chain verifiability |
| 3. Technical friction | Setup is complex | Simplify and guide onboarding |
| 4. Default behaviors | Wrong defaults expose users | Privacy-by-default UI |
| 5. Fear of loss | Lack of testing or visibility | Provide test mode and confirmations |
| 6. Varying privacy motivation | Context-dependent needs | Offer adaptive privacy modes |
| 7. Education & communication | Jargon-heavy UX | Layered explanations, plain language |

## **Call to Action: Shaping the Future of On-Chain Privacy**

This research is an open invitation to the ecosystem. We hope designers, developers, researchers, and privacy advocates can collaborate in addressing the challenges uncovered here.

**Contribute to Future Work:**

1. **Identify Technical Challenges**
    
    Many user pain points appear UX-related but are rooted in deep technical limitations. Building verifiable privacy, safe testing, and seamless defaults requires cryptographic innovation, infrastructure evolution, and better developer tooling.
    
2. **Expand Quantitative Understanding**
    
    Complement this qualitative study with large-scale quantitative analysis (We’re actively collecting responses at Devconnect! Fill out [the survey here](https://pad.ethereum.org/form/#/2/form/view/IFZv0NuHEXd-eqIBh0o+C88F9V6+WVcBGKEb1d2LJcE/) for us to better understand your perspective on privacy tools). Measure and prioritize privacy needs, attitudes, and usage barriers across user segments. Like technical vs. non-technical, high vs. low privacy motivation, guiding where investment will have the most impact.
    
3. **Prototype and Share Solutions**
    
    Pilot “privacy-by-default” interfaces, testnet-safe flows, and verifiable trust cues. Publish learnings openly to accelerate shared progress.
    
4. **Build an Open Privacy UX Community**
    
    If you’re a designer, developer, or researcher passionate about privacy experience, contribute ideas, case studies, or experiments. Together, we can make privacy a *default expectation,* but not an afterthought.
    
5. **Broaden Role and Feature Coverage**
This study focused on specific user roles and product features. For instance, DAO managers in governance tools or deposit flows in privacy wallets. Future research should explore the full ecosystem of participants and functionalities to provide a more holistic view of the Privacy Experience (PX) across contexts.
