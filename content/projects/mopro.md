---
id: "mopro"
name: "Mopro"
image: "mopro.webp"
section: "pse"
projectStatus: "active"
category: "devtools"
tldr: "The easiest way to ship ZK proofs to mobile and web."
license: "MIT"
tags:
  keywords:
    [
      "Mobile",
      "Client",
      "iOS",
      "Android",
      "SDK",
      "Swift",
      "Kotlin",
      "React Native",
      "Flutter",
      "GPU",
    ]
  themes: ["build", "play"]
  types:
    [
      "Legos/dev tools",
      "Lego sets/toolkits",
      "Infrastructure/protocol",
      "Plugin",
    ]
  builtWith: ["halo2", "circom", "noir"]
links:
  github: "https://github.com/zkmopro"
  website: "https://zkmopro.org/"
  telegram: "https://t.me/zkmopro"
  twitter: "https://x.com/zkmopro"
extraLinks:
  buildWith:
    - label: "Getting Started with mopro"
      url: "https://zkmopro.org/docs/getting-started"
  play:
    - label: "Try it out: Solid(ar)ity - P2P Connection"
      url: "https://apps.apple.com/us/app/solid-ar-ity-p2p-connection/id6752410250"
---

### Overview

mopro makes it easy for ZK developers to ship **cross-platform SDKs** and apps to **real-world users**. It abstracts away FFI complexity and platform-specific configuration, so you can focus on your ZK protocol — not the mobile build toolchain.

Mobile-native execution outperforms browser-based ZK proving, and **client-side GPU acceleration** stands to improve performance even more — making mopro a foundation for high-performance, real-world ZK deployment.

### Features

- **Multi-prover support** — Rust wrappers for Circom, Halo2, Noir, and more, compiled cross-platform across iOS, Android, and web
- **Zero boilerplate** — CLI commands abstract away FFI setup, prover integration, mobile SDK, and app configuration
- **Composable** — drop mopro into any existing Rust project to build cross-platform SDKs
- **Production-ready** — ship ZK protocols directly to end users on native mobile and web apps
- **Performance-first** — optimized for iOS and Android, with ongoing exploration of client-side GPU acceleration

### Applications

- **Zuma** - [TestFlight](https://testflight.apple.com/join/ZmHHSrmP) | [GitHub](https://github.com/chengggkk/zuma)
- **Stealthnote Mobile** - [TestFlight](https://testflight.apple.com/join/8hqYwe8C) | [Android APK](https://drive.google.com/file/d/1IMsH0fBpaLGkFgFX0oqnlS6LQk3WCr3t/view?usp=sharing) | [GitHub](https://github.com/vivianjeng/stealthnote-mobile)
- **Solid(ar)ity** - [App Store](https://apps.apple.com/us/app/solid-ar-ity/id6752410250) | [GitHub](https://github.com/kidneyweakx/solidarity)
- [**OpenAC**](https://github.com/privacy-ethereum/zkID) × [**Taiwan Citizen Digital Certificate**](https://fido.moi.gov.tw/) - [TestFlight](https://testflight.apple.com/join/UuVzqwHk) | [Android APK](https://drive.google.com/file/d/15ukmBzA5Ih1SFu0uuf1LursOIYai7ooU/view?usp=sharing) | [Web App](https://proof-of-personhood-openac-web.vercel.app/) | [GitHub](https://github.com/privacy-ethereum/ZK-based-Proof-of-Personhood)
