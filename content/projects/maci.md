---
id: "maci"
name: "MACI"
image: "maci.webp"
section: "pse"
projectStatus: "maintained"
category: "application"
tldr: "An on-chain voting solution that protects privacy and minimizes the risk of collusion and bribery"
tags:
  keywords: ["Anonymity/privacy", "Voting/governance"]
  themes: ["build"]
  types: ["Lego sets/toolkits", "Infrastructure/protocol"]
  builtWith: ["p0tion", "zk-kit", "snarkjs", "circom", "solidity"]
links:
  github: "https://github.com/privacy-scaling-explorations/maci"
  website: "https://maci.pse.dev"
  twitter: "https://twitter.com/zkmaci"
---

### Overview

[MACI](https://github.com/privacy-scaling-explorations/maci/tree/dev) is a protocol designed to provide a highly secure e-voting solution.

It enables organisations to conduct on-chain voting processes with a significantly reduced risk of cheating, such as bribery or collusion.

MACI uses zero-knowledge proofs to implement a receipt-free voting scheme, making it impossible for anyone other than the vote coordinator to verify how a specific user voted. This ensures the correct execution of votes and allows anyone to verify the results.

It's particularly beneficial for governance and funding events, where its anti-collusion mechanisms help ensure fair and transparent outcomes.

Please refer to MACI's [documentation](https://maci.pse.dev) for more details.

### Features

With MACI, you can take on chain voting to the next level:

1. Uncensorable - no one can censor votes, not even the coordinator
2. Votes are private - votes are sent encrypted on chain and only the voter and the coordinator can decrypt them
3. Fully verifiable voting process - anyone can verify the tally is correct thanks to zero-knowledge proofs
