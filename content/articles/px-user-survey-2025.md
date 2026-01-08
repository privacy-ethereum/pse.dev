---
title: "Privacy Experience User Survey"
description: "This report extends our prior qualitative research with a user survey on the current state of privacy on Ethereum, including how people perceive, trust, and adopt privacy tools."
date: "2026-01-08"
authors:
  - "Privacy Experience"
tags:
  - privacy
  - user experience
  - privacy experience
image: "/articles/privacy-experience-report/privacy-experience-report.webp"
---

This quantitative survey (75 respondents) builds directly on our earlier **qualitative research on privacy experience on Ethereum** ([Link to the qualitative report](https://pse.dev/blog/privacy-experience-report)), which identified seven core themes shaping how users perceive, trust, and adopt privacy tools. This report should be read as a continuation of that work: the survey was designed to **test, validate, and size those qualitative hypotheses** across a broader and more diverse set of experienced Ethereum users.

**Key takeaways at a glance:**

- **Privacy is non-negotiable, but current solutions fall short.**
    - Privacy importance is rated **high (3.3 / 4)**, while satisfaction is **low (1.7 / 4)**.
    - Users are moderately confident today (**2.4 / 4**) but pessimistic about the future (**1.9 / 4**).
- **The adoption gap is driven by experience failures, not lack of interest.**
    - **86%** of respondents have abandoned a privacy flow at least once.
    - The top blocker is **complexity and usability (58%)**, far outweighing cost or regulation.
- **Active privacy tools are widely tried, but rarely habitual.**
    - Tools requiring manual steps (mixers, stealth addresses, shielded pools) have **~70% reach** but only **~15–17% habitual use**.
    - Passive or background tools (private mempools, RPCs) reach fewer users but are **significantly stickier**.
- **Users strongly prefer privacy by default.**
    - **73%** prefer systems that are *private by default with an option to share*.
    - “Missing in my wallet” is a top blocker, pointing to the need for wallet-native privacy.
- **Trust depends on verifiability and clarity, not branding.**
    - The strongest trust signals are **open-source code (61%)**, clear documentation and architecture (~46%), and **transaction previews/simulations (52%)**.
    - Social proof and marketing rank much lower.
- **Trade-offs reveal clear limits.**
    - Users are willing to trade **time** (69% will wait a few extra minutes) and tolerate limited extra steps.
    - They resist **higher fees, network switching, and compatibility breaks**, which sharply reduce adoption.
- **Confidence does not equal capability.**
    - Segmentation shows that even highly capable users frequently abandon privacy flows.
    - The *low confidence / high capability* group exhibits the **highest abandonment (~90%)**, highlighting verification anxiety and mental model gaps as critical issues.

The findings reinforce a central conclusion from the qualitative phase: **the gap in privacy adoption is not caused by lack of interest, but by experience failures**. Users overwhelmingly consider privacy *very important*, yet remain dissatisfied with current solutions. Complexity, unclear guarantees, and verification anxiety dominate abandonment, while a strong majority prefer **privacy by default** rather than opt-in flows.

---

## 0. Who This Survey Represents

Before interpreting the results, it is important to clarify **who these findings describe**.

This survey reflects a highly experienced, technically skewed Ethereum audience:

- **Total responses:** 75
- **Ethereum tenure:** 92% have been involved for **3+ years**; 15% for **9+ years**
- **Activity level:** ~50% interact with Ethereum daily; another ~30% weekly
- **Roles:** Developers, researchers, and security professionals make up over half of respondents

This context matters. If privacy tools are frequently abandoned or misunderstood by this group, the usability barrier for less experienced users is likely significantly higher.

## 1. Clarity of Privacy Scope: High Importance, Low Confidence

<aside>

**💬 Qualitative themes referenced:**

- Theme 1: Clarity of privacy scope
- Theme 5: Verification anxiety
- Theme 7: Educational & mental model gaps

**Qualitative hypothesis:** Users believe they understand what is private on-chain, but struggle to accurately identify what is hidden, visible, or still inferable.
</aside>

**Quantitative results:**

- **Importance of privacy:** **3.3 / 4** (High)
- **Satisfaction with current privacy:** **1.7 / 4** (Low, net dissatisfied)
- **Confidence in current privacy guarantees:** **2.4 / 4** (Moderate)
- **Confidence privacy will remain intact in the future:** **1.9 / 4** (Low)

Despite high experience levels, confidence remains limited. Users care deeply about privacy, but do not feel secure that they understand or can rely on existing protections.

**Interpretation:** This validates the qualitative finding that privacy tools fail to clearly communicate scope. Users are not rejecting privacy, they are uncertain what they are actually getting.

## 2. Motivation: Privacy as Control, Not Secrecy

<aside>

**💬 Qualitative themes referenced:**

- **Theme 6:** Context-specific motivation

**Qualitative hypothesis:** Privacy is primarily about control and selective disclosure, not anonymity for its own sake.

</aside>

**Quantitative results (free-text + ranking):**

Users consistently frame privacy as:

- **Control:** choosing what is revealed, to whom, and when
- **Freedom:** a digital extension of fundamental rights
- **Security hygiene:** protection against scams, extortion, profiling, and physical risk

**Top motivations:**

1. Personal safety & security (~60%)
2. Anti-profiling / identity separation (~55%)
3. Asset and balance protection (~50%)

**Top perceived risks:**

- Targeted attacks and scams
- Loss of funds or access
- Surveillance by governments or large platforms

**Interpretation:** The survey confirms that privacy demand is principled and pragmatic, not ideological or fringe, aligning directly with qualitative insights.

## 3. Usage: Widely Tried, Rarely Habitual

<aside>

**💬 Qualitative themes referenced:**

- **Theme 3:** Technical friction
- **Theme 4:** Usability and defaults

**Qualitative hypothesis:** Active, multi-step privacy tools introduce friction that prevents habitual use.

</aside>

**Quantitative results:**

A clear pattern emerges:

- **Active tools** (stealth addresses, mixers, shielded pools) have **high reach (≈70%)** but **low habitual use (≈15–17%)**
- **Passive or infrastructure tools** (private mempools, RPCs) have lower reach (~50%) but higher daily usage (~23%)

| **Tool Category** | **Reach** | **Habit** | **Usage** |
| --- | --- | --- | --- |
| **Stealth / One-time Addresses** | **73%** (54 users) | 15% (11 users) | Wide but Sporadic |
| **Mixers or Privacy Pools** | **70%** (52 users) | 17% (13 users) | Wide but Sporadic |
| **Shielded Pools** | **69%** (51 users) | 17% (13 users) | Wide but Sporadic |
| **ZK Identity / Proofs** | 68% (50 users) | 16% (12 users) | Wide but Sporadic |
| **Private Mempools / MEV** | 68% (50 users) | **23%** (17 users) | Stickier |
| **Private Voting** | 59% (44 users) | 9% (7 users) | Sporadic |
| **Private L2s / Rollups** | 57% (42 users) | 13% (10 users) | Moderate |
| **Private Relayers** | 54% (40 users) | 9% (7 users) | Sporadic |
| **Private / Custom RPCs** | 51% (38 users) | **23%** (17 users) | Niche Stickier |

![image.png](/articles/privacy-experience-report/px-usage.png)

**Interpretation:** The moment privacy requires users to leave their normal flow, usage drops sharply. Privacy that runs in the background is more likely to stick.

## 4. Technical Friction: Usability Is the Primary Blocker

<aside>

**💬 Qualitative themes referenced:**

- **Theme 3:** Technical friction
- **Theme 5:** Verification anxiety

**Qualitative hypothesis:** Complexity and lack of clarity outweigh cost or regulation as adoption barriers.

</aside>

**Quantitative results:**

Top blockers:

- **Complex or hard to use:** 58% (43 votes)
- High gas costs: 32% (24 votes)
- Regulatory uncertainty: 31% (23 votes)
- Missing in wallet or favorite dapps: 30% (22 votes)

Additional signals:

- **~86%** of respondents have abandoned a privacy flow at least once
- Top reasons: confusion and uncertainty about safety
- The most requested feature **with 74% of all users**, is to **have private sends as default** in existing wallets

**User quotes**

- *"I need a switch in my wallet to turn on private mode."*
- *"Unclear what it would do... Unsure the tool was safe."*
- *"Native wallet support for stealth addresses... making privacy seamless like HTTPS."*

**Interpretation:** This strongly confirms the qualitative finding that privacy UX is fragile. Abandonment is the norm, not the exception.

---

## 5. Trade-offs: Time Is Acceptable, Workflow Breakage Is Not

<aside>

**💬 Qualitative themes referenced:**

- **Theme 3:** Technical friction
- **Theme 6:** Context-specific motivation

**Qualitative hypothesis:** Users are willing to trade speed for privacy, but not cost or workflow disruption.

</aside>

Users are willing to trade **time**, but not **cost or workflow disruption**:

- 69% will wait a few minutes longer
- 53% accept 2–3 extra screens
- Only ~25% accept higher fees or network switching

| **Trade-off** | **Votes** | **Percentage** | **Verdict** |
| --- | --- | --- | --- |
| **Wait up to a few minutes longer** | **47** | **69.1%** | **😍 Highly Acceptable** |
| 2–3 extra confirmations or screens | 36 | 52.9% | 🙂 Acceptable |
| Using a separate wallet or account | 26 | 38.2% | 😐 Borderline |
| Signing multiple transactions | 18 | 26.5% | ☹️ High Friction |
| Switching to a different network or L2 | 18 | 26.5% | ☹️ High Friction |
| Pay up to ~5% more in fees | 17 | 25.0% | ☹️ High Friction |
| Lower compatibility with some dapps | 8 | 11.8% | 😡 Unacceptable |
| Withdrawal delays up to 1 day | 8 | 11.8% | 😡 Unacceptable |
| Fixed deposit/withdrawal sizes | 6 | 8.8% | 😡 Unacceptable |

**Interpretation:** Privacy can be slower, but it must remain affordable and integrated into existing workflows.

---

## 6. Trust & Verification: Don’t Trust, Verify (But Make It Legible)

<aside>

**💬 Qualitative themes referenced:**

- **Theme 2:** Trust transparency
- **Theme 5:** Verification anxiety

**Qualitative hypothesis:** Users want verifiable guarantees, but struggle to interpret technical proofs without clear UX support.

</aside>

**Quantitative results:**

Top trust signals (See appendix 3 for the full table):

- Open-source code (61%)
- Clear docs and architecture explanations (~46%)
- Transaction previews/simulations (52%)

Social proof and branding rank significantly lower.

| **Top 5 Trust Factors** | **Votes** | **Percentage** |
| --- | --- | --- |
| **Open-source code** | **45** | **60.8%** |
| Clear docs on how it works | 34 | 45.9% |
| Transparent architecture | 34 | 45.9% |
| Clear explanation of trade-offs | 34 | 45.9% |
| Referrals or endorsements from trusted people | 20 | 27.0% |

**Interpretation:** Users want verification, but only if it is surfaced in human-readable ways. Trust must be designed into the interface, not outsourced to reputation. 

---

## 7. Confidence vs Capability: Why Adoption Fails Even for Experts

<aside>

**💬 Qualitative themes referenced:**

- **Theme 3:** Technical friction
- **Theme 5:** Verification anxiety
- **Theme 7:** Educational & mental model gaps

**Qualitative hypothesis:** Capability does not guarantee confidence; experienced users still hesitate without clear confirmation and mental models.

</aside>

![Confidence vs capability in crypto privacy.png](/articles/privacy-experience-report/px-confidence.png)

To synthesize multiple themes, we segmented users by **confidence** and **capability**:

- **High confidence / High capability (36.5%):** still abandon flows ~70% of the time
- **High confidence / Low capability (31.1%):** optimism without practice
- **Low confidence / High capability (13.5%):** *highest abandonment (~90%)* and lowest trust
- **Low confidence / Low capability (18.9%)**

**Interpretation:** Technical skill does not eliminate anxiety. The most capable users are often the most cautious, reinforcing that adoption failure is driven by unclear guarantees and weak mental models, not lack of education.

---

## Synthesis: What Quantative + Qualitative Together Tell Us

Across both research phases, the same story repeats:

- Privacy demand is high and principled
- Satisfaction and confidence are low
- Friction and ambiguity dominate behavior
- Defaults, previews, and clarity matter more than cryptographic sophistication alone

---

## Actionable Recommendations (Community Invitation)

This research points to challenges that cannot be solved by any single team or protocol. We see these recommendations as **invitations to the Ethereum community** (wallet teams, protocol developers, UX designers, researchers, and educators) to collaborate on improving the privacy experience together. 

1. **Wallet-native privacy primitives**
    - Private send / receive as first-class wallet features
    - Shared UX patterns for privacy presets (e.g., Quick Private, Maximum Privacy)
2. **Standardized privacy scope visualization**
    - Community-aligned patterns for showing what is hidden, visible, and inferable
    - Reusable components for transaction privacy previews and confirmations
3. **Confidence-building UX patterns**
    - Sandbox or test modes for private transactions
    - Progressive disclosure designs that support anxious power users
4. **Shared trust and verification standards**
    - Common transparency checklists (open source, architecture, simulations)
    - Consistent terminology across wallets and dapps
5. **Passive-by-default privacy infrastructure**
    - MEV protection, private RPCs, and address hygiene as defaults
    - Tooling that works without requiring behavior changes
6. **Context-aware privacy design**
    - Prioritize financial and identity-linked actions first
    - Explore programmable privacy for compliance-friendly use cases

We invite builders and researchers to experiment with these directions, share learnings, and help define what “usable privacy” should look like on Ethereum.

1. **Make privacy native:** integrate private sends and protections directly into wallets
2. **Expose privacy scope clearly:** show what is hidden, visible, and inferable
3. **Add previews and confirmations:** reduce verification anxiety
4. **Design for anxious power users:** sandbox modes, progressive disclosure, safe defaults
5. **Standardize trust signals:** consistent transparency across tools
6. **Favor passive protections:** private infrastructure as default
7. **Respect context:** prioritize financial and identity-linked actions

---

## Conclusion

This quantitative survey validates, and strengthens our earlier published qualitative findings. Privacy on Ethereum is not failing because users do not care, but because **the experience does not meet the psychological requirements of trust, clarity, and confidence**.

Solving privacy adoption is therefore not only a cryptographic challenge, but a **design and UX challenge**. Addressing this gap is the fastest path to making privacy usable, trusted, and ultimately normal on Ethereum.

---

## Appendix

### Qualitative Themes and How We Tested Them Quantitatively

| **Theme** | **Hypothesis (based on interview insights)** | **Purpose of Testing It** |
| --- | --- | --- |
| **1. Clarity of privacy scope** | Users believe they know what’s private on-chain, but in reality, most cannot accurately identify what data is visible or protected. | Measure how well people actually understand privacy boundaries. |
| **2. Trust transparency** | Users place more trust in *brands* (e.g., Flashbots, Railgun) than in *verifiable proofs* (e.g., audits or on-chain evidence). | Quantify how trust forms: social vs technical trust. |
| **3. Technical friction** | Complex setup and multi-step flows (extra wallets, ENS, signatures) are major barriers, even for technically skilled users. | Assess how much friction affects adoption intent. |
| **4. Usability and defaults** | Users assume privacy settings are enabled by default, and rarely change them manually. | Confirm the behavioral gap between assumption and action. |
| **5. Verification anxiety** | Lack of clear confirmations or test environments causes users to hesitate or limit fund size in private transactions. | Measure confidence thresholds and safety needs. |
| **6. Context-specific motivation** | Privacy priorities depend on context: users care most in financial or identity-linked actions, less in social or governance contexts. | Rank contexts by perceived privacy need. |
| **7. Educational & mental model gaps** | Even experienced users struggle to explain how privacy tech (e.g., stealth addresses, shielded pools) actually works. | Measure comprehension and need for educational support. |

### Blockers when using on-chain privacy tools 

| **Blocker** | **Votes** | **Percentage** |
| --- | --- | --- |
| **Complex or hard to use** | **43** | **58%** |
| High gas or transaction costs | 24 | 32% |
| Regulatory or policy uncertainty | 23 | 31% |
| Missing in my wallet or favorite dapps | 22 | 30% |
| Too few people use it / Privacy feels weak | 20 | 27% |
| Hard to verify what is private | 15 | 20% |
| Security concerns (e.g. fear of hacks) | 13 | 17% |
| Doesn’t work the same across apps or chains | 11 | 15% |
| My activity does not feel sensitive enough | 8 | 10% |
| I want onchain reputation (airdrops, social graph) | 7 | 9% |
| Social stigma or reputation risk | 4 | 5% |
| Other | 6 | 8% |

### Trust factors when using on-chain privacy tools

| **Trust Factor** | **Votes** | **Percentage** |
| --- | --- | --- |
| **Open-source code** | **45** | **60.8%** |
| Clear docs on how it works | 34 | 45.9% |
| Transparent architecture | 34 | 45.9% |
| Clear explanation of trade-offs | 34 | 45.9% |
| Referrals or endorsements from trusted people | 20 | 27.0% |
| Logical in-app UX with info and context | 19 | 25.7% |
| Widely used in production and time-tested | 18 | 24.3% |
| Strong security practices (bug bounties) | 16 | 21.6% |
| Independent audits | 16 | 21.6% |
| Clear website/language explaining function | 16 | 21.6% |
| Reproducible builds | 14 | 18.9% |
| Clear changelogs | 14 | 18.9% |
| Verifiable releases and contracts | 14 | 18.9% |
| Transparent team identity and track record | 10 | 13.5% |
| Verified listings on reputable directories | 1 | 1.4% |

### Open data

We are sharing the full, anonymized survey responses so anyone can analyze the results and draw their own conclusions. The CSV includes all questions and raw answers. Feel free to remix, chart, or join with your own data.
- [Download the dataset](/articles/privacy-experience-report/px-user-survey-2025-results.csv).