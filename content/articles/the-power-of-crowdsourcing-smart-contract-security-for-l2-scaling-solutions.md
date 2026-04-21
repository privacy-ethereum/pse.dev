---
authors: ["@0xDatapunk"]
title: "The Power of Crowdsourcing Smart Contract Security for L2 Scaling Solutions"
image: ""
tldr: "This post was authored by [@0xDatapunk](https://github.com/0xDatapunk) at [PSE Security](https://github.com/privacy-scaling-explorations/security)."
date: "2023-07-18"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/Zjgt8YUAeW8XX5-wc1f6uNI8vx-5q_qBTYR4KFRGpTE"
---

### Introduction

Smart contract security is of paramount importance in the blockchain ecosystem. As the adoption of Layer 2 (L2) solutions increases, ensuring the security of these contracts becomes even more critical. Due to their complexity and the potential for significant value stored in L2 contracts, they become attractive targets for malicious actors. In this article, we will explore the power of crowdsourcing smart contract security and how it compares to traditional audit firms for two leading L2 scaling solutions (Optimism and zkSync). We will delve into their engagement with auditing firms and the surprising findings from crowdsourced security competitions.

### **Traditional audit firms vs crowdsourcing security**

Traditional audit firms and crowdsourcing security offer different approaches to enhancing smart contract security.

Traditional audit firms typically involve a select group of experts who conduct a comprehensive review of the smart contracts. They bring deep expertise and experience in identifying vulnerabilities and providing recommendations. These firms follow established methodologies and provide a sense of assurance due to their reputation and track record.

On the other hand, crowdsourcing security lives by Linus’s law that “given enough eyeballs, all bugs are shallow”. By leveraging the collective intelligence of a diverse group of participants, crowdsourcing platforms, like [Sherlock](https://www.sherlock.xyz/) and [Code4rena](https://code4rena.com/), tap into a wide range of expertise and perspectives, potentially identifying vulnerabilities that may have been overlooked by traditional audits. Here are a few benefits yielded by such platforms:

- Scalability. Crowdsourcing allows for a large number of people to review and test the contract simultaneously. This can make the security review process more scalable, particularly for projects that have a large number of smart contracts. In Code4rena competitions, for example, it is not uncommon to see more than 500 submits per codebase.
- Efficiency and Speed. While auditing firms are often booked months into the future, crowdsourcing platforms can start a competition fairly quickly.
- Cost-effectiveness. In some cases, crowdsourcing can be more cost-effective than hiring a dedicated team of security experts. This can be particularly beneficial for smaller projects or startups.
- Community Engagement. Crowdsourcing the security auditing can engage the community around a project. This can lead to increased trust and participation from users and stakeholders.

Both approaches have their strengths and limitations. Traditional audits provide a structured and controlled environment, while crowdsourcing offers broader insights and the ability to detect complex or novel vulnerabilities. A combination of both can provide a comprehensive and robust security assessment for smart contracts.

### **L2 Smart Contract Security**

Layer 2 solutions aim to alleviate scalability issues in blockchain networks by moving a significant portion of transactions off-chain while leveraging the underlying security of the base layer. However, the complexity introduced by L2 and the potential value stored in L2 contracts make them attractive targets for hackers. [Several notable hacks involving L2 and bridges have occurred](https://github.com/0xDatapunk/Bridge-Bug-Tracker), underscoring the need for stringent security practices.

Recognizing the importance of smart contract security, L2 teams conduct multiple rounds of audits before deployment. Here, we highlight the efforts put forth by Optimism and zkSync teams.

### **Optimism**

#### **Engagement with Auditing Firms**

To validate the security of their smart contracts, Optimism engaged in multiple rounds of auditing with renowned auditing firms specializing in blockchain security. The table below summarizes the audit results, highlighting the identification and severity of vulnerabilities discovered for Optimism’s bedrock.

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/jDof9Xq_eCuydOVO37pdW.webp)

#### **Sherlock competition**

##### **Unique Payout Structure Reflecting Confidence**

Prior to launching the Sherlock competition, Optimism’s confidence in their security measures led them to structure the payout in a unique way. They believed that no high or medium severity bugs could be found, and thus capped the reward pool if only low-severity bugs are found. The reward structure was designed to reflect their confidence in their security measures.

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/LZ5X_yZmzapEe3FDBeSBs.webp)

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/BCksYcQCG4bRdMNqb-nnT.webp)

##### **Surprising Findings**

Contrary to their initial expectations, the Sherlock competition yielded multiple high and medium severity bug findings. Optimism promptly addressed these vulnerabilities, showcasing their commitment to continuous improvement and security. They followed up with additional competitions to further review and enhance the security of their smart contracts.

The summaries of the competition results are as follows:

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/6X1TjwgCG_RAxkoPqpt9t.webp)

#### **The Power of Crowdsourcing Security**

The results of the Sherlock competitions demonstrate the power of crowdsourcing security. By opening the process to a diverse group of participants, Optimism was able to tap into a wide range of expertise and uncover vulnerabilities that may have otherwise gone unnoticed and been catastrophic for the Bedrock upgrade. Crowdsourcing provides a valuable mechanism for enhancing the security of smart contracts by leveraging the collective intelligence of the community.

#### **Findings from Sherlock Competitions**

The following links provide detailed findings from the Sherlock competitions conducted for Optimism:

[January 2023 Optimism Sherlock Competition](https://github.com/sherlock-audit/2023-01-optimism-judging/issues)[March 2023 Optimism Sherlock Competition](https://github.com/sherlock-audit/2023-03-optimism-judging/issues)

### **zkSync**

Similarly, zkSync engaged multiple rounds of audits with well known auditing firms:

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/EwlhpcaOxZXx1HwBVSrrA.webp)

However, their engagement with crowdsourcing platforms also revealed and fixed further vulnerabilities.

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/dZEbDsEj5v9nEwSOjJpWL.webp)

[zkSync Era System Contracts code4rena contest](https://code4rena.com/reports/2023-03-zksync)[zkSync Secure3 competitive security assessment](https://github.com/Secure3Audit/Secure3Academy/tree/main/audit_reports/zkSync)[zkSync v2 code4rena contest](https://code4rena.com/reports/2022-10-zksync)**Beyond Audits**

While traditional audits and crowdsourcing security through competitions can significantly enhance smart contract security, it is not a panacea. The crowdsourced findings serve as valuable inputs, but they do not guarantee that all vulnerabilities have been identified. To align the interests of various stakeholders, including the project owners and security researchers, Sherlock provides different levels of coverage to its customers for potential exploits, while promising high APRs for its stakers ([more details here](https://docs.sherlock.xyz/coverage/staking-apy/overview)). So far, Sherlock has had two claims against its audited contracts.

![](/articles/the-power-of-crowdsourcing-smart-contract-security-for-l2-scaling-solutions/iLEqP8F_u_PWi4qxG7OtD.webp)

The true security of L2 contracts, like any other complex system, remains an ongoing effort and requires a combination of rigorous audits, [proactive bug bounty programs](https://immunefi.com/bounty/optimism/), and continuous vigilance.

### **Conclusion**

Smart contract security is a critical aspect of blockchain technology, especially in the context of Layer 2 solutions. L2 teams’ commitment to ensuring the security of their smart contracts is evident through their engagement with auditing firms and their participation in crowdsourced security competitions. The surprising findings from the Sherlock competitions highlight the value of crowdsourcing security, enabling the identification and remediation of vulnerabilities that contribute to a safer and more secure ecosystem. As blockchain technology continues to evolve, crowdsourcing security will remain a powerful tool in mitigating risks and building robust smart contract systems.

_**The [PSE security team](https://github.com/privacy-scaling-explorations/security) works on improving the security of many different projects - both internal and external to PSE. So based on these results, the PSE security team advises projects to heavily consider both traditional audits and crowdsourced audits if possible.**_
