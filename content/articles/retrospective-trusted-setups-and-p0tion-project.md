---
authors: ["PSE Trusted Setup Team"]
title: "Retrospective: Trusted Setups and P0tion Project"
image: "/articles/retrospective-trusted-setups-and-p0tion-project/retrospective-trusted-setups-and-p0tion-project-cover.webp"
tldr: "This post was written by the PSE Trusted Setup Team."
date: "2025-01-15"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/Cf9nYvSlATGks8IcFaHQe3H5mgZ_Va767Zk5I8jPYXk"
tags:
  [
    "trusted setups",
    "p0tion",
    "powers of tau",
    "kzg",
    "zero-knowledge proofs",
    "cryptography",
    "ethereum",
    "groth16",
    "security",
    "infrastructure/protocol",
  ]
projects: ["p0tion", "powers-of-tau", "trusted-setups"]
---

## Chronological look back

### **Early Stages and Foundation**

PSE's Trusted Setups team began two years ago with a focus on understanding and implementing trusted setup ceremonies, which are crucial in generating secure cryptographic keys for production-ready zkSNARKs circuits. The team was formed to continue work on ongoing projects as well as starting to work on new initiatives.

In a trusted setup ceremony, multiple participants collaborate to compute the cryptographic parameters for the circuit, each contributing their own entropy - some [secret](https://www.youtube.com/watch?v=I4cDAqeEmpU), [randomly](https://web.archive.org/web/20230501054531/https:/proofof.cat/) [generated](https://web.archive.org/web/20230504180930/https:/hackmd.io/axUX8pFUQD-yCiBzQEDrYQ?view) [value](https://www.vice.com/en/article/power-tau-zcash-radioactive-toxic-waste/) - that is [destroyed](https://x.com/saint_rat/status/1647601259724275713) after the computation is complete. As long as at least one participant runs the computation securely and properly disposes of their "toxic waste", the setup is secure.

Historically, trusted setups have been difficult and time-consuming, requiring teams to implement infrastructure and coordinate participation for each new zkSNARK, often across two separate phases. The time, resources and technical expertise required to run a trusted setup ceremony placed a big burden on teams working on zero knowledge protocols - [this podcast](https://radiolab.org/podcast/ceremony) famously documents the elaborate precautions taken to secure Zcash's 2016 trusted setup ceremony.

Our team identified a need for accessible and replicable tools that would help teams run trusted setups with less overhead. We quickly developed expertise in this niche but critical area, laying the groundwork for innovative tools to make trusted setups easier and more efficient.

### **Perpetual Powers of Tau**

In a two-phase trusted setup, the second phase is circuit-specific; but the first phase can be used by any number of projects as long as they trust that it's secure. Our team took on the challenge of implementing a Phase 1 ceremony that could be trusted by anyone who might want to build on it. Since a setup is secure as long as any one participant has behaved honestly, that meant creating a ceremony that could stay open indefinitely and accept any number of contributions. This way, anyone who wanted to build on the setup but wasn't confident in its integrity could ensure it was secure for their project by simply making their own contribution.

The result was the [Perpetual Powers of Tau ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau), focusing on producing phase-1 files crucial for all zkSNARKs. This ongoing ceremony has been running since 2019, with 85 contributors to date. Contributing to PPoT involves managing complex 100GB files, which requires contributors to have enough technical knowledge to spin up a server large enough to compute the contribution. It also requires the contributor to know how to install the right tools, download the files and upload the files after they finished their contribution.

![From PPoT announcement post by Wei Jie Koh https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377](/articles/retrospective-trusted-setups-and-p0tion-project/zciGzID2rP9dzeGIART7u.webp)

From PPoT announcement post by Wei Jie Koh https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377

Since Perpetual Powers of Tau began, the team has successfully coordinated, prepared and published a range of Phase 1 output files for use in Phase 2 ceremonies depending on their number of constraints, demonstrating long-term commitment to this critical infrastructure.

### **KZG Ceremony**

A pivotal moment for the project was the implementation of the [KZG Ceremony](https://blog.ethereum.org/2024/01/23/kzg-wrap), essential for [EIP 4844](https://eips.ethereum.org/EIPS/eip-4844) (Proto-Danksharding). This Ethereum core upgrade aimed to reduce gas prices by creating a separate market for data storage, benefiting layer 2 protocols.

We developed a [user-friendly web application](https://ceremony.ethereum.org/) to invite broad community participation, with a user-friendly process that guided contributors through the ceremony step by step, automating and abstracting away the complex operations of computation and toxic waste disposal. PSE's design team created a beautiful user interface that made participating in the ceremony feel more like a sacred ritual than collective math.

![ceremony.ethereum.org landing page at the time the ceremony was active](/articles/retrospective-trusted-setups-and-p0tion-project/01yqkaXXNPa8RfDHylN4M.webp)

ceremony.ethereum.org landing page at the time the ceremony was active

The ceremony was a resounding success, achieving an impressive 141,416 contributors worldwide. The [codebase](https://github.com/zkparty/trusted-setup-frontend) has been forked 66 times and garnered 229 stars on Github, indicating strong community interest and potential for reuse.

### **p0tion**

In response to internal needs, the team took on the development of [p0tion](https://github.com/privacy-scaling-explorations/p0tion), a toolkit for deploying and running trusted setup ceremonies. Whereas the KZG implementation was designed for a very specific use, p0tion is intended to be more generalized and adaptable to the needs of many different projects.

The p0tion toolkit utilizes a mix of cloud functions and virtual machines for efficiency in running secure Groth16 zk-applications via automated Phase 2 ceremonies. We focused on streamlining the process of executing a trusted setup, as well as creating a [unified interface](https://ceremony.pse.dev/) for ceremonies implemented with p0tion.

![Trusted setup for ZKEmail circuits on ceremony.pse.dev](/articles/retrospective-trusted-setups-and-p0tion-project/5cWrHa_ezgv98uSrlyspq.webp)

Trusted setup for ZKEmail circuits on ceremony.pse.dev

The team later adapted the toolkit into a stand-alone tool with minimal infrastructure requirements, making it more accessible and easier to deploy on external servers.

## Successes

### Technical Achievements

The team developed some of PSE's most utilized public good tools, including p0tion for trusted setup ceremonies. They created a user-friendly KZG Ceremony interface attracting 140,000 participants and successfully conducted ceremonies for Groth16 PSE projects and external initiatives. The manual execution of Perpetual Powers of Tau demonstrated their capability in coordinating, verifying and backing up large files.

### Community Engagement and Impact

Widespread participation in the KZG Ceremony enhanced Ethereum's security and fostered community involvement. The project contributed significantly to the growth and security of the Ethereum ecosystem, benefiting deployed dapps and zkApps.

Providing valuable generalized tools as public goods extended the project's influence across the crypto community. To date, p0tion has been used in [over 15 internal and external ceremonies](https://ceremony.pse.dev/). The #🧪-p0tion channel in the [PSE public Discord](https://discord.com/invite/yujxyBdCfM) has been a great tool for the community to participate in the ceremonies and help us debug code issues.

### Knowledge Sharing and Collaboration

The team collaborated effectively with Ethereum core developers and external team members from various projects. They shared experiences through talks and workshops at events like Devconnect, positioning themselves as a valuable resource in the crypto community. Some of the talks are:

- [https://www.youtube.com/watch?v=Z2jR75njZKc](https://www.youtube.com/watch?v=Z2jR75njZKc)
- [https://www.youtube.com/watch?v=SnLDI8PLyDc](https://www.youtube.com/watch?v=SnLDI8PLyDc)
- [https://www.youtube.com/watch?v=ZIfNk7DIQy4](https://www.youtube.com/watch?v=ZIfNk7DIQy4)
- [https://www.youtube.com/watch?v=U1Lh2fMcto8](https://www.youtube.com/watch?v=U1Lh2fMcto8)

## Challenges & Lessons Learned

### Project Management

A critical insight from this project was recognizing the pitfall of assuming that a small team (in our case, just two people) doesn't require formal project management methodologies or structured communication processes. We fell into the trap of believing that with such a small team, informal, ad-hoc discussions would suffice for planning, coordination, and staying aligned. This led to loose processes, inadequate planning, unclear task ownership, sometimes duplicate work and ultimately, poor organization. **For future projects, regardless of team size, we recommend implementing structured project management and communication approaches. Even for small teams, (light) sprint planning, regular stand-ups, and clearly defined goals and milestones are crucial.**

### Development Process

The team worked on different projects and solutions. Each one of them presented a different set of challenges and opportunities to learn:

1.  **Perpetual Powers of Tau**: The project was manually maintained and run by a single team member. This approach allowed to move fast and provide great user support but it also created barriers when the team member left PSE. The solution for this was to document all the process and procedures.
2.  **KZG ceremony**: The project was developed by multiple external teams that needed coordination and a strict project management workflow. Even though we were able to successfully finish the project without major issues, a key lesson learned was to plan and prioritize the roadmap with all parties involved before starting work on the project.
3.  **p0tion:** The project was inherited from another team. The initial project was built prioritizing infrastructure prices rather than flexibility to use on any infrastructure platform. This approach helped to save costs and easily manage the tool, but external parties would have to invest time and knowledge to set up all the required infrastructure for their specific needs.

Overall we learned the importance of a clear and structured roadmap and project management process. We also learned that it's far more efficient and beneficial to get early feedback on a work-in-progress rather than waiting to present a finished but potentially misguided solution.

**Besides the previous recommendation of implementing a structured project management approach, we recommend encouraging a culture of early code review, even on incomplete work: a discussion on a "half-baked" code is better than no discussion that leads to the development of an off-target solution.**

### Technical Considerations

The team encountered different technical challenges in each project that were addressed through team collaboration and external advisory:

1.  **Perpetual Powers of Tau:** Large files and long computations require knowledge on devops: instances spin-up and file backups. There are different procedures and nomenclatures depending on the infrastructure provider that the team members and maintainers have to consider when running a large ceremony like Perpetual Powers of Tau
2.  **KZG ceremony:** It is important that team members have flexibility to learn about different programming languages fast in order to collaborate with external teams. The main KZG ceremony server and crypto library was built using Rust and the team needed to understand the code in order to integrate it into a frontend (Typescript + React)
3.  **p0tion**: The mix between different infrastructure providers can help reduce costs, but it would increase complexity when deploying the tool. In our opinion, when building open-source tools, developers should aim for easy-to-deploy strategies.

In general the project highlighted the potential benefits of diversifying the technology stack and carefully weighing the convenience of third-party packages against the benefits of custom solutions, such as reduced prices, computation time and greater backup flexibility.

## Conclusion and Future Outlook

### Long Term Support (LTS)

As we conclude active development, these trusted setup projects are entering a Long-Term Support phase. Specifically:

- [Perpetual Powers of Tau](https://github.com/privacy-scaling-explorations/perpetualpowersoftau)

  - Maintain the archive of past contribution files
  - Coordinate future contributions manually through the #⛩-ppot channel on the PSE Discord

- [KZG ceremony](https://github.com/zkparty/trusted-setup-frontend)

  - No further development planned
  - Website [www.ceremony.ethereum.org](http://www.ceremony.ethereum.org/) will stay up and running for users to check the contributors' list and the final transcript
  - Codebase will remain public, but developers are generally recommended to use p0tion as a more general tool for all ceremonies

- [p0tion](https://github.com/privacy-scaling-explorations/p0tion)

  - Cease development of new features
  - Address critical bugs if and when discovered
  - Maintain the Discord channel open for community questions and issues
  - The project is available for community development of new features (faster computations, better UI dashboards, etc).

The Trusted Setups project has made significant contributions to the Ethereum ecosystem and the field of zero-knowledge proofs. As it transitions into a new phase, its legacy continues through shared tools and knowledge. The experiences and lessons learned will inform future initiatives in cryptography and blockchain.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

_PSE is an Ethereum Foundation team building free resources_ for people expanding the world of programmable cryptography. _Learn more at [pse.dev](https://pse.dev/), join our [Discord](https://discord.gg/yujxyBdCfM), or [follow us on X](https://x.com/PrivacyEthereum)._
