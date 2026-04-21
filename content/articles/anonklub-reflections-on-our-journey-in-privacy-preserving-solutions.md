---
authors: ["AnonKlub Team"]
title: "AnonKlub: Reflections on Our Journey in Privacy-Preserving Solutions"
image: "/articles/anonklub-reflections-on-our-journey-in-privacy-preserving-solutions/anonklub-reflections-on-our-journey-in-privacy-preserving-solutions-cover.webp"
tldr: "This post was written by the AnonKlub team."
date: "2024-10-01"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/7VTKFVR4PM75WtNnBzuQSBZW-UYoJOsnzBBQmB9MWbY"
tags:
  [
    "zk-ecdsa",
    "privacy",
    "ethereum",
    "zero-knowledge proofs",
    "circom",
    "halo2",
    "spartan",
    "anonymity",
    "identity",
    "cryptography",
  ]
projects: ["anon-klub"]
---

One year and half ago, we embarked on an ambitious journey to explore the potential of zk-ECDSA in bringing enhanced privacy to the Ethereum ecosystem. This research initiative was introduced to the community through a **[blog post detailing the state of zk-ECDSA and its promising applications](https://mirror.xyz/privacy-scaling-explorations.eth/djxf2g9VzUcss1e-gWIL2DSRD4stWggtTOcgsv1RlxY)**.

As our research progressed and we began to develop practical implementations, our project evolved and was eventually rebranded as AnonKlub. This name change reflected our shift from pure research to a more application-focused approach, aiming to bring privacy-preserving solutions directly to Ethereum users.

Today, as we announce the sunsetting of AnonKlub, we'd like to reflect on our journey from those early days of zk-ECDSA exploration to our efforts in building real-world privacy tools. We'll share our achievements, the challenges we faced, and the valuable lessons we've learned along the way.

## Our Vision and What We Built

AnonKlub began with the ambitious goal of leveraging zk-ECDSA to create privacy-preserving solutions for Ethereum users by allowing anonymously proving ownership of an ethereum address. We envisioned an ecosystem where users could interact with dApps, participate in DAOs, and manage their digital assets without compromising their privacy, that is without doxxing their address(es).

Over the course of the project, we managed to generate anonymous Ethereum address ownership proofs using three distinct proving frameworks: Circom, Spartan/Sapir, and Halo2.

![The AnonKlub architecture (https://anonklub.github.io/#/architecture)](/articles/anonklub-reflections-on-our-journey-in-privacy-preserving-solutions/zMN7BV3cKC4pol4SIyGKG.webp)

The AnonKlub architecture (https://anonklub.github.io/#/architecture)

## Challenges We Faced

Despite our achievements, we encountered several significant challenges:

### Framework selection

One of the most valuable lessons from our AnonKlub journey came from our framework selection process. Three requirements were paramount, yet impossible to fulfill simultaneously given the current maturity of zero-knowledge technology:

1.  **Privacy**: Client-side proving is crucial to prevent leaking any link between proof inputs and proof results to a proving server. Users should not have to let their private data leave their device.
2.  **Trustlessness**: On-chain verification via smart contracts ensures a trustless system, whereas relying on off-chain servers (the server that hosts a web client that does the verification in the browser) introduces trust assumptions.
3.  **Performance**: In today's fast-paced digital world, users expect quick interactions. Any proving process taking longer than 30 seconds significantly degrades user experience. Considering the approximate proving time of 1 minute, this falls short when compared to typical Web2 experiences, where users are accustomed to near-instantaneous responses. This presents a challenge for building more impactful products that attract a wider user base. While a 1-minute proving time may not be fast enough for many applications, it's important to consider:

    - The type of applications using these proofs: For instance, generating an anonklub proof is likely an occasional or rare event, rather than a frequent action. In such cases, users might be more tolerant of longer processing times.
    - The use of web workers: By triggering the proof generation in the background, users can continue interacting with the application without a frozen UI. They can perform other tasks and receive a notification when the proof is complete.

    These factors can help mitigate the impact of longer proving times. However, continued efforts to optimize and reduce proving time will be crucial for broader adoption and improved user experience in the long run.

Our journey through three different frameworks highlighted the challenges in balancing these requirements.

![Benchmarking Results of ZK Frameworks Used](/articles/anonklub-reflections-on-our-journey-in-privacy-preserving-solutions/_mhlWZpoF_CiMB9Zy9TA4.webp)

Benchmarking Results of ZK Frameworks Used

![Halo2 Proving Time Breakdown (no GPU)](/articles/anonklub-reflections-on-our-journey-in-privacy-preserving-solutions/3y1L8xxdN52vkAJOXbNji.webp)

Halo2 Proving Time Breakdown (no GPU)

![Privacy vs Performance Trade-Offs Of Different ZK Frameworks Used](/articles/anonklub-reflections-on-our-journey-in-privacy-preserving-solutions/TqCXT1IJ7_dwQp9Xemqa-.webp)

Privacy vs Performance Trade-Offs Of Different ZK Frameworks Used

### **PLUME signature/nullifier scheme adoption hurdles**

Nullifying zk ECDSA proofs is hard. The best candidate for robust and secure nullifier for zk proofs of ecdsa signature is [PLUME](https://blog.aayushg.com/nullifier/). PLUME signatures aren't standard signatures that mainstream wallets can build out of the box: the PLUME signature scheme is a new feature that needs to be implemented into mainstream wallets. As long as mainstream wallets don't adopt PLUME, users can't easily generate "deterministic and verifiable nullifiers on ECDSA". Meaning they can't use any applications that would make use of ECDSA zk proofs, such as AnonKlub.

## Why We're Stopping

The decision to sunset AnonKlub was not taken lightly, but was ultimately driven by a combination of challenges such as the ones mentioned above and strategic considerations:

1.  **Technological Limitations**: As outlined above, we found ourselves at an impasse. The current state of zero-knowledge technology made it impossible to simultaneously achieve the level of privacy, trustlessness, and performance we deemed necessary for a truly user-friendly and secure solution. This fundamental challenge proved more persistent and resource-intensive to overcome than we initially anticipated.
2.  **Ecosystem Readiness**: The slow adoption of critical components like PLUME in mainstream wallets has created a significant bottleneck for the practical application of our work. Without widespread integration of these foundational elements, the real-world impact of our solutions remains limited.
3.  **Evolving Privacy Landscape**: As with any ambitious project in the cutting-edge tech space, we've had to continually evaluate the balance between our goals, available resources, and potential impact. The rapid evolution of privacy solutions in the Ethereum ecosystem has opened up new, promising avenues for research and development. Given the challenges we've faced and this changing landscape, we've concluded that our resources could potentially drive greater innovation and progress if redirected to other pressing challenges.

## Future Hopes

Looking to the future, we hope that our work with AnonKlub will serve as a stepping stone for others in the privacy-preserving space. We believe that the challenges we faced and the solutions we explored will provide valuable insights for future projects.

We remain optimistic about the future of privacy in the Ethereum ecosystem. We hope to see continued development in areas such as:

1.  Improved performance in zk-ECDSA implementations, possibly through GPU acceleration or innovative uses of folding schemes.
2.  Wider adoption of privacy-preserving technologies like PLUME in mainstream wallets.
3.  New approaches to balancing privacy, usability, and decentralization in blockchain applications.

## Conclusion

While AnonKlub is ending, our commitment to advancing privacy solutions in the blockchain space remains strong. We're grateful for the support and interest from the community throughout this journey. We encourage others to build upon our work, learn from our experiences, and continue pushing the boundaries of what's possible in blockchain privacy.

The [code](https://github.com/anonklub/anonklub) and [documentation](https://anonklub.github.io/) from AnonKlub will remain available as a resource for the community. We look forward to seeing how future projects will take these ideas further and bring robust, user-friendly privacy solutions to the Ethereum ecosystem.

For more about PSE, visit our [website](https://pse.dev/),

_Header image credit © [Jonathan Kington](https://www.geograph.org.uk/profile/31463) ([cc-by-sa/2.0](http://creativecommons.org/licenses/by-sa/2.0/))_
