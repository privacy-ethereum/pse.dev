---
authors: ["PSE Team"]
title: "Certificate Transparency Using NewtonPIR [PAPER WITHDRAWN]"
image: "/articles/certificate-transparency-using-newtonpir/certificate-transparency-using-newtonpir-cover.webp"
tldr: "This post was written by PSE grantee Vishal Kulkarni."
date: "2025-01-28"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/V0PIyv1d_e_WPsAVhBP7zkDvn0XACY63uSvFFxBvjrk"
tags:
  [
    "certificate transparency",
    "newtonpir",
    "privacy",
    "security",
    "private information retrieval",
    "fhe",
    "cryptography",
    "web security",
    "tls",
    "zero-knowledge",
  ]
projects: ["pse-security"]
---

## Introduction

### Key concepts

**Certificate Transparency**

[Certificate Transparency (CT)](https://certificate.transparency.dev/howctworks/) is a standard for verifying digital certificates such as those used by websites secured by HTTPS. CT employs a transparent log of certificates issued by a trusted Certificate authority (CA), which anyone can check to verify that a certificate is valid (for most people surfing the web, this is done automatically by the browser).

![If you've ever seen this screen, you've witnessed Certificate Transparency in action!](Certificate%20Transparency%20Using%20NewtonPIR%20%E2%80%94%20Privacy%20and%20Scaling%20Explorations/DlH0JnyUnpx0xrt8leL5h.png)

If you've ever seen this screen, you've witnessed Certificate Transparency in action!

Certificate transparency is an important tool for protecting users from security risks like website spoofing or malicious interference in web traffic, but it also raises some privacy concerns: parties that keep CT logs can potentially gain information about users based on their queries.

**NewtonPIR**

[Private Information Retrieval (PIR)](https://arxiv.org/abs/2304.14397) is a protocol that lets a user get information from a database without revealing to the owner what data they retrieved. PIR has many potential uses in privacy-preserving applications, but it requires complex communication and computation which can be prohibitively expensive with large databases. There are many PIR implementations taking different approaches cryptographic techniques. [NewtonPIR (WITHDRAWN)](https://eprint.iacr.org/archive/2024/1909/1732446191.pdf) is a proposed scheme for highly efficient PIR using [Fully Homomorphic Encryption (FHE)](https://mirror.xyz/privacy-scaling-explorations.eth/D8UHFW1t48x2liWb5wuP6LDdCRbgUH_8vOFvA0tNDJA).

### Private CT queries with NewtonPIR

NewtonPIR enhances privacy in CT by enabling users to query public logs for SSL/TLS certificates without revealing which domains they are checking. This application helps domain owners and auditors ensure no unauthorized certificates have been issued for their domains while maintaining privacy. It prevents CT log operators or third parties from inferring sensitive information about user interests or monitoring activities.

By integrating privacy-preserving queries, this approach supports the core goals of CT ensuring transparency and accountability in certificate issuance without compromising the privacy of the querying parties. It is particularly valuable for large-scale monitoring of CT logs, protecting user confidentiality while upholding security and trust in SSL/TLS ecosystems.

This application would allow users (domain owners, auditors) to query public CT logs for SSL/TLS certificates without revealing the domain names they are checking.This application was initially discussed in this [paper](https://eprint.iacr.org/2022/949.pdf). For further details and insights into their proposed solutions, please refer to the paper.

![CT Workflow](Certificate%20Transparency%20Using%20NewtonPIR%20%E2%80%94%20Privacy%20and%20Scaling%20Explorations/HJFbQKyuyl.png)

CT Workflow

The figure above illustrates the overall workflow of Certificate Transparency, showing how the domain owner requests certificates from the CA, how the CA responds with the SCT, and how logs are monitored.

## Existing SCT Auditing Approaches

Signed Certificate Timestamp (SCT) is a cryptographic proof that a digital certificate has been submitted to a Certificate Transparency (CT) log. It ensures that the certificate is publicly logged and visible. The client uses the SCT received from the server during the TLS handshake to verify if it has been publicly logged.

### 1\. Opt-Out Auditing (Current Chrome Approach)

Rather than client directly interacting with the CT log server Google's solution involves an SCT auditor which maintains a global set of all valid SCTs for active certificates. Allows clients to check if an SCT is valid without directly revealing which SCT they are verifying.

#### How it Works

- Client calculates the hash of the SCT
- Clients reveal the first 20 bits of an SCT's hash to the auditor.
- The auditor provides all matching SCTs (around 1000), achieving k-anonymity (with k=1000).
- Drawback: Partial SCT hash leakage can still compromise privacy.

#### Efficiency

- Google Chrome's model randomly samples 0.01% of SCTs for auditing, drastically reducing costs but also decreasing the chance of catching invalid SCTs.
- Despite this low per-client detection rate, the distributed nature of auditing across many clients ensures high detection probabilities for invalid SCTs.

### 2\. Anonymizing Proxies

- Clients use anonymity-preserving networks like Tor to query the auditor which are intermediaries that hide a user's identity and online activity.
- While anonymity is preserved, the entire distribution of SCTs can still be observed by the auditor.
- When using anonymizing proxies, bugs like [timing attacks](https://medium.com/spidernitt/introduction-to-timing-attacks-4e1e8c84b32b) can exploit variations in response times to infer sensitive information about user activities, such as the websites they visit or the content they access. This is done by correlating the time it takes for requests to pass through the proxy with specific patterns. Similarly, [deanonymization](https://www.techtarget.com/whatis/definition/de-anonymization-deanonymization) can occur through traffic analysis, where the size, frequency, or timing of requests is matched to a user's behavior, or through leaks of metadata or unique identifiers, which expose the user's identity despite the use of the proxy.

## Overview of PIR-CT

**Goal**

- Enable private queries to Certificate Transparency logs using NewtonPIR.
- Prevent CT log operators from learning which certificate (or domain name) a user is querying.

**Core Components**

- NewtonPIR: Efficient single-server PIR to retrieve entries privately from large CT logs.
- Certificate Transparency Logs: Public, append-only logs that store SSL/TLS certificates.
- Client Application: Queries the CT logs using PIR while hiding its query intent.
- Server (CT Log Operator): Hosts the CT logs and responds to PIR-based queries.

## System Design

### Certificate Transparency Logs

- CT logs are stored as a database of certificates where each entry includes: Domain name (e.g., [example.com](http://example.com/)) Certificate details (e.g., public key, issuer, serial number, validity)
- Timestamp: When the certificate was issued.
- SCT (Signed Certificate Timestamp): Proof of inclusion in the log.

Each certificate is uniquely identified by an index in the database.

### Database Setup for NewtonPIR

NewtonPIR operates on a single-server model, where the server stores the CT log database.

Database Format: The CT log is represented as an array:

- D=\[d1,d2,d3,...dn\] where di is the i-th certificate.N is the total number of certificates in the CT log.
- Storage: The CT log operator (server) stores the entire log database in a form accessible for PIR queries. Certificates are indexed sequentially.
- Index Mapping:A mapping is maintained to relate domain names to their corresponding indices.Example: [example.com](http://example.com/) → index 524.

### NewtonPIR Overview

NewtonPIR introduces an efficient single-server PIR scheme that:

- Reduces communication overhead independent of the database size N. Utilizes single-ciphertext Fully Homomorphic Encryption (FHE).
- Leverages Newton interpolation polynomials to optimize query computation.

### Querying Process

The querying process includes the following steps:

- Step 1: Preprocessing (Client Setup)

  - The client initializes the NewtonPIR protocol and generates a query for a specific index i.
  - The query is homomorphically encrypted (FHE-based) so that the server cannot determine which index the client is requesting.

- Step 2: Server Response:-

  - The server processes the PIR query using the NewtonPIR protocol:
  - The query is evaluated over the CT log database. The server computes a response using Newton interpolation polynomials, which reduces computation complexity.
  - The server sends back the encrypted response to the client.

- Step 3: Client Decryption

  - The client decrypts the server's response using their secret key to retrieve the certificate at the requested index.

### Steps for Integrating NewtonPIR into CT

- Log Database Setup:

  - Store the CT logs in an indexed array format on the server.
  - Use NewtonPIR to enable private access to the log entries.

- Query Interface:

  - Build a client-side application where users input a domain name.
  - Convert the domain name into a queryable index (e.g., using a hash or pre-built mapping).

- Private Query:

  - The client formulates a NewtonPIR query for the corresponding index.
  - The query is encrypted and sent to the server.

- Server Computation:

  - The server applies NewtonPIR to process the encrypted query and sends the result back.

- Client Validation:

  - The client decrypts the response to retrieve the certificate.
  - Optionally, verify the certificate's SCT and ensure its correctness.

## Technical Architecture of PIR-CT

- Client-Side Components:

  - Query Generator: Generates homomorphic PIR queries using NewtonPIR.
  - Domain-to-Index Mapping: Resolves domain names to indices in the CT log database.
  - Decryption Module: Decrypts responses from the server.
  - Validation Module: Verifies certificates and SCTs.

- Server-Side Components:

  - NewtonPIR Engine: Processes PIR queries using Newton interpolation and FHE.
  - CT Log Database: Hosts the CT logs in a structured array format.
  - Query Processor: Responds to encrypted client queries.

### Advantages of NewtonPIR for CT

- Efficient Communication:

  - NewtonPIR's communication cost does not depend on the database size N, making it ideal for large CT logs. Privacy-Preserving:
  - The server learns nothing about the client's query (index or domain name).

- Scalability:

  - CT logs can grow to millions of entries without increasing communication overhead.

- Fast Computation:

  - NewtonPIR reduces computational overhead using Newton interpolation polynomials, making it practical for real-world use.
  - Since the logs operate as append-only databases, computing the polynomial using Newton interpolation becomes highly efficient.

- Single-Server Deployment:

  - NewtonPIR works with a single server, simplifying infrastructure requirements.

- Benchmark compared to other PIR Scheme

![](Certificate%20Transparency%20Using%20NewtonPIR%20%E2%80%94%20Privacy%20and%20Scaling%20Explorations/SyLR6fbDkl.png)

### Challenges and Solutions

- Domain-to-Index Mapping:

  - Challenge: Efficiently map domain names to database indices.
  - Solution: Use a hash table or a precomputed index mapping. Log Updates:
  - Challenge: CT logs are constantly updated with new certificates.
  - Solution: Periodically re-index the database to reflect new entries

In this example, I used a simple method with a hashmap, but checking the SCT of every visited site is inefficient. Maybe we should use a data structure like Bloom Filters, which allows for occasional false positives.

- Initial Setup:

  - NewtonPIR requires a preprocessing step to set up the FHE keys and mappings.

### Use Case Workflow

- Client Request:

  - Input: Domain name (e.g., [example.com](http://example.com/)). Convert domain to an index i.

- NewtonPIR Query:

  - Generate an encrypted query for i.
  - Send the query to the CT log server.

- Server Response:

  - The server evaluates the query using NewtonPIR and sends back the encrypted result.

- Client Validation:

  - Decrypt the response to retrieve the certificate.
  - Validate the certificate and its SCT.

## Conclusion

So, does this enable fully private web search? Not entirely. While it prevents the client's browser history from being visible to the CT server, the source server can still identify who is accessing the page, and attackers can use metadata or [fingerprinting](https://www.recordedfuture.com/threat-intelligence-101/vulnerability-management-threat-hunting/fingerprinting-in-cybersecurity) to determine the user's identity.

This blog provides only a basic overview of how PIR can be applied to CT to address a privacy concern. There may be other PIR schemes that could perform better in this context. I'd love to hear your feedback and suggestions for improvement! Join the conversation [here](https://forum.pse.dev/post/1/21).
