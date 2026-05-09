---
id: "tor-js"
name: "tor-js"
image: "tor-js.avif"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "Tor protocol embedded in JS powered by Arti (Offical Tor in Rust) for anonymous networking in web environments."
license: "MIT OR Apache-2.0"
tags:
  keywords:
    [
      "Tor",
      "Privacy",
      "Anonymity",
      "Networking",
      "WebAssembly",
      "Censorship Circumvention",
      "Cryptography",
    ]
  themes: ["privacy", "build"]
  types: ["Library", "Toolkit", "Protocol"]
  builtWith: ["Rust", "WebAssembly", "TypeScript"]
links:
  github: "https://github.com/voltrevo/arti/tree/main/crates/tor-js/ts-wrapper"
extraLinks:
  play:
    - label: "tor-js Live Demo"
      url: "https://voltrevo.github.io/arti/"
  buildWith:
    - label: "tor-js NPM Package"
      url: "https://www.npmjs.com/package/tor-js"
---

## Overview

tor-js is an npm module that lets JavaScript applications make HTTP requests through the Tor network. It works in both browsers and Node.js, exposing a standard `fetch`-style API backed by [Arti](https://gitlab.torproject.org/tpo/core/arti) — the Tor Project's official Rust implementation — compiled to WebAssembly.

This enables developers to build privacy-preserving applications without requiring users to install external software or browser plugins.

## Key Features

- **Fetch API Compatible**: `client.fetch(url, init)` returns a standard `Response` object, including support for `AbortSignal`, custom headers, and request bodies.
- **Cross-Platform**: Works in browsers (via a WebRTC/WebSocket gateway) and in Node.js / Deno (via direct TCP).
- **Multiple Entry Points**: Choose between a CDN-fetched WASM binary, a base64-embedded build for single-file deploys, or a self-hosted `.wasm` file.
- **Singleton Wrapper**: Optional `tor-js/singleton` import for simple use cases that auto-opens on first request.
- **Persistent Caching**: Consensus and microdescriptor data are cached (IndexedDB in browsers, filesystem in Node.js) so subsequent connections bootstrap faster. In-memory and custom storage backends are also supported.
- **Configurable Logging**: Built-in `Log` class with adjustable log levels and pluggable sinks.

## Technical Highlights

- Built on Arti, the Tor Project's official Rust rewrite of Tor.
- Compiled to WebAssembly with three loading strategies tuned for different deployment targets.
- Browser support is enabled by [tor-js-gateway](https://github.com/privacy-ethereum/tor-js-gateway), which proxies relay connections over WebRTC or WebSocket since browsers cannot open raw TCP sockets.
- Released under a dual MIT OR Apache-2.0 license.

## Use Cases

- **Censorship Circumvention**: Reach blocked services from restrictive networks.
- **Anonymous HTTP Requests**: Make HTTP/HTTPS requests from a web app or Node service without revealing the originating IP address.
- **Privacy-Preserving Applications**: Build web apps that protect user anonymity by default
- **API Access**: Route JSON-RPC and REST API calls through Tor for privacy.

## Getting Started

```bash
npm install tor-js
```

```javascript
import { TorClient } from 'tor-js';

const client = new TorClient({
  // gateway: 'https://tor-js-gateway.HOSTME.com',
  // (Required in browsers; optional in Node.js / Deno.)
});

const response = await client.fetch('https://check.torproject.org/api/ip');
console.log(await response.json()); // { IsTor: true, IP: "..." }

client.close();
```

## Status

[Experimental](https://github.com/voltrevo/arti/issues/2).

It is your responsibilty to decide whether tor-js meets your security requirements. This software is provided for free and without warranty, per the MIT license.

Please reach out ([on github](https://github.com/voltrevo/arti/issues/2) or otherwise) if you'd like to see more security validation for tor-js.

## Contributing

Contributions are most welcome.

- Report issues and suggest features [on GitHub](https://github.com/voltrevo/arti/tree/main/crates/tor-js/ts-wrapper)
- Submit pull requests for bug fixes and improvements
- Test in your applications and provide feedback
