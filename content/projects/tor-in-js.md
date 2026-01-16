---
id: "tor-in-js"
name: "Tor in JS"
image: "tor-in-js.avif"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "Tor protocol implementations in TypeScript and Rust for anonymous networking in browsers and native environments."
license: "MIT"
tags:
  keywords:
    [
      "Tor",
      "Privacy",
      "Anonymity",
      "Networking",
      "WebAssembly",
      "Censorship Circumvention",
      "Bridges",
      "Cryptography",
    ]
  themes: ["privacy", "build"]
  types: ["Library", "Toolkit", "Protocol"]
  builtWith: ["TypeScript", "Rust", "WebAssembly", "WASM"]
links:
  github: "https://github.com/igor53627/webtor-rs"
  website: "https://igor53627.github.io/webtor-rs/"
extraLinks:
  play:
    - label: "tor-js Live Demo"
      url: "https://voltrevo.github.io/tor-js/"
    - label: "webtor-rs Live Demo"
      url: "https://igor53627.github.io/webtor-rs/"
  buildWith:
    - label: "tor-js NPM Package"
      url: "https://www.npmjs.com/package/tor-js"
    - label: "tor-js CLI (curlTor)"
      url: "https://www.npmjs.com/package/tor-js"
    - label: "webtor-rs WASM CDN"
      url: "https://webtor-wasm.53627.org/"
  learn:
    - label: "tor-js GitHub Repository"
      url: "https://github.com/voltrevo/tor-js"
    - label: "webtor-rs GitHub Repository"
      url: "https://github.com/igor53627/webtor-rs"
    - label: "webtor-rs Documentation"
      url: "https://deepwiki.com/igor53627/webtor-rs"
---

## Overview

Tor in JS comprises two complementary implementations of the Tor protocol for modern web environments:

- **webtor-rs**: A Rust-based Tor client compiled to WebAssembly, offering improved performance, memory safety, and support for multiple transport protocols (Snowflake and WebTunnel).
- **tor-js**: A TypeScript-based Tor client that enables anonymous HTTP requests through the Tor network directly from browsers and Node.js, utilizing Snowflake bridges for censorship circumvention.

Both projects enable developers to build privacy-preserving applications without requiring users to install external software or plugins.

## Key Features

### webtor-rs

- **Official Tor Protocol**: Uses the Arti crate from the Tor Project for protocol compliance
- **Dual Transport Support**: Snowflake (WebRTC) for circumvention and WebTunnel (HTTPS) for corporate proxy bypass
- **Modern Cryptography**: ntor-v3 handshakes with CREATE2 circuits and TLS 1.3 support
- **Stream Isolation**: Per-domain circuit isolation using Mozilla's Public Suffix List (Tor Browser-style)
- **Circuit Reuse**: Persistent circuits for improved performance
- **Full-Stack**: Available as pure Rust library and compiled WASM for browsers

### tor-js

- **Snowflake Bridge Support**: Connect through volunteer-operated Snowflake bridges for censorship resistance
- **Multiple Distribution Options**: Full version with static certificates, lightweight no-static-certs variant, and singleton pattern
- **Fetch API Compatible**: Drop-in replacement for standard fetch with Tor routing
- **CLI Tool**: `curlTor` command-line tool for making Tor-routed HTTP requests
- **Cross-Platform**: Works in browsers and Node.js environments

## Technical Highlights

### webtor-rs

- **TLS Validation**: Enforced TLS 1.3 (with TLS 1.2 fallback) via SubtleCrypto and rustls
- **Consensus Management**: Embedded snapshot with online fetching and 1-hour caching
- **Memory-Safe**: Written in Rust with comprehensive testing (unit, E2E, fuzz tests)
- **Architecture**: Modular design with separate crates for core (webtor), WASM bindings (webtor-wasm), TLS (subtle-tls), and demos
- **CDN Distribution**: Pre-built WASM bindings available via Cloudflare R2

### tor-js

- Forked from `@hazae41/echalote` with improvements and active maintenance
- Configurable circuit buffers and timeouts
- Hierarchical logging system
- Storage interface abstraction (temp dir, IndexedDB, or in-memory)
- Includes demo application with interactive UI

## Use Cases

- **Censorship Circumvention**: Access blocked websites through Tor bridges in restrictive networks
- **Anonymous Browsing**: Make HTTP/HTTPS requests without revealing IP address or location
- **Privacy-Preserving Applications**: Build web apps that protect user anonymity by default
- **Educational Tools**: Demonstrate Tor protocol and cryptography in browser environments
- **API Access**: Route JSON-RPC and REST API calls through Tor for privacy

## Getting Started

### webtor-rs

```bash
./build.sh
cd webtor-demo/static && python3 -m http.server 8000
# Open http://localhost:8000
```

### tor-js

```bash
npm install tor-js
npx curlTor https://check.torproject.org/api/ip
```

## Status and Limitations

Both implementations are actively maintained and experimental in nature:

- **webtor-rs** uses the official Tor Project's protocol implementation with comprehensive testing (unit, E2E, fuzz tests)
- **tor-js** focuses on JavaScript simplicity and accessibility

Neither has undergone formal third-party security audits. These tools do not protect against browser fingerprinting or application-layer leaks.

## Comparison

| Feature        | tor-js              | webtor-rs                                 |
| -------------- | ------------------- | ----------------------------------------- |
| Protocol       | Custom TypeScript   | Official `tor-proto` crate                |
| TLS Validation | Yes                 | Yes (SubtleCrypto)                        |
| Handshake      | ntor                | ntor-v3 (modern)                          |
| Language       | TypeScript          | Rust (memory-safe)                        |
| Transport      | Snowflake (WS only) | Snowflake (WS/WebRTC) + WebTunnel (HTTPS) |

## Contributing

Both projects welcome contributions:

- Report issues and suggest features on GitHub
- Submit pull requests for bug fixes and improvements
- Test in your applications and provide feedback
