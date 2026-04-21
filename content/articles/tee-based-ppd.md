---
authors: ["Takamichi Tsutsumi"]
title: "TEE based private proof delegation"
image: "/articles/tee-based-ppd/cover.webp"
tldr: "Intro to trusted execution environment based private proof delegation"
date: "2025-05-20"
projects: ["private-proof-delegation"]
---

## tl;dr

We built a TEE-based system for secure zero-knowledge proof delegation using Intel TDX. It allows clients to privately outsource large proving tasks without leaking inputs. Unlike mobile-native proving, which is constrained by hardware limits, TEE-based proving can scale to larger statements today — and continue to scale as proof systems improve. As a hardware-backed solution, TEE remains compatible with future advancements in software (e.g., faster proof systems, better engineering) and won't be invalidated by them, as long as the trust model is acceptable.

➡️ [Jump to Benchmarking section](#Benchmarking) to see how it performs in practice.

# Introduction

## Background and motivation

Typically, zk applications let consumer devices such as mobile phones or web browsers generate SNARK proofs. In such cases, the secret inputs from the clients never leave the device; therefore, the privacy of the inputs is protected. However, the complexity of the statements that weak hardware can prove is fairly limited. This means that proving more complex statements requires stronger hardware—something most users do not have access to in their daily lives.
One approach to address this issue is to **delegate the proof generation** to external servers with powerful hardware. This technique is called proof delegation. By using this technique, clients with weak devices can offload heavy computation to an external server and still obtain proof about their private data.
![Proof delegation image](/articles/tee-based-ppd/proof-delegation.webp)
_How naive proof delegation works_
In naive proof delegation, the client sends their raw inputs directly to the proving server, which then generates the proof. This approach works well for non-sensitive computations (e.g., public blockchain state transitions), but it fails to preserve the zero-knowledge property when the inputs are private. The server learns the data as is, so there is no privacy guarantee.

## Private proof delegation (PPD)

**Private proof delegation** (PPD) enhances this model by ensuring the private input remains hidden from the server. This is achieved by introducing a cryptographic layer between the client and the proving server. Instead of sending raw data, the client encrypts the private input before transmission.

![Private proof delegation image](/articles/tee-based-ppd/private-proof-delegation.webp)
_Private proof delegation_

The cryptographic techniques that we can possibly use include

- **MPC ([Collaborative zkSNARKs](https://eprint.iacr.org/2021/1530))** utilizes secret-sharing-based MPC to hide the raw private inputs by splitting them into pieces.
- **FHE**-based approach encrypts the private inputs and computes directly on ciphertext. Example: [Blind zkSNARKs](https://eprint.iacr.org/2024/1684) and [FHE-SNARK](https://eprint.iacr.org/2025/302)
- **TEE**-based approach (this work) utilize hardware-isolated environments to protect data.

In this article, we focus on the TEE-based approach, which we believe is practical and well-supported in today's cloud environments.

# TEE Primer: What and Why

## What is Trusted Execution Environment (TEE)?

A **Trusted Execution Environment (TEE)** is a **secure and isolated processing environment** that runs alongside the main operating system on a machine. It provides:

- **Confidentiality** ensures that data inside the TEE cannot be read by any external software, including the operating system or hypervisor.
- **Integrity** ensures that the code and data inside the TEE cannot be tampered with from outside.
- **Attestation** allows remote parties to verify that the TEE is running trusted code before sending sensitive data to it.

TEEs are critically important for scenarios where sensitive data or computations must be processed on potentially **untrusted infrastructure**. Without a TEE, users would have to fully trust the operator of a server — an assumption often unacceptable in privacy-critical applications like private proof delegation.

Different TEE implementations exist today, such as [Intel SGX](https://www.intel.com/content/www/us/en/products/docs/accelerator-engines/software-guard-extensions.html), [ARM TrustZone](https://www.arm.com/technologies/trustzone-for-cortex-a), [AMD SEV](https://www.amd.com/en/developer/sev.html), and [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html). Each offers varying degrees of isolation, threat models, and usability.

## Key components

There are several key components of TEE:

- Hardware isolation
- Memory encryption
- Remote attestation
- Root of Trust

We will take a closer look into each of the items.

### Hardware isolation

At the heart of any Trusted Execution Environment (TEE) is the concept of hardware-enforced isolation. Hardware isolation refers to the physical and logical mechanisms built directly into the CPU and platform architecture that create a boundary between the execution environment inside the TEE and the rest of the system (Rich Execution Environment, REE)—including the operating system, hypervisor, firmware, and other software running outside the TEE.

Rather than relying on software controls (which can be bypassed by privileged attackers), hardware isolation ensures that:

- Memory regions associated with the TEE are inaccessible to any external software, regardless of privilege level.
- Only code running inside the TEE itself can read or modify its protected memory and internal state.
- External attempts to inspect, tamper, or interfere with the TEE are either blocked at the hardware level or immediately detectable.

This isolation is enforced by mechanisms such as

- Memory address translation and access control rules tightly integrated with the CPU
- Dedicated secure memory regions (e.g., Enclave Page Cache in Intel SGX, Secure EPT in Intel TDX)
- CPU privilege separation between "trusted" and "untrusted" execution modes

### Memory encryption

While hardware isolation protects the logical boundaries of the Trusted Execution Environment (TEE), it does not by itself prevent physical attacks targeting the system’s memory. For example, if the attacker has access to the physical hardware, it is possible to dump the memory to see the data inside. Memory encryption addresses this gap by ensuring that all data stored outside the CPU boundary — particularly in RAM — remains cryptographically protected by encryption schemes against unauthorized access, even in the face of direct hardware attacks. The data stored inside the memory is always encrypted with a key secured in the chip (only TEE can access the key). For example, in Intel TDX, AES-XTS with ephemeral 128-bit memory-encryption keys (TDX) are used for encrypting the data, and the integrity of the data inside memory is guaranteed by SHA-3-based MAC so that malicious data tampering can be detected.

This ensures that

- Even if an attacker has physical access to the machine (e.g., cold boot attacks, bus sniffing), the data they retrieve from RAM remains unintelligible.
- DMA (Direct Memory Access) attacks by peripherals cannot extract plaintext secrets from memory regions assigned to the TEE.
- Side-channel leakage through unprotected memory reads/writes is minimized.

### Remote attestation

Even with hardware isolation and memory encryption, a crucial question remains:
**"How can a remote party trust that the TEE is running the intended code on a genuine, uncompromised platform?"**

**Remote attestation** answers this question. It is the process by which a TEE proves to an external verifier that:

- It is running on authentic, trusted hardware.
- The code executing inside the TEE matches an expected and approved version.
- The system's security configuration (e.g., secure boot, memory protections) is correctly enabled.

This proof enables remote clients to establish trust before transmitting sensitive data or initiating private computations.

- The booted TD image exactly as expected (secure boot).
- The measurements created/extended during runtime are as expected.
- The TEE is executed on a certified hardware platform.
- The platform is fully up to date (TCB).

If the measurements match, the verifier can trust the TEE is in a secure and expected state.

Technologies like Intel TDX TD Quote, Intel SGX Attestation Service, and TPM 2.0 Quotes implement these mechanisms.

### Root of Trust

At the foundation of any Trusted Execution Environment (TEE) lies the concept of a **Root of Trust** — a minimal, immutable, and trusted set of hardware, firmware, and cryptographic keys that anchors all higher-level security guarantees. Without a reliable root of trust, none of the protections offered by hardware isolation, memory encryption, or remote attestation would be meaningful.

A Root of Trust is the starting point from which trust is established and extended throughout the system. It typically involves

- Immutable hardware components (such as CPU microcode or a dedicated security processor)
- Secure boot firmware that verifies each stage of system initialization
- Cryptographic keys (e.g., device identity keys, endorsement keys) that are embedded during manufacturing and protected from software access

In Intel TDX and similar TEEs, the root of trust is composed of

- Intel-manufactured CPU with trusted microcode
- Hardware-isolated execution of the TDX modules
- Secure generation and protection of attestation keys used for producing TD Quotes

Importantly, the security of the entire TEE — including attestation, isolation, and encryption — ultimately depends on the integrity and authenticity of this Root of Trust.

## What is the trust assumption of TEE?

In traditional cryptography, security relies on mathematical hardness assumptions — for example, the difficulty of solving the Discrete Logarithm Problem (DLP) or the intractability of Learning With Errors (LWE). These assumptions are well-studied and allow cryptographic protocols to provide strong, quantifiable security guarantees.

In contrast, when relying on a Trusted Execution Environment (TEE), security instead depends on a different class of assumptions: trust in hardware, firmware, and system integrity.
Rather than assuming a computational problem is hard, we assume that certain hardware components behave correctly, securely, and without malicious interference.

While TEEs dramatically reduce the size of the trusted computing base compared to trusting a full server or cloud provider, they do not eliminate trust. Instead, they restructure it — concentrating trust in a small, specialized portion of the system.

In this section, we detail what specific components and entities must be trusted when building on a TEE.

### Trust in the Hardware Manufacturer

A fundamental trust anchor when using a TEE is the **hardware manufacturer**. In the case of Intel TDX, this is Intel Corporation, which designs and produces the processors and microcode that enforce TDX protections.

When trusting the hardware manufacturer, the following assumptions are made:

- **Correct Implementation**:
  The manufacturer has correctly implemented the TEE architecture as specified, including hardware isolation, memory encryption, key management, and the attestation mechanism. Errors or backdoors in the hardware implementation could trivially undermine the TEE’s guarantees.
- **Secure Key Provisioning**:
  Attestation keys (used to sign attestation quotes) are provisioned securely during the manufacturing process and cannot be extracted, replaced, or misused.
- **Supply Chain Integrity**:
  The physical chip that arrives at the cloud datacenter is authentic and has not been tampered with or replaced during production or delivery.
- **Prompt Security Response**:
  If vulnerabilities are discovered (e.g., speculative execution side-channels), the manufacturer acts responsibly to issue patches, microcode updates, or mitigations.

**What if Broken**
If the hardware manufacturer is dishonest, coerced, or negligent, the entire security model of the TEE collapses. The TEE could leak secrets, forge attestation quotes, or fail to enforce isolation — without any detectable signals to the user.

This trust assumption is not cryptographic in the traditional sense; it is institutional and engineering-based.

### Trust in the Attestation Service

The attestation process is what enables remote parties (such as clients) to verify the trustworthiness of a TEE before entrusting it with sensitive data. However, the correctness of attestation relies on the integrity of the attestation service infrastructure.

Typically, there are two main parties involved:

- **Hardware-Rooted Attestation Key Infrastructure** (e.g., [Intel’s Provisioning Certification Service (PCS)](https://sbx.api.portal.trustedservices.intel.com/provisioning-certification))
- **Remote Attestation Verification Services** (e.g., [Intel Attestation Service (IAS)](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/attestation-services.html) or [Microsoft Azure Attestation](https://azure.microsoft.com/en-us/products/azure-attestation))

When trusting the attestation service, the following assumptions are made:

- **Authenticity of Device Identity**:
  The attestation key bound to the physical device is genuine and was issued by the manufacturer’s trusted key hierarchy.
- **Correct Verification and Validation**:
  The attestation service correctly verifies the quotes it receives, checking that: - Measurements match an expected secure configuration. - Firmware and security versions meet minimum patch levels. - No security policy violations have occurred.

- **Impartial and Secure Operation**:
  The attestation service must behave honestly, not issuing approvals for devices that are compromised, outdated, or misconfigured.
- **Resistance to Collusion or Coercion**:
  The attestation service must resist external pressures (e.g., nation-state coercion) that might lead it to falsely attestation to an insecure environment.

**What if Broken**
If the attestation service incorrectly verifies a compromised TEE — or worse, issues fabricated attestation results — remote users would falsely believe they are communicating with a secure environment.
This would completely undermine the remote trust model that TEEs are designed to enable.

---

# TEE-based private proof delegation

## Construction of TEE-based private proof delegation

TEE-based private proof delegation system involves a few additional components compared to naive PPD system. In this section, we describe how to construct a TEE-based private proof delegation system.

![TEE based PPD architecture](/articles/tee-based-ppd/tee-ppd.webp)
_Architecture diagram_

In the architecture diagram above, we can see several components, including

- Client
- TD Host
- TD Guest (Prover)
- Attestation provider
- Verifier

**Client** is a party who wants to have a zk proof about a statement using their private input. Typically this party computes the proof by itself, but somehow it wants to delegate the proving computation to external parties.

**TD Host** is a host OS running on a server that runs the TEE VM inside. In Intel TDX, the TEE VM is called trusted domain (TD); therefore, we call this host OS a TD host. TD host physically runs the TEE VM (TD guest) on the machine, but the OS, firmware, and supervisors cannot access the data inside the guest VM thanks to the TEE functionality, such as memory encryption. The TD guest is isolated from the TD host.

**TD Guest (Prover)** is a TEE VM running inside the TD host. This party actually computes the zk proof on behalf of the client. In order to make the safe transfer of the secret data, TD guest and client have to establish a secure communication channel so that no one else can read the data passed between the two parties. TD guest will decrypt the data passed through the channel, run the proof computation, and send the proof data back to the client. At the beginning, the TD guest is asked to generate TD quote for the remote attestation by the client. They get a quote and send its data to the attestation provider to securely attest to its state.

**Attestation provider** is a party who provides a secure remote attestation capability. This party will provide a quote verification and generate attestation using pre-registered TEE hardware information. In this scenario, we have to trust this attestation provider correctly registered the hardware info, like its embedded keys and keychains.

**Verifier** is anyone who verifies the generated proof.

## Execution flow

### Remote Attestation

We start the whole process with remote attestation. In this step, the client ensures that the prover VM is running on legitimate hardware and firmware, OS, and program.

### What Happens

1. The **TEE environment** (such as a confidential VM or enclave) begins by measuring its **initial state** at launch time. These measurements include:

   - The code and data loaded into the TEE at startup
   - Configuration values (e.g., enabled security features, TEE attributes)

2. These measurements are securely recorded in **platform-protected registers**, such as:

   - Platform Configuration Registers (PCRs) in a TPM
   - Runtime Measurement Registers (RTMRs) or equivalent TEE-specific structures

3. The TEE then generates an **attestation report** — a structured message that includes:

   - The recorded measurements
   - TEE metadata (such as the identity of the code, runtime version, and security configuration)
   - Optional application-specific data (e.g., a nonce or public key from the client)

4. This attestation report is sent to a trusted component inside the platform known as the **attestation signing agent** (e.g., a _quoting enclave_, _firmware-based attestation module_, or _secure co-processor_).

5. The attestation signing agent signs the report using a **manufacturer-provisioned attestation key**. This key is

   - Cryptographically tied to the device
   - Certified by the TEE vendor (e.g., Intel, AMD, ARM)
   - Stored and used in a protected environment inaccessible to untrusted software

6. The resulting **attestation quote** is returned to the TEE and passed to the **client** (or relying party) that requested attestation.

7. The client forwards the quote to a **remote attestation service**, which:

   - Verifies the signature on the quote using the manufacturer’s root certificate
   - Validates the integrity and freshness of the TEE’s measurements
   - Confirms that the platform is genuine, up-to-date, and securely configured

8. If successful, the attestation service returns a signed statement (e.g., JWT, certificate, or signed JSON blob) to the client, confirming the TEE’s authenticity.

9. The **client** examines this attestation result, ensuring:
   - The measured code matches the expected application.
   - All required security features (e.g., secure boot, memory encryption) are active.
   - The quote is recent and bound to a valid nonce or challenge.

Only once this trust is established does the client proceed to send sensitive data to the TEE.

---

### Runtime Attestation with Linux IMA and Keylime

While launch-time attestation provides assurance that a Trusted Execution Environment (TEE) **starts in a known-good state**, it does not cover what happens _after_ boot. A malicious actor could, for example, replace a binary or tamper with configuration files post-launch without affecting the original attestation quote.

To address this, we incorporate **runtime attestation** using the **[Linux Integrity Measurement Architecture (IMA)](https://www.redhat.com/en/blog/how-use-linux-kernels-integrity-measurement-architecture)** and the **[Keylime](https://keylime.dev/)** framework.

---

#### What Is Linux IMA?

**IMA** is a Linux kernel subsystem that measures files — such as executables, libraries, scripts, and configuration files — _at the time they are accessed_. It maintains a **measurement log**, which contains cryptographic hashes of all accessed files. These hashes are extended into a **Platform Configuration Register (PCR)** (typically **PCR10** in TPM-backed systems).

This allows the system to:

- Detect if any critical file has been changed or tampered with.
- Compare runtime measurements against a reference "good" state.
- Bind application behavior to expected code and configuration.

---

#### What Is Keylime?

**Keylime** is an open-source remote attestation framework designed to work with IMA. It allows a **remote verifier** (e.g., a client) to continuously monitor the integrity of a **running system**, including a TEE-based confidential VM.

Keylime components include:

- **Agent (inside the TEE guest)**: Reports IMA measurements and TPM quotes
- **Verifier (outside the TEE)**: Validates measurements against a policy
- **Registrar**: Manages key provisioning and trust setup

---

#### How Runtime Attestation Complements Launch-Time Attestation

| Launch-Time Attestation                               | Runtime Attestation (IMA + Keylime)               |
| ----------------------------------------------------- | ------------------------------------------------- |
| Validates integrity at the point of TD creation       | Monitors integrity throughout execution           |
| Covers bootloader, kernel, early OS state             | Covers binaries, libraries, config files, scripts |
| Performed once at startup                             | Ongoing or on-demand validation                   |
| Bound to hardware measurement registers (e.g., RTMRs) | Bound to TPM PCRs (e.g., PCR10)                   |

#### Benefits in a ZK Proving Context

In delegated proving, runtime attestation can ensure that:

- The ZK prover binary running inside the TEE has not been modified or replaced.
- The proving key and parameters are untampered.
- The system hasn’t silently switched to an insecure configuration.

This provides **stronger guarantees to the client** — not only is the environment secure at boot, but **it remains secure during execution**.

---

#### Deployment in TEE-Based Setup

1. The TEE guest VM runs a Linux kernel with IMA enabled.
2. The IMA policy is configured to measure:
   - ZK prover binary
   - Dependencies and shared libraries
   - Config files and proving keys
3. The Keylime Agent runs inside the TEE guest and periodically sends:
   - TPM quotes (including PCR10)
   - IMA measurement log
4. The remote Keylime Verifier (e.g., hosted by the client) checks:
   - The TPM quote's signature
   - That IMA measurements match an expected whitelist

---

### Trust Model Enhancement

By combining

- **Launch-time attestation** (via TEE quote + attestation service), and
- **Runtime attestation** (via IMA + Keylime + TPM),

We create a **two-layer trust model** where the client can verify:

1. The TEE starts securely and is properly configured.
2. The integrity of the prover binary and environment is continuously enforced.

This layered approach significantly raises the bar against both **transient** and **persistent** attacks on delegated ZK proving infrastructure.

## Secure channel setup

Once attestation confirms that the TEE is in a trusted state, the client needs a secure way to transmit private data — such as private inputs — into the TEE without exposing them to the untrusted host. We can use secure communication channels such as TLS.

---

#### Purpose

- Protect the client’s sensitive data in transit.
- Ensure data is delivered **only to the verified TEE**.
- Prevent tampering or interception by the host or hypervisor.

---

#### How It Works

1. **Attestation is completed**, and the client verifies the TEE’s integrity.
2. In our implementation, we used **Keylime’s secure payload delivery mechanism**:
   - The **Keylime Tenant** sends the encrypted data to the **Keylime Agent** running inside the TEE guest.
   - This only happens **after the TEE passes both launch-time and runtime attestation**.
   - Keylime tenant and agent are communicating via mTLS channel.
3. The Keylime Agent receives and decrypts the data inside the TEE.
4. The proving process begins using the securely provisioned input.

## Proof generation and verification

Once all the data needed to compute the zk proof, the TD guest can now compute the proof. This part is pretty much the same as normal computation because we can run exactly the same binaries as in the normal server.

When proof is computed, TD guest sends the proof back to the client or any third party who wants to verify the proof.

# Benchmarking

We took benchmarks of the system architecture described in the previous section. The benchmark targets are **[semaphore](https://semaphore.pse.dev/)** and [proof-of-twitter](https://github.com/zkemail/proof-of-twitter/tree/main) from **[zkemail](https://prove.email/)**. Both are important client applications that utilize zk proof for privacy. The results help assess whether modern TEEs offer a viable foundation for private proof delegation in practice.

The first thing we did was to take benchmarks of the semaphore circuit using [this repo](https://github.com/vplasencia/semaphore-benchmarks).
For the semaphore we ran three benchmarking settings.

1. Benchmark for proof generation inside TEE VM
2. Benchmark for proof generation inside normal VM
3. Benchmark for E2E TEE-based private proof delegation setting

For 1 and 3, we use the Azure VM Standard_EC16eds_v5 series; for 2, we use the Azure Standard_E16ds_v5 series. Both have a RAM size of 128 GiB and 16 vCPUs. The only difference is if TEE functionality is turned on or not.

For zkemail, we used proof-of-twitter circuit to measure the number. For this, we only took E2E benchmarks to see if the whole system can provide an acceptable number.

## Semaphore benchmarks

1. Benchmark for proof generation inside TEE VM
   ![Benchmark1](/articles/tee-based-ppd/benchmark1.webp)
2. Proof generation inside normal VM
   ![Benchmark2](/articles/tee-based-ppd/benchmark2.webp)

E2E benchmarks
In our scenario, we measure the E2E performance, including

- Keylime runtime attestation
- TDX attestation
- Proof generation
- (We skipped the actual transfer of secret input data in this scenario)

|                     | 1      | 2      | 3      | Avg.   |
| ------------------- | ------ | ------ | ------ | ------ |
| Keylime attestation | 901ms  | 591ms  | 597ms  | 696ms  |
| TDX attestation     | 1065ms | 1041ms | 1040ms | 1048ms |
| Proving             | 1147ms | 1133ms | 1128ms | 1136ms |
| Total               | 3166ms | 2803ms | 2809ms | 2926ms |

## zk-email benchmarks

We use the proof-of-twitter circuit as our benchmark target. This demonstrates a real-world use case for TEE-based private proof delegation. The benchmark was taken for the E2E setting, as in the semaphore benchmark.

|                     | 1       | 2       | 3       | Avg.    |
| ------------------- | ------- | ------- | ------- | ------- |
| Keylime attestation | 885ms   | 606ms   | 633ms   | 708ms   |
| TDX attestation     | 1079ms  | 1387ms  | 1820ms  | 1428ms  |
| Proving             | 87213ms | 57185ms | 56976ms | 67124ms |
| Total               | 89224ms | 59216ms | 59462ms | 69300ms |

## Discussions

See Table 2—the ~67s proving time dominates E2E latency, so in this case, TEE overhead becomes <5 %. Our benchmarks show that TEE-based delegated proving is both **feasible and practically performant** for real-world zero-knowledge applications — with varying trade-offs depending on the circuit size and security assumptions.

### Attestation Overhead Is Modest

Both **Keylime runtime attestation** and **TDX launch attestation** contribute **1.74 s total (696 ms + 1 048 ms)** in both cases. In the Semaphore benchmark, their combined overhead accounts for less than 25% of the total latency. This indicates that

- **Launch-time and runtime attestation are fast enough** to be included in every proving session.
- They can be embedded into interactive or on-demand proving scenarios without causing significant delay.

However, it's important to note that our benchmarks used a **simple attestation policy** that only performs **signature verification** on the attestation quote.
In a production setting, policies may include

- Validation of **RTMR (Runtime Measurement Register)** values
- Checks for **specific file measurements** via IMA
- Enforcement of secure configuration (e.g., Secure Boot, kernel version)

Such policies would add additional verification steps, which could modestly increase attestation latency.

### Input Transfer Cost Not Accounted

Our current benchmark **skips the actual transfer of secret input data** (e.g., witness values, proving keys if needed). In real deployments, this step involves

- Transmitting encrypted payloads over a secure channel (e.g., via mTLS)
- Decrypting and loading the data inside the TEE

The cost of this step depends on

- **Payload size** (some proving inputs may be tens or hundreds of megabytes)
- **Network conditions**, including latency and bandwidth
- **Disk I/O**, if data is staged or stored before proving

While not captured here, this cost should be considered for systems with large or frequent input provisioning.

## Proving Time Dominates for Larger Circuits

The **zkEmail circuit** (based on proof-of-Twitter) demonstrates a **much larger proving time** — averaging over 67 seconds — due to higher circuit complexity. In contrast, the **Semaphore proof** completes in just over 1.1 seconds on average.

This reinforces a key insight:

- The performance bottleneck shifts from attestation to proving as circuit size grows.
- TEE-induced overhead is amortized in large proofs, making the TEE setup cost relatively negligible in long-running sessions.

## Scalability and Future Acceleration

One advantage of using a **VM-based TEE like Intel TDX** is the ability to **scale up compute resources**:

- On platforms like Azure, we can increase the number of vCPUs and available memory by selecting a larger VM size (e.g., scaling from 4 to 16 or 32 cores).
- This enables faster proof generation for large circuits without modifying the security model or proving logic.

Furthermore, although we have not explored it in this benchmark, **[GPU acceleration is becoming increasingly feasible](https://developer.nvidia.com/blog/confidential-computing-on-h100-gpus-for-secure-and-trustworthy-ai/)** within TEE environments. Some confidential computing frameworks are beginning to support

- GPU passthrough into confidential VMs
- Secure offloading of compute-intensive workloads (like FFTs, MSMs) into trusted GPU regions

If applicable to the proving backend, this could **dramatically reduce proof times** for large circuits — especially for modern SNARKs and STARKs with GPU-optimized primitives.

## Comparison with Other Approaches

To contextualize our results, we briefly compare TEE-based delegated proving with two alternative approaches:

- **Collaborative zkSNARKs**: These use multi-party computation (MPC) to split proof generation across multiple participants. While they eliminate the need to trust hardware, they typically involve higher coordination and communication overhead.

- **[MoPro](https://zkmopro.org/)**: A mobile-native ZK prover designed to run directly on smartphones. It removes the need for delegation entirely but is limited by the constraints of mobile hardware.

---

Thanks to **Roman from [TACEO](https://taceo.io/)**, we also have a benchmark for the same Semaphore circuit using collaborative zkSNARKs with CoCircom. In this setup, three MPC parties ran inside the same data center on **m7a.4xlarge** machines (16 vCPUs, 64 GiB RAM). The total proving time, including witness extension and proof generation, was **626 ms + 39 ms**.

Although performance depends heavily on specific configurations (e.g., number of parties, network latency), these results show that collaborative SNARKs are a **viable option** for delegated proving.

However, since both collaborative SNARKs and TEE-based proving rely on cloud infrastructure, it's important to compare their **infrastructure costs**.

According to Azure's VM pricing:

- **Standard_E16ds_v5** (non-TEE): $1,010.32/month
- **Standard_EC16eds_v5** (TEE-enabled): $1,012.32/month

This means adding TEE features incurs **virtually no extra cost** — only around $2/month.

In contrast, collaborative SNARKs typically require **n servers** for n-party computation. So, for a 3-party setup, the base cost is **at least 3× higher** than the TEE-based model.

---

We also have benchmark data for mobile proving using **MoPro**, available [here](https://zkmopro.org/docs/performance/). For Semaphore, witness generation and proof creation on an **iPhone 16 Pro** ranged from **165 ms to 1267 ms**, depending on the library.

However, circuits that require large memory (e.g., 3 GB for iPhone 15) tend to **crash** on native apps. This is a known limitation when using proving backends that rely on **large proving keys**.

For context, the typical hardware specs used in these mobile benchmarks are

- **iPhone**: 6-core CPU @ 3.33 GHz, 5.7 GiB RAM
- **Android**: 7-core CPU @ 2.16 GHz, 3.82 GiB RAM

These constraints illustrate the challenge of using mobile-native proving for larger circuits.

---

## Relative Comparison (based on our benchmarks)

| Approach               | Semaphore Circuit             | Notes                                       |
| ---------------------- | ----------------------------- | ------------------------------------------- |
| TEE                    | ~210ms (proving), ~2.9s (E2E) | Fast, attested, scalable                    |
| Collaborative zkSNARKs | ~ 700ms (proving)             | Needs coordination; performance varies      |
| MoPro                  | 165 ~ 1267ms (proving)        | Local execution; limited by mobile hardware |

# Conclusion

Our benchmarks show that **TEE-based delegated proving** is both practical and performant for real-world zero-knowledge applications like **Semaphore** and **zkEmail**.

With modest attestation overhead, strong confidentiality guarantees, and the ability to scale VM resources, this approach offers a compelling balance between **security, performance, and deployability**. While it requires trust in hardware and attestation infrastructure, it avoids the coordination complexity of MPC-based proving and the limitations of mobile-native approaches.

TEE-based proving is ready for real deployment — especially in cloud-based privacy systems where trust, verifiability, and performance must coexist.

---

## Future work

- Scale to larger circuits using more powerful VMs or GPUs.
- Bind attestation results directly to ZK proof outputs.
- Extend runtime integrity policies for broader trust coverage.

---

## Appendix

## Our choice of TEE

Trusted Execution Environments (TEEs) come in multiple forms, distinguished primarily by the granularity of isolation they provide.
The two most prominent architectures are process-based TEEs and VM-based TEEs.

![Trust boundary image](/articles/tee-based-ppd/trust-boundary.webp)
_Trust boundary of different types of TEEs_

#### **Process-Based TEEs**

Examples: Intel SGX, ARM TrustZone

Characteristics:

- Isolation is established at the process level within the host operating system.
- A process (or subset of code, called an enclave) runs inside a secure container, isolated from the rest of the OS and other applications.
- Typically smaller Trusted Computing Base (TCB) — only the enclave and runtime libraries.
- OS and hypervisor are assumed to be untrusted.

Strengths:

- Minimal TCB: Only the application code inside the enclave must be trusted.
- Fine-grained isolation for very sensitive workloads.

Limitations:

- Severe memory size restrictions (e.g., Intel SGX enclaves are limited to ~128 MiB EPC in early generations).
- Complex programming model: Developers must explicitly partition application logic between "trusted" and "untrusted" code.
- I/O and system call complexity: Accessing external resources (files, network, etc.) requires complex enclave exits and marshaling.
- Harder scalability: Managing large applications inside small enclaves can be extremely difficult.

#### **VM-Based TEEs**

Examples: Intel TDX, AMD SEV-SNP

Characteristics:

- Isolation is established at the full virtual machine level.
- The entire guest VM — including its OS and applications — is isolated from the hypervisor and the host system.
- The guest OS and applications can largely run unmodified.

Strengths:

- Larger memory footprint: VM-based TEEs can access many gigabytes of encrypted memory.
- Simplified development: No need to rewrite or partition applications; existing software stacks can run inside the confidential VM.
- Better I/O and networking support: Standard drivers and system interfaces work without complex marshalling.
- Cloud-native scaling: VM-based TEEs fit naturally into existing infrastructure-as-a-service (IaaS) models (Azure, AWS, GCP).

Limitations:

- Larger TCB compared to process-based TEEs (full guest OS must be trusted unless further minimized).
- Slightly higher performance overhead compared to native execution (due to memory encryption and virtualization).

#### Why VM-Based TEE Is Better for Our Purpose

In our private proof delegation use case — where we generate zero-knowledge proofs inside the TEE — the requirements favor VM-based TEE designs for several reasons:

**Large Memory Requirements**:
ZK proof generation (especially for circuits like Semaphore and zkEmail) often requires large working memory. Process-based TEEs like SGX would be severely constrained, causing paging and drastic performance penalties.

**Unmodified Execution Environment**:
The ZK proof generation tools (e.g., snarkjs, custom Rust provers) can run on a normal Linux environment without major changes. A VM-based TEE lets us leverage standard OS functionality and libraries without adapting the application to enclave SDKs.

**Simplified Development and Maintenance**:
VM-based TEEs allow the entire application stack to be secured without restructuring the application into trusted/untrusted partitions, greatly reducing engineering complexity.

**Cloud Deployment Compatibility**:
Azure Confidential VMs (ECedsv5 series) allow seamless deployment, scaling, and management of TDX-based VMs. This fits naturally into cloud-native workflows for scaling proof delegation infrastructure.

**Remote Attestation Support at VM Level**:
VM-based TEEs like TDX provide attestation mechanisms that cover the entire VM, enabling strong guarantees about the full execution environment — not just a single process.

![Azure CVM](/articles/tee-based-ppd/cvm-availability.webp)
_Confidential VM availability on Azure_
