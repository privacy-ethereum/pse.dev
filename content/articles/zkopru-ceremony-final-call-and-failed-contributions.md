---
authors: ["PSE Team"]
title: "Zkopru Ceremony: Final Call and Failed Contributions"
image: null
tldr: "We will end the ceremony on Friday. It was largely a success but we had a few cases of failed contributions. If your first run didn't succeed you can now head back to our [website](https://zkopru.network/)_ to fix it"
date: "2022-08-26"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/X7O6_Y33NY-nNfzpV5HZRvups2qimQnQ9ef0OD1U8RY"
tags:
  [
    "zkopru",
    "trusted setup",
    "ceremony",
    "zero-knowledge proofs",
    "privacy",
    "cryptography",
    "ethereum",
    "security",
  ]
projects: ["zkopru"]
---

![](https://miro.medium.com/max/1400/1*_TJxTYbsHsjKY_XJQhxthA.png)

Our trusted ceremony for Zkopru has attracted a large number of contributors, second only to tornado.cash with their sub-minute contribution time. If you have not yet participated you can do so [here](https://zkopru.network/).

As mentioned in our [previous post](https://thore-hildebrandt.medium.com/zkopru-trusted-setup-ceremony-f2824bfebb0f), we will wrap up the ceremony and announce a random beacon to seal the ceremony. But before we do that we want to make sure that everybody has a chance to add a valid contribution. We will close the ceremony for contributions on Friday April 16th 2021.

## Reasons for Failed Contributions

We found three causes for failures and enabled affected accounts to do a second run on these circuits. Participants may not be aware that something went wrong in scenario 1&2 so it's worth heading to our [website](https://zkopru.network/) to see if it allows you a second run.

Note that the ceremony is secure as long as at least one participant was not malicious. We provide the option for a second run to make sure no one feels censored.

**1\. Conflicting Contributions**We found that most cases occurred during initial periods of high traffic when two or more contributors joined at around the same time. The rate of contribution slowed after that, and we deployed a fix. A contributor may have failures in one or more circuits, but have successful contributions in others. Only the failed contributions have been reset to allow re-run. Each contribution builds on the latest verified contribution, but in this case, both contributors built on the same one. So the contribution looks valid but doesn't appear in the verification transcript. Similar to an uncle block in Ethereum.

**2\. Chaining from 0**In a small number of cases a contributor chained from contribution 0, effectively restarting the chain. These cases have also been identified and reset. The code now has a sanity check to prevent this from occurring.

**3\. Timeouts**Contributions have in some cases also been excluded because of timeouts. This isby design, and happens when a contribution is taking too long and others are waiting in the queue. These cases have not been reset, unless they happen to also have been in the above set.

## Questions?

Please join our [telegram channel](https://t.me/zkopru) to ask any questions and follow us on twitter [@ZkopruNetwork](http://twitter.com/ZkopruNetwork).
