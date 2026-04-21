---
authors: ["George Wiese"]
title: "Continuing the Zero Gravity Journey"
image: "/articles/continuing-the-zero-gravity-journey/continuing-the-zero-gravity-journey-cover.webp"
tldr: "_This post was written by [George Wiese](https://github.com/georgwiese) and [Artem Grigor](https://github.com/ElusAegis). After Zero Gravity's 1st place finish at [ZK Hack Lisbon in April](https://zkhack.dev/2023/07/11/zk-hack-lisbon/), PSE recognized the potential of the Zero Gravity project and provided a grant for further research in the ZKML area._"
date: "2023-10-19"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/Jpy-PUcH1tpOWrqSdGS4gCxa72F-aZCssACJnFDD1U0"
tags:
  [
    "zkml",
    "zero-knowledge proofs",
    "weightless neural networks",
    "halo2",
    "lookup compression",
    "folding schemes",
    "feature selection",
    "machine learning",
    "research",
    "zero gravity",
  ]
projects: ["zero-gravity"]
---

It's been an incredible journey since our team first ventured into the world of zero-knowledge proofs for Weightless Neural Networks (WNNs) at the ZK Hack Lisbon event. For an in-depth look at where we started, we recommend checking out [Ben's insightful post](https://hackmd.io/@benjaminwilson/zero-gravity).

Since then, we have improved the implementation from a python script that generates Aleo code to a Halo2 CLI that anyone can use. Check out our [previous blogpost](https://hackmd.io/FJIP2lSjRlesSHeG04LQ9Q?both=) to understand how you can prove and verify WNN evaluation on Ethereum.

## Pushing Boundaries

Fast-forward to today, and we're excited to share our latest research findings, revealing the progress we've made in the fields of cryptography and weightless neural network. We believe that the best way to describe our work is through the exciting discoveries we've uncovered.

## Rust Prover: Enhancing Efficiency

Our journey started with a deep dive into optimizing the Rust Prover, a crucial component in cryptographic protocols. Our goal was clear: find ways to significantly enhance the efficiency of lookups, a task that consumes a substantial portion of constraints in these protocols.

### Exploring Folding Schemes

One of our paths of exploration led us to investigate folding schemes like [Sangria](https://geometry.xyz/notebook/sangria-a-folding-scheme-for-plonk) and [Origami](https://hackmd.io/@aardvark/rkHqa3NZ2). These schemes showed promise in reducing constraints associated with lookups in cryptographic proofs. However, to fully leverage their potential, they require further development and integration into the Halo2 library.

### Innovative Lookup Compression Techniques

As we were determined to improve the performance despite all the wonderful technology like [Sangria](https://geometry.xyz/notebook/sangria-a-folding-scheme-for-plonk) and [Lasso](https://eprint.iacr.org/2023/1216) still being unavailable, we introduced [our own compression scheme](https://github.com/zkp-gravity/optimisation-research/tree/main/lookup_compression) for optimizing lookups. It compresses several binary lookup rows into a single field lookup, which significantly raises the performance for sparse lookup tables, such as ones we have in WNN Bloom Filter.

The result has been 14 fold theoretical lookup table compression, though we are sure we could get it to **30 fold**, making it twice as efficient as our current optimised version.

## WNN: Elevating Performance

Our research extended to improving data preprocessing and feature selection for Weightless Neural Networks (WNNs), with the aim of taking their performance to new heights.

### Unleashing the Power of Data Augmentation

Our exploration uncovered the value of data augmentation as a powerful tool to combat overfitting and enhance the generalization of WNNs. However, we learned that caution must be exercised when applying data augmentation to smaller models, as it may lead to performance degradation. Larger models, on the other hand, excel at handling the increased variety of patterns introduced by data augmentation.

### The Art of Model Reduction through Feature Selection

One of our standout achievements was the development of a feature selection algorithm that proved highly effective in reducing model size while maintaining commendable accuracy. Even for smaller models, we achieved remarkable reductions in size, sometimes up to 50%, with only a modest drop in accuracy.

### Feature Selection: Constructing Models with Precision

We delved into the world of feature selection algorithms and introduced the greedy algorithm. Though computationally demanding, it offers a means to construct models with precisely selected features. The impact of this approach varies depending on the dataset's complexity, making it a valuable tool for larger and more intricate datasets.

## Charting the Future

As we conclude this phase of our journey, we look ahead with eagerness to what lies beyond. We have identified crucial areas for further exploration and development that will shape the future of zero-knowledge proofs for Weightless Neural Networks.

### Improved Lookup Compression

Our efforts will continue to focus on enhancing lookup compression algorithms, such as Lasso, and ensuring their seamless integration with existing cryptographic libraries like Halo2. The quest for novel compression techniques that reduce constraints in lookup operations remains a central research area.

### Scaling Feature Selection to Larger Datasets

The application of feature selection algorithms to larger and more complex datasets is on our horizon. Evaluating their performance and scalability on datasets beyond MNIST will provide valuable insights into their practical utility.

## In Conclusion

Our journey has been filled with challenges, breakthroughs, and innovative solutions. We've taken steps forward, fueled by the belief that our work contributes to a collective understanding of these complex fields.

---

## Explore Our Research

- [Research Repository](https://github.com/zkp-gravity/optimisation-research/tree/main)
- [Detailed Research Writeup](https://github.com/zkp-gravity/optimisation-research/blob/main/writeup.pdf)
- [Implementation of Lookup Compression](https://github.com/zkp-gravity/optimisation-research/tree/main/lookup_compression)

For a deeper dive into our research findings, we invite you to explore our research repository, read our detailed research writeup, and examine the implementation of lookup compression. Join us on this exciting journey of exploration, where innovation and privacy-preserving technologies intersect.

To revisit where our journey began, take a look at our [Initial Blog Post from the Hackathon](https://hackmd.io/@benjaminwilson/zero-gravity).
