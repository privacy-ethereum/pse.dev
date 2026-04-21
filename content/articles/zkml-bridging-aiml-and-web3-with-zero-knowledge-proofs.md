---
authors: ["drCathieSo.eth"]
title: "ZKML: Bridging AI/ML and Web3 with Zero-Knowledge Proofs"
image: "/articles/zkml-bridging-aiml-and-web3-with-zero-knowledge-proofs/zkml-bridging-aiml-and-web3-with-zero-knowledge-proofs-cover.webp"
tldr: "This post was authored by [drCathieSo.eth](https://twitter.com/drCathieSo_eth) and was originally published [here](https://hackmd.io/@cathie/zkml)."
date: "2023-05-02"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/K88lOS4XegJGzMoav9K5bLuT9Zhn3Hz2KkhB3ITq-m8"
tags:
  [
    "zero-knowledge proofs",
    "machine learning",
    "privacy",
    "circom",
    "computational integrity",
    "ethereum",
    "web3",
    "cryptography",
    "research",
    "toolkits",
  ]
projects: ["zkml"]
---

## Introduction

I am thrilled to share that my project on ZKML has successfully been completed with the invaluable support from the Ecosystem Support Program of [Privacy Stewards of Ethereum](https://appliedzkp.org/) (Ethereum Foundation). This platform bridges the AI/ML and Web3 worlds, providing a privacy-preserving solution with immense potential to revolutionize both industries.

This is a POC of an end-to-end platform for machine learning developers to seamlessly convert their TensorFlow Keras models into ZK-compatible versions. This all-in-one solution consists of three core components:

1.  [circomlib-ml](https://github.com/socathie/circomlib-ml): A comprehensive Circom library containing circuits that compute common layers in TensorFlow Keras.
2.  [keras2circom](https://github.com/socathie/keras2circom): A user-friendly translator that converts ML models in Python into Circom circuits.
3.  [ZKaggle](https://github.com/socathie/ZKaggleV2): A decentralized bounty platform for hosting, verifying, and paying out bounties, similar to Kaggle, but with the added benefit of privacy preservation.

ZKML addresses the limitations of traditional machine learning bounty platforms, which often require full model disclosure for performance verification. The solution leverages ZKPs to enable developers to verify private models with public data, ensuring privacy and security. This is a powerful POC that can attract experienced Web2 developers to the Web3 ecosystem.

## Background and Rationale

### The challenges of traditional ML bounties

Traditional machine learning bounty platforms, such as Kaggle, often require developers to submit their full model to the host for performance verification. This can lead to several issues:

1.  **Loss of intellectual property**: Disclosing the complete model architecture and weights may expose valuable trade secrets or innovative techniques that developers would prefer to keep private.
2.  **Lack of transparency**: The evaluation process can be opaque, and participants may not be able to verify the rankings of their models against others.
3.  **Data privacy concerns**: Sharing models that have been trained on sensitive data may inadvertently reveal information about the underlying data, violating privacy norms and regulations.

These challenges have created a demand for solutions that can protect the privacy of machine learning models and the data they are trained on.

### The potential of ZKPs in machine learning

ZKPs present a promising approach to address the challenges faced by traditional ML bounties. By leveraging the power of ZKPs, ZKML offers a privacy-preserving solution with the following benefits:

1.  **Model privacy**: Developers can participate in bounties without disclosing their entire model architecture and weights, protecting their intellectual property.
2.  **Transparent verification**: ZKPs enable the verification of model performance without revealing the model's internals, fostering a transparent and trustless evaluation process.
3.  **Data privacy**: ZKPs can be used to verify private data with public models or private models with public data, ensuring that sensitive information remains undisclosed.

Integrating ZKPs into the machine learning process provides a secure and privacy-preserving platform that addresses the limitations of traditional ML bounties. This not only promotes the adoption of machine learning in privacy-sensitive industries but also attracts experienced Web2 developers to explore the possibilities within the Web3 ecosystem.

## Current Scope: A Comprehensive POC

**[circomlib-ml](https://github.com/socathie/circomlib-ml): A Circom Library for Machine Learning**

circomlib-ml is a library of circuit templates for machine learning tasks using the circom language. It contains various templates for neural network layers, such as convolutional layers, dense layers, and activation functions. This library enables the creation of custom circuits for machine learning tasks.

**[keras2circom](https://github.com/socathie/keras2circom): Seamless Model Conversion**

keras2circom is a Python tool that transpiles TensorFlow Keras models into circom circuits. This enables seamless conversion of machine learning models from the popular deep learning framework into privacy-preserving ZKP circuits.

### ZKaggle: A Decentralized Bounty Platform for Machine Learning

ZKaggle's first version emerged as [a hackathon submission at ETHGlobal FVM Space Warp Hack](https://ethglobal.com/showcase/zkaggle-70g3b). The platform enabled decentralized computing by allowing users to share their processing power and monetize their proprietary machine learning models. With a browser-based frontend, bounty providers could upload their data to Filecoin and create computing tasks with associated rewards. Bounty hunters could browse available bounties, download data, and perform computations locally. Upon completion, they would submit a proof with hashed results on-chain for the bounty provider to review. Once approved, bounty hunters could claim their rewards by providing the pre-image of the hashed results. ZKPs were used to maintain a succinct proof of computation and enable bounty hunters to monetize private models with credibility.

[ZKaggleV2](https://github.com/socathie/ZKaggleV2) presents an improved version with enhanced features and functionality. In this version, multiple files are aggregated into a single circuit, allowing for more efficient processing. The platform also verifies the accuracy of the computations and incorporates a secure method for transferring model weights from the bounty hunter to the bounty provider using elliptic curve Diffie-Hellman (ECDH) encryption. This added layer of security ensures that only authorized parties can access and utilize the model weights, further solidifying the platform's commitment to privacy and data protection.

## Code Highlights

**[circomlib-ml](https://github.com/socathie/circomlib-ml): ZK-friendly Polynomial Activation**

**[circomlib-ml/circuits/Poly.circom](https://github.com/socathie/circomlib-ml/blob/master/circuits/Poly.circom)**

```
pragma circom 2.0.0;

// Poly activation layer: https://arxiv.org/abs/2011.05530
template Poly (n) {
    signal input in;
    signal output out;

    out &lt;== in * in + n*in;
}
```

**[keras2circom](https://github.com/socathie/keras2circom): Model Weights "Quantization"**

**[keras2circom/keras2circom/circom.py](https://github.com/socathie/keras2circom/blob/main/keras2circom/circom.py)**

```
...
    def to_json(self, weight_scale: float, current_scale: float) -&gt; typing.Dict[str, typing.Any]:
        '''convert the component params to json format'''
        self.weight_scale = weight_scale
        self.bias_scale = self.calc_bias_scale(weight_scale, current_scale)
        # print(self.name, current_scale, self.weight_scale, self.bias_scale)

        json_dict = {}
        for signal in self.inputs:
            if signal.value is not None:
                if signal.name == 'bias' or signal.name == 'b':
                    # print(signal.value)
                    json_dict.update({f'{self.name}_{signal.name}': list(map('{:.0f}'.format, (signal.value*self.bias_scale).round().flatten().tolist()))})
                else:
                    json_dict.update({f'{self.name}_{signal.name}': list(map('{:.0f}'.format, (signal.value*self.weight_scale).round().flatten().tolist()))})
        return json_dict

    def calc_bias_scale(self, weight_scale: float, current_scale: float) -&gt; float:
        '''calculate the scale factor of the bias of the component'''
        if self.template.op_name in ['ReLU', 'Flatten2D', 'ArgMax', 'MaxPooling2D', 'GlobalMaxPooling2D']:
            return current_scale
        if self.template.op_name == 'Poly':
            return current_scale * current_scale
        return weight_scale * current_scale
...
```

Circom only accepts integers as signals, but Tensorflow weights and biases are floating-point numbers. Instead of quantizing the model, weights are scaled up by `10**m` times. The larger `m` is, the higher the precision. Subsequently, biases (if any) must be scaled up by `10**2m` times or even more to maintain the correct output of the network. **keras2circom** automates this process by calculating the maximum `m` possible and scaling each layer accordingly.

**[ZKaggle](https://github.com/socathie/ZKaggleV2): IPFS CID Matching and Universal Encryption Circuits**

**[ZKaggleV2/hardhat/circuits/utils/cid.circom](https://github.com/socathie/ZKaggleV2/blob/main/hardhat/circuits/utils/cid.circom)**

```
pragma circom 2.0.0;

include "../sha256/sha256.circom";
include "../../node_modules/circomlib-ml/circuits/circomlib/bitify.circom";

// convert a 797x8 bit array (pgm) to the corresponding CID (in two parts)
template getCid() {
    signal input in[797*8];
    signal output out[2];

    component sha = Sha256(797*8);
    for (var i=0; i&lt;797*8; i++) {
        sha.in[i] &lt;== in[i];
    }

    component b2n[2];

    for (var i=1; i&gt;=0; i--) {
        b2n[i] = Bits2Num(128);
        for (var j=127; j&gt;=0; j--) {
            b2n[i].in[127-j] &lt;== sha.out[i*128+j];
        }
        out[i] &lt;== b2n[i].out;
    }
}
```

Machine learning datasets are frequently too large to be uploaded directly onto the blockchain, so they are instead uploaded to IPFS. To ensure data integrity throughout the model computation process, a proof-of-concept circuit has been designed to demonstrate the capability of computing an IPFS Content Identifier (CID) that is uploaded as a raw buffer in a circom circuit. This approach verifies that the computation is performed on the designated file, thereby maintaining the integrity of the process.

**[ZKaggleV2/hardhat/circuits/utils/encrypt.circom](https://github.com/socathie/ZKaggleV2/blob/main/hardhat/circuits/utils/encrypt.circom)**

```
pragma circom 2.0.0;

include "../../node_modules/circomlib-ml/circuits/crypto/encrypt.circom";
include "../../node_modules/circomlib-ml/circuits/crypto/ecdh.circom";

// encrypt 1000 inputs
template encrypt1000() {
    // public inputs
    signal input public_key[2];

    // private inputs
    signal input in[1000];
    signal input private_key;

    // outputs
    signal output shared_key;
    signal output out[1001];

    component ecdh = Ecdh();

    ecdh.private_key &lt;== private_key;
    ecdh.public_key[0] &lt;== public_key[0];
    ecdh.public_key[1] &lt;== public_key[1];

    component enc = EncryptBits(1000);
    enc.shared_key &lt;== ecdh.shared_key;

    for (var i = 0; i &lt; 1000; i++) {
        enc.plaintext[i] &lt;== in[i];
    }

    for (var i = 0; i &lt; 1001; i++) {
        out[i] &lt;== enc.out[i];
    }

    shared_key &lt;== ecdh.shared_key;
}
...
```

To maintain the integrity of the proof during the bounty claim process, **ZKaggleV2** incorporates a universal model weight encryption circuit. This circuit is precompiled and deployed for use across all bounties and models. The existing implementation supports models with up to 1000 weights, and any model with fewer weights can be zero-padded at the end to conform to the required size. This approach ensures a consistent and secure method of handling model weights

Please visit the respective repositories linked above for full implementation and usage details.

## Limitations and Potential Improvements

**Proving Scheme: Groth16**

The project currently employs Groth16 as the proving scheme to minimize proof size. However, the platform could be extended to support other proving schemes supported by snarkjs that do not require a circuit-specific trusted setup, such as PLONK or FFLONK.

**Contract Size and Local Testing**

At present, the contracts and frontend can only be tested locally due to the contract size exceeding EIP-170 limit. This constraint poses a challenge for deploying the platform on the Ethereum mainnet (or its testnets) and restricts its usability for wider audiences. To address this limitation, developers could investigate alternative L2 solutions or EVM-compatible chains that offer higher capacity for contract size, enabling this POC to be deployed and used more extensively.

## TLDR and Call to Action

In summary, this project is an innovative proof-of-concept platform trying to bridge the AI/ML and Web3 worlds using ZKPs, by offering a comprehensive suite of tools, including circomlib-ml, keras2circom, and ZKaggleV2.

The open-source community is invited to contribute to the ongoing development of ZKML. In particular, contributions in the form of additional templates for circomlib-ml, extending support for more layers in keras2circom, and reporting any bugs or issues encountered are highly encouraged. Through collaboration and contributions to this exciting project, the boundaries of secure and privacy-preserving machine learning in the Web3 ecosystem can be pushed even further.
