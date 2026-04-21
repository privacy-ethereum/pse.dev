---
id: "mpc-stats"
name: "MPCStats"
image: "mpc-stats.webp"
section: "pse"
projectStatus: "inactive"
category: "applications"
tldr: "A framework for private and verifiable statistical analysis across multiple data providers."
tags:
  keywords: ["MPC", "statistics", "data analysis"]
  themes: ["build"]
  types: ["Legos/dev tools", "Lego sets/toolkits"]
  builtWith: ["MP-SPDZ", "tlsn", "python"]
links:
  github: "https://github.com/MPCStats"
  website: "https://mpcstats.github.io/docs"
---

## Overview

MPCStats is a framework that enables data consumers to query statistical computations across multiple data providers while ensuring privacy and result correctness. By integrating privacy-preserving technologies such as ZKP, MPC, and FHE, our goal is to provide tools and guidance for integrating privacy-preserving analysis into their workflows. We also aim to identify real-world applications that can benefit from this framework.

## Features

- **Privacy-preserving and verifiable statistical analysis**: Allows data providers to keep their inputs confidential while giving data consumers the assurance that computations are performed accurately and securely.
- **Data validity**: Integrates TLSNotary to authenticate inputs from verified web sources, ensuring data consumers can trust that data inputs are genuine and accurate.

## Use Cases

- **Cross-department data sharing and surveys**: Enables secure, private data sharing across government departments for streamlined operations and collaborative analysis.
- **Healthcare research**: Aggregates data from sources such as fitness apps and sleep trackers, allowing researchers to uncover relationships between health factors, such as fitness and sleep patterns.
- **Salary survey**: A verifiable and anonymous alternative to platforms like Glassdoor, where users can contribute salary data with privacy guarantees.
