---
authors: ["Kevin Chia", "Jern Kun", "Kazumune Masaki"] # Add your name or multiple authors in an array
title: "MPCStats Retrospective: Lessons from a Privacy-Preserving Stats Platform" # The title of your article
image: "/articles/mpcstats-retrospective/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "A retrospective on the MPCStats project—exploring our goals, technical challenges, demo at Devcon 2024, and the decision to sunset the platform."
date: "2025-05-23"
tags: ["MPC", "privacy", "data analysis", "Devcon", "TLSNotary"]
projects: ["mpcstats"]
---

### History of the project

The MPCStats project (formerly ZKStats) began in September 2023 with the goal of building a web platform where anyone could share data and query statistical computations while preserving privacy. The original vision was to create a generic, open data pool that aggregates inputs from different sources, enabling arbitrary statistical computations over private data.

We initially built a stats library using EZKL to support ZK proofs for one data provider scenario. However, as the limitations of ZK in multiple data providers scenarios became clear, we shifted focus toward MPC and adopted MP-SPDZ, which supports a wide range of MPC protocols and allowed us to benchmark performance.

Rather than building the full-fledged platform we originally planned, we decided to narrow the scope and deliver a demo based on a specific use case. This allowed us to ship faster, gather early feedback, and provide a tangible example for others to build on. We showcased our demo at Devcon 2024, where participants contributed their ETH balance on Binance and queried statistical results.

We got valuable feedback after the demo, and we recognized that identifying impactful, real-world use cases would be key to making our work meaningful. We began planning user interviews to validate promising application ideas and to implement them based on the findings.

![mpcstats-demo](/articles/mpcstats-retrospective/mpcstats-demo.webp)

### What was achieved

- Successfully delivered an [interactive demo at Devcon 2024](https://www.youtube.com/watch?v=wCp7Zsjou7w), where participants submitted their ETH balance from Binance and queried aggregated statistics like the Gini coefficient, mean, median, and max.
  - Computations were performed using MPC, with data authenticity verified by [TLSNotary](https://tlsnotary.org/) and execution delegated to three servers for smoother UX.
  - The system completed most computations within 1 minute and was secure against up to 1 out of 3 malicious parties. Full details are available in our [demo report](https://www.notion.so/3055bb69afd24d60bf8ee8d4fa5f774c?pvs=21).
  - The same demo was also presented at **Taipei Blockchain Week**, with a total of 19 participants across both events.
- Developed a reusable [infrastructure for MPC demos](https://github.com/MPCStats/mpc-demo-infra), allowing other teams to adapt for different data sources and statistical functions, using the statistics library we built with [MP-SPDZ](https://github.com/data61/MP-SPDZ).
- Built an earlier [ZK-based version of the statistics library](https://github.com/MPCStats/zk-stats-lib) using [EZKL](https://github.com/zkonduit/ezkl), enabling single-party computations and helping explore privacy-preserving techniques beyond MPC.

### Challenges & learnings

**Technical**
We made the system more user-friendly by delegating computation to several trusted servers. Since users did not participate in MPC directly and the three servers handled computation among themselves, data providers and consumers had to trust that at least two servers acted honestly (honest-majority) to ensure data privacy and computation correctness. We considered switching to dishonest-majority MPC protocols to enhance security, but found that doing so introduced networking overhead and longer execution time.
From user feedback, we learned that most participants were not overly concerned about this trust assumption, as long as the servers were operated by entities they deemed trustworthy. However, one downside of this approach is that if the servers ever collude, the data leakage would be undetectable to the users.

For data authenticity, integrating TLSNotary with MP-SPDZ enabled us to support authenticated MPC inputs through real-world data sources.

**Organizational**
In retrospect, we realized that user research should have been conducted earlier in the process. Waiting until after the demo to validate needs made it harder to prioritize direction and gain confidence in the problem we were solving.
We should also have started with smaller PoCs and lightweight demos to explore use cases quickly before committing to more substantial development efforts. This would have helped us stay more agile and reduced the cost of pivoting as new insights emerged.

**Adoption**
From the demo experience, one of the most common pieces of feedback was: “Who would use this?” The use case we demonstrated, while technically functional, was not compelling or necessary enough to spark strong interest or contributions.
Also, we learned that the choice of data source matters. Using Binance data made the demo feel too financially sensitive, and many attendees were hesitant to generate API keys or run scripts due to concerns about security or potential losses. On the UX side, our CLI-based interface made it harder for users to try the demo. A web-based interface was in the plan, but we weren’t able to ship it before the project concluded.

### Sunsetting

We believe the most meaningful outcome of this project would have been to bring privacy-preserving and authenticated data inputs into real-world use cases. However, despite validating the technical feasibility through our demo, we struggled to identify a concrete, high-impact use case where this capability would be urgently needed and realistically adopted. Without a strong application or user demand, we felt it was no longer justifiable to continue development. Given all the above, the period following the Devcon demo felt like a natural and appropriate stopping point for the project.

### Future

The MPCStats team explored technologies for conducting statistical analysis while preserving privacy and result correctness, and showcased a demo at Devcon 2024. We've built the following tools:

- [MPCStats Demo infrastructure](https://github.com/MPCStats/mpc-demo-infra): the infrastructure we built for the Devcon demo. It can be adapted to other use cases.
- [ZKStats library implemented with EZKL](https://github.com/MPCStats/zk-stats-lib)

And write-ups:

- [MPCStats Demo Infrastructure Docs](https://mpcstats.github.io/docs/): A full guide on how to deploy, and the technical details behind the system.
- [Devcon Demo Report](https://www.notion.so/3055bb69afd24d60bf8ee8d4fa5f774c?pvs=21)

We hope these components can serve as a reference or starting point for teams exploring privacy-preserving statistics, MPC applications, and input authentication using TLSNotary.

No active maintenance will be guaranteed going forward. However, the code and write-ups will remain publicly accessible for anyone who finds them useful.
