---
id: "tor-js"
name: "tor-js"
image: "tor-js.avif"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "Tor protocol embedded in JS powered by Arti (Offical Tor in Rust) for anonymous networking in web environments."
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
  builtWith: ["Rust", "WebAssembly", "TypeScript"]
links:
  github: "https://github.com/voltrevo/arti/tree/wasm-arti-client/crates/tor-js"
extraLinks:
  play:
    - label: "tor-js Live Demo"
      url: "https://voltrevo.github.io/tor-js/"
  buildWith:
    - label: "tor-js NPM Package"
      url: "https://www.npmjs.com/package/tor-js"
    - label: "tor-js CLI (curlTor)"
      url: "https://www.npmjs.com/package/tor-js"
---

## Overview

tor-js is an npm module providing fetch (http requests) over Tor. This enables developers to build privacy-preserving applications without requiring users to install external software or plugins.

**Note**: The currently published npm module and demo is based on another implementation (see [npm](https://www.npmjs.com/package/tor-js) for details). You can find the latest work-in-progress [on GitHub](https://github.com/voltrevo/arti/tree/wasm-arti-client/crates/tor-js).

## Key Features

- **Snowflake Bridge Support**: Connect through volunteer-operated Snowflake bridges for censorship resistance
- **Multiple Distribution Options**: Full version with static certificates, lightweight no-static-certs variant, and singleton pattern
- **Fetch API Compatible**: Drop-in replacement for standard fetch with Tor routing
- **CLI Tool**: `curlTor` command-line tool for making Tor-routed HTTP requests
- **Cross-Platform**: Works in browsers and Node.js environments

## Technical Highlights

- Built with Arti - Tor Project's official rewrite in Rust
- Storage interface abstraction (temp dir, IndexedDB, or in-memory)
- Includes demo application with interactive UI

## Use Cases

- **Censorship Circumvention**: Access blocked websites through Tor bridges in restrictive networks
- **Anonymous Browsing**: Make HTTP/HTTPS requests without revealing IP address or location
- **Privacy-Preserving Applications**: Build web apps that protect user anonymity by default
- **Educational Tools**: Demonstrate Tor protocol and cryptography in browser environments
- **API Access**: Route JSON-RPC and REST API calls through Tor for privacy

## Getting Started

```bash
npm install tor-js
npx curlTor https://check.torproject.org/api/ip
```

## Status and Limitations

tor-js is under active development and should be considered experimental until it receives more security validation.

## Contributing

Contributions are most welcome.

- Report issues and suggest features [on GitHub](https://github.com/voltrevo/arti/tree/wasm-arti-client/crates/tor-js)
- Submit pull requests for bug fixes and improvements
- Test in your applications and provide feedback
