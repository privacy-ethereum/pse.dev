---
id: "mpc-framework"
name: "MPC Framework"
image: "mpc-framework.webp"
section: "pse"
projectStatus: "inactive"
category: "devtools"
tldr: "Create secure MPC apps easily in TypeScript."
license: "MIT"
tags:
  keywords: ["MPC", "TypeScript", "privacy", "Garbled Circuits", "iZK"]
  themes: ["buildWith", "play", "research"]
  types: []
  builtWith: ["ValueScript", "Summon", "MPZ", "EMP-Toolkit"]
links:
  github: "https://github.com/privacy-scaling-explorations/mpc-framework"
  website: "https://mpc.pse.dev"
  telegram: "https://t.me/+FKnOHTkvmX02ODVl"
team:
  - name: "Andrew Morris"
    image: "/avatars/andrew.webp"
    links:
      github: "https://github.com/voltrevo"
      twitter: "https://x.com/voltrevo"
  - name: "Yanis Meziane"
    image: "/avatars/yanis.webp"
    links:
      github: "https://github.com/Meyanis95"
      twitter: "https://x.com/yanis_mezn"
extraLinks:
  buildWith:
    - label: "Create MPC-powered apps in Typescript"
      url: "https://github.com/privacy-scaling-explorations/mpc-framework"
    - label: "Generate circuits with Summon"
      url: "https://github.com/privacy-scaling-explorations/summon"
  research:
    - label: "Trinity: 2PC with Laconic OT + Garbled Circuits + PLONK"
      url: "https://github.com/privacy-scaling-explorations/Trinity"
    - label: "Authenticated Garbling"
      url: "https://hackmd.io/@a37205y_SL2LtEA1y2OWhQ/Sy4-nZ3lyx"
  play:
    - label: "Hello world in MPC"
      url: "https://mpc.pse.dev/apps/hello"
    - label: "Lizard Spock in MPC"
      url: "https://mpc.pse.dev/apps/lizard-spock"
    - label: "More demos"
      url: "https://mpc.pse.dev/showcase"
---

# MPC Framework

A framework that makes MPC easy, in TypeScript.

## Quick Start

Try [a demo app](https://mpc.pse.dev/apps/hello) or quickly [spin up your own](https://github.com/privacy-scaling-explorations/mpc-framework?tab=readme-ov-file#usage-guide).

## Overview

To make an MPC app you need three things:

**1) Engine**

- Implements the underlying cryptography.

**2) Circuit Generator**

- The shared computation needs to be specified as a circuit, and you need something to generate
  that. This is similar to using a compiler to get programs to run on your machine.

**3) Messaging with each Party**

- Send and receive bytes.

MPC Framework brings these pieces together in a straightforward TypeScript API to make MPC
application development easy.

It includes multiple officially supported components for (1) and (2), templates that include (3),
and is designed to accommodate new solutions for each component.

The main solution for (2) is [Summon](https://github.com/privacy-scaling-explorations/summon), which is a TypeScript-like
language for generating circuits.

## What is MPC?

MPC stands for _Multi-Party Computation_. In regular computation, all inputs,
outputs, and intermediate calculations are necessarily visible on the device
performing the computation. MPC, by contrast, allows multiple devices to
collaborate on a computation while keeping intermediate calculations and others'
inputs private.

Here's some ways that can be useful:

- Provide analysis on patient data to researchers without revealing the patient data
- Play [Rock Paper Scissors Lizard Spock](https://github.com/privacy-scaling-explorations/mpc-lizard-spock) while keeping your move secret
- Hold an auction while keeping the bids secret (only the winning bidder and price is revealed)
- [Match employers and job-seekers that each have hidden criteria](https://github.com/cursive-team/pz-hiring)
- Arrange optimal asset swaps (eg sports players / trading cards / corporate assets / NFTs) using hidden valuations
- Find out if you qualify for an insurance policy without sharing your health data and without requiring the insurer to reveal the policy requirements
- Quantify how much you have in common with someone and then figure out the commonalities together (or choose not to)
- Create an embarrassing songs playlist for a party where each song is liked by >=N people

For a bit more of an introduction to MPC, see Barry Whitehat's talk
[2PC is for Lovers](https://www.youtube.com/watch?v=PzcDqegGoKI). The
lovers' app described in the talk has been implemented using mpc-framework
[here](https://mpc.pse.dev/apps/2pc-is-for-lovers).

For a more technical introduction, see [Computerphile's video on Garbled Circuits](https://www.youtube.com/watch?v=FMZ-HARN0gI). For a deeper dive: [Pragmatic MPC](https://securecomputation.org/).
