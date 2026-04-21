---
authors: ["Vikas Rushi"]
title: "zkPDF: Unlocking Verifiable Data in the World's Most Popular Document Format"
image: "/articles/zkpdf-unlocking-verifiable-data/cover.webp"
tldr: "zkPDF lets you prove facts from signed PDFs without revealing the entire document."
date: "2025-06-13"
canonical: ""
tags:
  [
    "zkpdf",
    "zero-knowledge proofs",
    "privacy",
    "pdf",
    "zkid",
    "digilocker pdfs",
  ]
projects: ["zk-id", "anon-aadhaar", "openpassport", "zk-email"]
---

**TL;DR**
We’ve built **zkPDF**—a set of zero-knowledge circuits and tools for proving facts from digitally signed PDFs without revealing the full document. zkPDF combines digital signature checks with selective content proving, enabling privacy-preserving claims from the most widely used document format.

## The Ever-Expanding Ecosystem of Signed Data

We've already made remarkable progress in **"SNARKifying"** various forms of signed data. The ability to cryptographically verify information while preserving privacy isn't just theoretical anymore—it's production-ready and being used in real-world applications at large. Consider what is actively in use today:

- **ZK-Email:** Email verification, allowing users to prove specific facts about email content without revealing the email itself.
- **National Identity Cards:** Projects like **Anon Aadhaar,** India's Aadhaar program has over **1.4 billion** digital identities, and Anon Aadhaar allows users to prove they have a valid Aadhaar card and are over 18 without revealing their identity number, name, or other personal details.
- **Electronic Passports:** There are **1.2+ billion** e-passports in global circulation, each containing cryptographically signed biometric data that prevents forgery and identity theft at borders—a testament to worldwide adoption of verifiable physical documents.
- **Web Data (zkTLS, RFC9421, SXG):** Emerging technologies like zkTLS allow users to prove specific content on a website

Yet despite all these advances, one critical piece has remained out of reach: **PDFs**. This is the sleeping giant of signed data. The PDF Association estimates that "well over 90 percent of all signed documents are PDFs," with the e-signature market growing at over 25% annually through 2025. PDFs represent a significant volume of signed data, perhaps the most universal but least programmable format in our current verification ecosystem.

---

## Why is Proving PDF Facts Privately So Difficult?

Every day, we rely on digital documents we assume are authentic. When you download your diploma, sign a contract, or check your bank statement, you trust that these documents are legitimate. The problem is: when you need to prove something inside your PDF, you have no choice but to share the entire document. Many PDFs aren’t digitally signed at all—so there’s no embedded proof of authenticity to verify. And for those that are, classical RSA with SHA-1 or SHA-256 takes significantly less proving time and fewer constraints than most elliptic-curve signature schemes.

**Why is the world's most common document format so hard to "SNARKify"?**
The technical challenges are non-trivial. Generating a verifiable proof about PDF content generally involves a three-step process, each with its own set of difficulties:

- **Verification of the Digital Signature:** Proving the authenticity of a signed PDF.
- **Parsing the PDF Document:** Extracting meaningful data from the PDF's structure.
- **Applying Logic on Content:** Performing operations like string matching, regular expressions, or enabling selective disclosure on the extracted content.

### Computational Complexities

Digital signatures on PDFs require hashing entire documents. When your average signed PDF is 300KB to 5MB (or sometimes much larger), hashing that amount of data inside a zero-knowledge circuit creates an astronomical computational burden. Proving times are in the order of hours or days—if they complete at all.

### PDF Parsing and Text Extraction

PDFs aren’t just documents—they're sophisticated instruction sets built on over 30 years of layered complexity. A PDF file typically includes:

- Intricate trees of interconnected objects and cross-references
- Multiple advanced compression schemes
- Complex font and text-rendering instructions
- Legacy features from decades of evolution
- **Multilingual Text Handling:** Different scripts use varied encodings, font mappings, and layout rules, making reliable extraction a major challenge. Our modular parser tackles these issues and even provides full CJK (Chinese) support for accurate text reconstruction.

They don't simply store readable text—they specify detailed instructions on how to _draw_ text, defining precise fonts and exact character placements.

For a ZK circuit to prove facts about a PDF document’s contents, it must interpret this intricate font rendering logic, glyph tables, and detailed positioning to reconstruct readable text. Incorporating such comprehensive font-rendering engines within ZK proofs adds significant computational overhead, making this task prohibitively complex.

### Client-Side Proving

Given the immense computational requirements for hashing large PDF files and the inherent complexity of parsing PDF structures within a ZK circuit, performing client-side ZK proof generation for PDFs is currently infeasible. Modern web browsers and mobile devices lack the raw processing power and memory necessary to handle the astronomical number of constraints and the extensive proving time involved.

---

## How zkPDF Solves These Problems

Our solution addresses these challenges by adopting a highly efficient and "circuit-friendly" approach, leveraging the power of a **Zero-Knowledge Virtual Machine** and custom-built tooling.

Since performing client-side ZK proof generation for multi-megabyte PDFs is currently infeasible due to the hashing overhead, we have chosen **SP1 ZKVM** as our proving environment. SP1 is a performant, open-source ZKVM that allows us to write our ZK circuits in native Rust.

In the future to address this, especially for trust-minimized production deployments, we envision using **private proof delegation or trusted execution environment** (TEE) servers to offload the heavy computational task of proof generation.

For our current Proof-of-Concept, we are utilizing the **SP1 prover network** to generate these proofs.

---

### Building Robust PDF Parsing

A significant hurdle was the incompatibility of existing Rust PDF parsing crates (like `pdf-extract` or `lopdf`) with the SP1 ZKVM. These libraries often contain heavy dependencies, make frequent calls to C native code, and have architectural elements that do not translate well into the ZKVM's execution model.

To overcome this, we embarked on building our own [**native PDF text parsing library**](https://github.com/privacy-scaling-explorations/zkpdf/tree/main/pdf-utils/extractor). This custom-built library is specifically designed to function efficiently within a ZKVM. It focuses on the core functionalities required:

- **Page-by-Page Full Text Parsing:** Instead of attempting to parse the entire PDF document's complex structure indiscriminately, our solution focuses on processing the document page by page.
- **Robust Text Handling:** This approach reliably handles the intricacies of text drawing instructions, embedded fonts, glyphs, and various encoding schemes, allowing for accurate semantic interpretation of the text content.
- **Minimal Dependencies:** Crucially, it has only one external dependency (for Deflate compression), making it lightweight and suitable for ZK constraints.

In addition to our custom parser, we are leveraging a [**Signature Verification library**](https://github.com/privacy-scaling-explorations/zkpdf/tree/main/pdf-utils/signature-validator) that can take arbitrary PDF content and verify its digital signature against its embedded certificate. To further optimize its performance within the ZKVM, we are actively integrating and utilizing **SP1 precompiles**, which allow for highly efficient cryptographic operations.

### How zkPDF Works

Our solution follows a two-step process to prove facts about PDFs without revealing the whole document:

- **Verify the Digital Signature:** First, we check the digital signature of the entire PDF to confirm the document is authentic and hasn't been changed since it was signed by a trusted source.
- **Prove the Content:** Once the document is verified, we pinpoint specific information we want to prove. Using our custom PDF parsing crate, we extract just that piece of data and prove facts about it using a ZK circuit. This lets you confirm things like "Alice is on this document" or "the grade is A+" without revealing anything else from the PDF.

Checkout the [Setup instructions](https://github.com/privacy-scaling-explorations/zkpdf?tab=readme-ov-file#setup)

![demo](/articles/zkpdf-unlocking-verifiable-data/zkpdf_demo.webp)

---

### Benchmarks

| Metric                   | [PDF #1](https://github.com/privacy-scaling-explorations/zkpdf/blob/main/pdf-utils/sample-pdfs/digitally_signed.pdf)   | PDF #2 _(PAN Card Pdf from DigiLocker)_                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **PDF Size**             | 268.0 KiB                                                                                                              | 104.0 KiB                                                                                                             |
| **SP1 Network Link**     | [View Proof](https://explorer.succinct.xyz/request/0xf45625c4c789c0d146e2e2382ca141391c0813c9e7d1c42e96572a04dd3b2fff) | [View Proof](https://network.succinct.xyz/request/0x8c9842665d22504078d674259603786327fe9b834bd04f149dd4f92e94654f2c) |
| **Document Type**        | Signed PDF                                                                                                             | PAN Card from DigiLocker                                                                                              |
| **Signature Algorithm**  | RSA with SHA1                                                                                                          | RSA with SHA256                                                                                                       |
| **SP1 Version**          | sp1-v5.0.0                                                                                                             | sp1-v5.0.0                                                                                                            |
| **Proof Time (Groth16)** | 52 seconds                                                                                                             | 31 seconds                                                                                                            |
| **Cycle Count**          | 44,052,327 cycles                                                                                                      | 29,940,291 cycles                                                                                                     |
| **Gas Used**             | 50,575,525                                                                                                             | 35,255,053                                                                                                            |

---

## Real-World Use Cases for zkPDF

zkPDF supports over 90% of real-world signed PDFs containing text content, powered by our minimal-dependency, Rust-based PDF parser. This makes it immediately useful for real applications across multiple domains.

#### 1. DigiLocker Ecosystem

DigiLocker is India's central hub for digital documents covering identity, education, healthcare, insurance, and finance. With zkPDF, we can parse and verify virtually every signed PDF issued via DigiLocker—including Aadhaar, PAN, driver’s licenses, income certificates, degree certificates, and more.

- All documents are signed by the same centralized certificate authority, making signature verification consistent and efficient.
- Since the structure and keys are standardized, zkPDF can generate proofs without managing multiple formats or public key registries.

This is one of the most immediate and impactful use cases of zkPDF: enabling verifiable claims from India’s official documents without revealing the full content.

#### 2. Contract & Legal Workflows – DocuSign and Similar Platforms

Globally, platforms like DocuSign and Adobe Acrobat Sign issue cryptographically signed PDFs for contracts, agreements, and legal disclosures. zkPDF allows users to prove the presence of a clause or term—such as "Notice period is 30 days"—without exposing the entire contract.

#### 3. Banking Sector – Signed Invoices, Statements & Certificates

Most modern banking documents—such as invoices, account statements, and loan sanction letters—are generated as digitally signed PDFs. zkPDF enables users to prove facts like:

- “This salary certificate mentions ₹1,25,000.”
- “The bank balance exceeds ₹5,00,000.”
- “This account is active as of April 2025.”

All without revealing the rest of the financial document. Perfect for visa applications, credit scoring, and trustless onboarding.

---

### Future Potential Avenues of Research

- **Client-side Proof Generation** – Investigate running lightweight PDF proofs directly in the browser or mobile apps so users can generate ZK proofs without a remote prover.
- **TEE-assisted or Delegated Proofs** – Explore a trust-minimized delegation layer that offloads heavy proving tasks while still allowing end-to-end ZK verification.
- **Regex-Driven Selective Disclosure** – Extend the circuit to support regular-expression matching and pattern extraction.
- **Universal PDF & Multilingual Support** – Expand the parser to handle a wide range of PDF types and multilingual text extraction.

### Footnotes

- [zkPDF GitHub Repo](https://github.com/privacy-scaling-explorations/zkpdf)
- [PDF Text Extractor](https://github.com/privacy-scaling-explorations/zkpdf/tree/main/pdf-utils/extractor)
- [PDF Signature Verifier](https://github.com/privacy-scaling-explorations/zkpdf/tree/main/pdf-utils/signature-validator)
- [Demo Frontend](https://github.com/privacy-scaling-explorations/zkpdf/tree/main/app)

For collaboration, reach out at [vikas@pse.dev](mailto:vikas@pse.dev) or join the [PSE Discord](https://discord.com/invite/sF5CT5rzrR).
