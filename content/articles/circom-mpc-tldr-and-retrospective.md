---
authors: ["Circom MPC research team"]
title: "Circom MPC: TL;DR and Retrospective"
image: "/articles/circom-mpc-tldr-and-retrospective/circom-mpc-tldr-and-retrospective-cover.webp"
tldr: "This post was authored by the Circom MPC research team."
date: "2025-03-06"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/qelA6kAr-CMq-dgmvFUKMMqxf6GoDaP8Cs-5sRWYfO4"
tags:
  [
    "circom",
    "mpc",
    "secure multi-party computation",
    "privacy",
    "cryptography",
    "zero-knowledge proofs",
    "machine learning",
    "mp-spdz",
    "computational integrity",
    "research",
  ]
projects: ["circom-mpc"]
---

Circom-MPC is a PSE Research project that enables the use of the Circom language to develop MPC applications. In this project, we envisioned MPC as a [broader paradigm](https://mirror.xyz/privacy-scaling-explorations.eth/qelA6kAr-CMq-dgmvFUKMMqxf6GoDaP8Cs-5sRWYfO4#MPC-as-a-Paradigm), where MPC serves as an umbrella for generic techniques such as Zero-Knowledge Proof, Garbled Circuit, Secret-Sharing, or Fully Homomorphic Encryption.

Throughout this research the team produced some valuable resources and insights, including:

- Implementation of [circom-2-arithc](https://github.com/namnc/circom-2-arithc), a fork of the Circom compiler that targets arithmetic circuits, which can be fed into any MPC backend
- Example integration of circom-2-arithc with the popular Secret-Sharing based backend MP-SPDZ in [circom-MP-SPDZ](https://github.com/namnc/circom-mp-spdz).
- Proof of concept application using [MPC-ML](https://hackmd.io/YsWhryEtQ0WwKyerSL8oCw#Circomlib-ML-Patches-and-Benchmarks) with [keras-2-circom-MP-SPDZ](https://github.com/namnc/circom-mp-spdz/blob/main/ML-TESTS.md) which extends keras-2-circom-ZK to [keras-2-circom-MPC](https://github.com/namnc/keras2circom).
- [Modular Layer benchmarks](https://mirror.xyz/privacy-scaling-explorations.eth/qelA6kAr-CMq-dgmvFUKMMqxf6GoDaP8Cs-5sRWYfO4#Modular-Layer-Benchmark) for the keras model.

We decided to sunset the project for a few reasons:

- The overwhelming amount of effort to fully implement it.
- The low current traction of users (could be due to Circom). Hence a [Typescript-MPC](https://github.com/voltrevo/mpc-framework) variant may be of more public interest.
- The existence of competitors such as [Sharemind MPC into Carbyne Stack](https://cyber.ee/uploads/Sharemind_MPC_CS_integration_a01ca476a7.pdf).

Therefore, we will leave it as a paradigm, and we hope that any interested party will pick it up and continue its development.

In what follows we explain:

- MPC as a Paradigm
- Our Circom-MPC framework
- Our patched Circomlib-ML and modular benchmark to have a taste of MPC-ML

## MPC as a Paradigm

Secure Multiparty Computation (MPC), as it is defined, allows mutually distrustful parties to jointly compute a functionality while keeping the inputs of the participants private.

![](/articles/circom-mpc-tldr-and-retrospective/OTTH9ND7SQMh-i4fIIgXE.webp)

An MPC protocol can be either application-specific or generic:

![](/articles/circom-mpc-tldr-and-retrospective/do3fC19CfKHw3rOHMuFV2.webp)

While it is clear that Threshold Signature exemplifies application-specific MPC, one can think of generic MPC as an efficient MPC protocol for a Virtual Machine (VM) functionality that takes the joint function as a common program and the private inputs as parameters to the program and the secure execution of the program is within the said VM.

_For readers who are familiar with Zero-Knowledge Proof (ZKP), MPC is a generalization of ZKP in which the MPC consists of two parties namely the Prover and the Verifier, where only the Prover has a secret input which is the witness._

![](/articles/circom-mpc-tldr-and-retrospective/AQpIQQuDUa4K6vWqK4tCI.webp)

And yes, Fully Homomorphic Encryption (FHE) is among techniques (alongside Garbled-Circuit and Secret-Sharing) that can be used for MPC construction in the most straightforward mental model:

![](/articles/circom-mpc-tldr-and-retrospective/gBQ4obkZZ9je05-isHPj1.webp)

## Programmable MPC

That said, MPC is not a primitive but a [collection of techniques](https://mpc.cs.berkeley.edu/) aimed to achieve the above purpose. Efficient MPC protocols exist for specific functionalities from simple statistical aggregation such as mean aggregation (for ads), Private Set Intersection (PSI) to complex ones such as RAM (called [Oblivious-RAM](https://en.wikipedia.org/wiki/Oblivious_RAM)) and even Machine Learning (ML).

![](/articles/circom-mpc-tldr-and-retrospective/pHw15k09c5DAsNqwacm54.webp)

As each technique GC/SS/FHE and specialized MPC has its own advantage, it is typical to combine them into one's privacy preserving protocol for efficiency:

![](/articles/circom-mpc-tldr-and-retrospective/UA0OIa7kBB8k54ripH50P.webp)

In what follows, we present work that enables the use of Circom as a front-end language for developing privacy-preserving systems, starting with the MP-SPDZ backend.

![](/articles/circom-mpc-tldr-and-retrospective/Pu6FYJqTnT4r478Ydn_u0.webp)

_[Detailed explanation of Programmable-MPC with Circom-MPC.](https://docs.google.com/presentation/d/1dPvNyrBWyqyX2oTGcnM52ldpISGrhwEhIZXJPwYWE6I/edit#slide=id.g2818c557dad_0_261)_

The Circom-MPC project aims to allow a developer to write a Circom program (a Circom circuit) and run it using an MPC backend.

### The workflow

- A circom program (prog.circom and the included libraries such as circomlib or circomlib-ml) will be interpreted as an arithmetic circuit (a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) of wires connected with nodes with an input layer and an output layer) using [circom-2-arithc](https://github.com/namnc/circom-2-arithc).
- A transpiler/builder, given the arithmetic circuit and the native capabilities of the MPC backend, translates a gate to a set of native gates so we can run the arithmetic circuit with the MPC backend.

### Circom-MP-SPDZ

[Circom-MP-SDPZ](https://github.com/namnc/circom-mp-spdz/) allows parties to perform Multi-Party Computation (MPC) by writing Circom code using the MP-SPDZ framework. Circom code is compiled into an arithmetic circuit and then translated gate by gate to the corresponding MP-SPDZ operators.

The Circom-MP-SDPZ workflow is described [here](https://hackmd.io/@mhchia/r17ibd1X0).

## Circomlib-ML Patches and Benchmarks

With MPC we can achieve privacy-preserving machine learning (PPML). This can be done easily by reusing [circomlib-ml](https://github.com/socathie/circomlib-ml) stack with Circom-MPC. We demonstrated PoC with [ml_tests](https://github.com/namnc/circom-mp-spdz/tree/main/ml_tests) - a set of ML circuits (fork of [circomlib-ml](https://github.com/socathie/circomlib-ml)).

More info on ML Tests [here](https://github.com/namnc/circom-mp-spdz/blob/main/ML-TESTS.md).

### Patches

**Basic Circom ops on circuit signals**

Circom-2-arithc enables direct usage of comparisons and division on signals. Hence the original Circom templates for comparisons or the division-to-multiplication trick are no longer needed, e.g.

- GreaterThan can be replaced with ">"
- IsPositive can be replaced with "> 0"
- x = d \* q + r can be written as "q = x / d"

**Scaling, Descaling and Quantized Aware Computation**

Circomlib-ML "scaled" a float to int to maintain precision using $10^{18}$:

- for input $a$, weight $w$, and bias $b$ that are floats
- $a$, $w$ are scaled to $a' = a10^{18}$ _and_ $w' = w10^{18}$
- $b$ is scaled to $b' = b10^{36}$_,_ due to in a layer we have computation in the form of $aw + b \longrightarrow$ the outputs of this layer is scaled with $10^{36}$
- To proceed to the next layer, we have to "descale" the outputs of the current layer by (int) dividing the outputs with $10^{18}$

  - say, with an output $x$, we want to obtain $x'$ s.t.
  - $x = x'*10^{18} + r$
  - so effectively in this case $x'$ is our actual output
  - in ZK $x'$ and $r$ are provided as witness
  - in MPC $x'$ and $r$ have to be computed using division (expensive)

For efficiency we replace this type of scaling with bit shifting, i.e.

- instead of $*10^{18}$ ($*10^{36}$) we do $*2^s$ ($*2^{2s}$)where $s$ is called the scaling factor

  - The scaling is done prior to the MPC
  - $s$ can be set accordingly to the bitwidth of the MPC protocol

- now, descaling is simply truncation or right-shifting, which is a commonly supported and relatively cheap operation in MPC.

  - $x' = x >> s$

**The "all inputs" Circom template**

Some of the Circomlib-ML circuits have no "output" signals; we patched them to treat the outputs as 'output' signals.

The following circuits were changed:

- ArgMax, AveragePooling2D, BatchNormalization2D, Conv1D, Conv2D, Dense, DepthwiseConv2D, Flatten2D, GlobalAveragePooling2D, GlobalMaxPooling2D, LeakyReLU, MaxPooling2D, PointwiseConv2D, ReLU, Reshape2D, SeparableConv2D, UpSampling2D

_**Some templates (Zanh, ZeLU and Zigmoid) are "unpatchable" due to their complexity for MPC computation.**_

### Keras2Circom Patches

> keras2circom expects a convolutional NN;

We forked keras2circom and create a [compatible version](https://github.com/namnc/keras2circom).

### Benchmarks

After patching Circomlib-ML we can run the benchmark separately for each patched layer above.

**Docker Settings and running MP-SPDZ on multiple machines**

For all benchmarks we inject synthetic network latency inside a Docker container.

We have two settings with set latency & bandwidth:

1.  One region - Europe & Europe
2.  Different regions - Europe & US

We used `tc` to limit latency and set a bandwidth:

```bash
tc qdisc add dev eth0 root handle 1:0 netem delay 2ms tc qdisc add dev eth0 parent 1:1 handle 10:0 tbf rate 5gbit burst 200kb limit 20000kb
```

Here we set delay to 2ms & rate to 5gb to imitate a running within the same region (the commands will be applied automatically when you run the script).

There's a [Dockerfile](https://github.com/namnc/circom-mp-spdz/blob/main/Dockerfile), as well as different benchmark scripts in the repo, so that it's easier to test & benchmark.

If you want to run these tests yourself:

1\. Set up the python environment:

```bash
python3 -m venv .venv source .venv/bin/activate
```

2\. Run a local benchmarking script:

```bash
python3 benchmark_script.py --tests-run=true
```

3\. Build & Organize & Run Docker container:

```bash
docker build -t circom-mp-spdz . docker network create test-network docker run -it --rm --cap-add=NET_ADMIN --name=party1 --network test-network -p 3000:3000 -p 22:22 circom-mp-spdz
```

4\. In the Docker container:

```bash
service ssh start
```

5\. Run benchmarking script that imitates few machines:

```bash
python3 remote_benchmark.py --party1 127.0.0.1:3000
```

6\. Deactivate venv

```bash
deactivate
```

**Benchmarks**

Below we provide benchmark for each different layer separately, a model that combines different layers will yield corresponding combined performance.

![](/articles/circom-mpc-tldr-and-retrospective/_gT634uo_O9kx4ogisxtj.webp)

![](/articles/circom-mpc-tldr-and-retrospective/1EZeKTAV2tO1M-t1kwtk2.webp)

Accuracy of the circuits compared to Keras reference implementation:

![](/articles/circom-mpc-tldr-and-retrospective/RWD7aoy3r8bs-uMc0d45D.webp)

Our above benchmark only gives a taste of how performance looks for MPC-ML; any interested party can understand approximate performance of a model that combines different layers.
