---
authors: ["PSE Team"]
title: "Meet COCO! - Privacy Stewards of Ethereum"
image: null
tldr: "Originally published on Jan 27, 2022"
date: "2022-08-29"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/tEf7iYa8l7ECZwN2T57yyiws7h9Uchip30CQvx-JBBQ"
tags:
  [
    "prediction market",
    "social",
    "ethereum",
    "web3",
    "user experience",
    "public goods",
    "community",
    "curation",
    "moderation",
    "infrastructure/protocol",
  ]
projects: ["coco"]
---

![](https://miro.medium.com/max/1400/1*vE2c1d46jXgbOVkDLrOMhA.png)

Originally published on Jan 27, 2022:

COCO is live on testnet! Try it now: [https://www.cocoverse.club](https://www.cocoverse.club/)

Below, we introduce COCO and give short explanation on how it works. For a deeper understanding of COCO visit the [docs](http://docs.cocoverse.club/).

## COCO tl;dr

With Coco, groups can collaborate to curate feeds of any topic they’re interested in. As you scroll through your Coco feed, rather than upvoting or downvoting posts, you’ll spend WETH to predict what other group members and the group’s moderators will want to see. When you’re right, you’ll get back your original WETH and more — but if you’re wrong, you’ll lose what you put in. Through this process, you help Coco filter value from noise to make sure group feeds only consist of posts that the group cares about.

## **How does prediction = curation?**

Predictions are made by buying shares in the outcome you think is correct. If you think others and moderators will like the post, you buy YES shares, otherwise you buy NO shares. The price of a share during prediction period depends on the proportion of YES/NO shares bought before you. When a final outcome is set (whether as the favored one, or through challenges, or by group moderators) one share of final outcome will be worth 1 WETH and a share of the losing outcome will be worth 0.

![](https://miro.medium.com/max/782/1*iyX8jxFd6Cczbx4TklOHig.jpeg)

**Buying YES outcome shares for 0.01 WETH**

In other words, every post is a [prediction market](https://www.cultivatelabs.com/posts/prediction-markets-beginner-to-intermediate), and the proportion of YES vs NO predictions determine the likelihood of group members and moderators appreciating the post. That’s the essence of curation in Coco: a group’s feed consists of posts that have high probability of being enjoyed by group members and moderators.

## **Life cycle of a post**

**Creation**

You need to spend WETH in order to post content in a group. This “creation value” is used both to make a YES prediction for your own post, and to create a pool of YES and NO outcome shares to facilitate predictions by other users.

**Prediction**

Once a post is created, anyone can make predictions on whether the post will stay on the feed or be buried. At the end of the prediction period, the most favored outcome is set as the “temporary outcome”, and will become the final outcome if not challenged.

**Challenge and Resolution**

During the Challenge Period, users can stake WETH to challenge the temporary outcome. The temporary outcome is then switched to the outcome favored by the challenger, and the time restarts. If another challenge isn’t submitted before the time limit, then it is set as the final outcome and the post enters the “Final” state. If an outcome is challenged repeatedly, group moderators step in to set the final outcome.

**Final State**

Once a final outcome is set, the post is in “Final” state. It is either considered suitable for the group’s feed, if final outcome is YES, or not suitable, if the outcome is NO. Now is the time you can redeem your rewards if your prediction was right, and get your stake (+ some reward) back if you staked for the right outcome during challenge period.

## Role of moderators

For the most part, group moderators won’t have to get involved in deciding which posts stay in the feed, as long as users agree upon what the moderators _would_ decide. You can think of predictions behaving like a vote, with WETH at stake representing one’s confidence on the post, to encourage voting in the best interest of the group.

Moderators don’t control who can join, post, or make predictions on posts in the group. Instead, the key roles of the moderators are to set expectations for what belongs in the feed, decide parameters like the length of the prediction and challenge periods, and declare outcomes when the prediction mechanism doesn’t do its job.

As of now, only the user that creates a group is able to act as a moderator of that group. We have plans to enable multiple moderators to coordinate within the app in future releases.

## What’s COCO capable of?

The scope of topics for groups is unlimited. You can have groups on Funniest crypto memes of week, Trending NFTs of the month, Top articles of the week in crypto, Most insightful research papers in ML, Most secure contracts, or even Top bars in Switzerland. Whatever the topic, Coco’s curation mechanism will ensure that only the best posts stay on the group’s feed.

Right now, it’s only possible to post images. More content types are coming, along with comments and other features.

## Learn more

Everything above is good to get you started with Coco, but if you are looking for more guidance around how to use the app or want to understand Coco better, check out our [docs](https://docs.cocoverse.club/).

## Tell us what you think!

COCO is still being developed, and we’d love to hear your feedback and ideas. Fill out [this form](https://airtable.com/shrsVVVLBuawaCDvE) to share your thoughts! Also join our [telegram group](https://t.me/+A47HJeqh0-tlODI1) for any questions and further discussions.

_Thanks to Althea, Barry, Rachel, and Thore for discussions and ideas around Coco, which truly helped shaping Coco._
