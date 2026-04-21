---
authors: ["Nico"]
title: "Learnings from the KZG Ceremony"
image: "/articles/learnings-from-the-kzg-ceremony/learnings-from-the-kzg-ceremony-cover.webp"
tldr: "This post was authored by [Nico](https://github.com/NicoSerranoP/), a frontend developer working in the [Privacy Stewards of Ethereum Team (PSE)](https://appliedzkp.org/). Nico summarizes the learnings and challenges he faced during the development and deployment of the [KZG Ceremony](https://ceremony.ethereum.org/)."
date: "2023-07-11"
canonical: "https://mirror.xyz/privacy-scaling-explorations.eth/naTdx-u7kyirczTLSAnWwH6ZdedfTQu1yCWQj1m_n-E"
tags:
  [
    "kzg",
    "ceremony",
    "trusted setups",
    "ethereum",
    "cryptography",
    "scaling",
    "web development",
    "security",
    "infrastructure/protocol",
    "wasm",
  ]
projects: ["trusted-setups"]
---

## What is the KZG Ceremony?

Rollups and L2s are a way to scale Ethereum without sacrificing security and decentralization. They abstract execution to layer 2 and post resulting data to layer 1. By reducing L1 data storage costs, rollups can reduce their transaction fees considerably.

Most blockchains (Ethereum included) use hashes to link transactions, blocks, and subsequent transactions. For example, to get a block hash you need to hash all its transaction information plus the previous block hash. This means that the nodes need to store the whole blockchain history in order to synchronize a valid state. If we use polynomial commitments (a nice explanation can be found [here](https://arxiv.org/abs/1906.07221)) instead of hash commitments, we could reduce the need to store data on L1. Only specific information would be stored by specific network L2 nodes.

Polynomial commitments need an encrypted secret to work. If one person generates a secret and encrypts it, then that person could form invalid proofs that would satisfy the polynomial commitment (aka: create fraudulent proofs of the data posted in L1). To prevent this, we could make N participants generate their own secret and add it to the main one in a sequential order. If only one participant forgets his secret then the main secret would be secure. This process is called a ceremony and because we are going to use the KZG scheme we call it the "KZG Ceremony".

## Architecture overview

We need each participant to generate a secret on their side (client side). The contribution computation has to be sequential so we need a central sequencer that would control the participants’ queue (who has the current turn, who is next, check the contribution was performed correctly, etc). Even though the sequencer is a centralized web server, the only malicious attack it could perform would be to censor you from participating. All the secret generation and the contribution computation is done on the client side. To summarize:

1.  Multiple client-side programs would generate a secret and add it to the main secret on their turn.
2.  A centralized sequencer that would coordinate the participants’ queue and check each contribution’s validity.
3.  Client and server communication would be done through an API. The main secret file (called Structured Reference String: SRS) is a JSON with very large number values.

## Crypto-library implementation

The core part of this process lays on the cryptographic functions to compute contributions and verify their validity. These functions were written in Rust by the Ethereum core devs team because of Rust’s default security properties and its portability to web browsers using WASM. This code is used in the sequencer and in some of the client implementations.

We needed 3 functions:

1.  `contribute(previous_SRS, secret)` returns `new_SRS`: add a randomly generated secret into the SRS (a bunch of [group multiplications](https://arxiv.org/abs/1906.07221)).
2.  `contribute(previous_SRS, secret, identity)` returns `new_SRS`: performs the previous function and also signs your input identity using the secret as the secret key. This way you have linked your identity to your contribution for future recognition of your participation in this ceremony. It also helps the sequencer know who has already contributed and who hasn't. The SRS contributions have an attribute dedicated to this signature.
3.  `check(previous_SRS, post_SRS)` returns `true/false`: checks that the contribution operation was performed correctly. It does not reveal the secret, but it can tell that the participant used the previous SRS as a base and did not send some random value.

To improve portability, we created a wrapper repository written in Rust that uses the crypto library as a package. That way the crypto code is abstracted from the wrapper/API code being used on the client-side. It also helped us to configure the required tools to run WASM efficiently in a browser (e.g. wasm-pack, rayon, etc).

- Crypto-library repository: [https://github.com/ethereum/kzg-ceremony-sequencer/tree/master/crypto](https://github.com/ethereum/kzg-ceremony-sequencer/tree/master/crypto)
- Wrapper repository: [https://github.com/zkparty/wrapper-small-pot](https://github.com/zkparty/wrapper-small-pot)

## Sequencer implementation

The sequencer is a web server application that uses the crypto library as a package to check participants' contributions. To prevent a spam/bot attack, a sign-in feature was implemented. It allowed participants to [sign in with their Ethereum wallet](https://github.com/spruceid/siwe/tree/main) (SIWE modal that allowed multiple wallet-connect compatible wallets) or with their GitHub account. At the development phase we thought that a requirement of 3 or more transactions before a specific snapshot would be enough but we were wrong. In production, a lot of spam bots tried to contribute and therefore the waiting time increased exponentially. We believe these bots were trying to farm tokens or airdrops (which we didn't have and we will not have in the future).

In terms of the participants' coordination process, we decided to use a lobby strategy rather than a queue strategy. A lobby means that participants have to sign-in and keep pinging the sequencer in a specific time frame until they get randomly selected to participate in the next slot. This way we ensure that participants (clients programs) are active. The ceremony had over 110,000 contributions so if a couple of thousand participants took more time than the expected (around 90 seconds), the waiting time could have increased exponentially. At the same time, a lobby gives everyone the same chances of being selected for the next slot. So if a participant client had suddenly stopped pinging the sequencer, they could rejoin the lobby and still have the same chances as before (contrary to a first-in-first-out queue mechanism that would have sent the unlucky participant to the end of the line). We expected most participants would be using the browsers on their everyday computers and most would not have had a good internet connection.

We defined "malicious" users as client programs who would send a corrupt SRS (or not send a SRS at all) after being given a slot to participate. This wastes time and delays other participants from contributing. The sequencer would be able to detect corrupt SRS, blacklist them and would not let them participate afterwards unless they explicitly asked through an official channel (Telegram, Discord, Twitter and even GitHub issues).

The sequencer implemented different API routes to accomplish its tasks:

1.  `/info/current_state`: Serve the initial and the subsequent SRS to the participants and anybody who wanted to check the ceremony state at a specific time.
2.  `/lobby/try_contribute`: participants would regularly ping into this route to report liveness and if selected, the sequencer would send the participant the current SRS for them to compute their contribution.
3.  `/contribute`: it would receive the SRS before a specific time frame (to avoid participants taking too much time and making others wait) and check its validity. If true, it would save it and pass it to the next participant. If false, it would just ignore that new SRS, blacklist the participant, and send the previous SRS to the next participant to compute
4.  `/info/status`: it would serve information about the ceremony such as the number of contributions, lobby size and the sequencer public address used to sign the receipts sent after each participant contribution.

The sequencer was deployed in a beefy machine that could handle the amount of requests and the bandwidth to send the SRS over and over. A caching of 5 seconds was added for the /current_state route so browsers showcasing the ceremony status and its record wouldn't collapse the bandwidth. There were some changes done to the proxy to avoid a huge spam/bots attack.

- Sequencer repository: [https://github.com/ethereum/kzg-ceremony-sequencer](https://github.com/ethereum/kzg-ceremony-sequencer)

## Client implementation

Ethereum is built by and for its community and it was extremely important for us to create mechanisms so non-experts could participate in the ceremony. That is why the official client implementation is browser-based.

We used React as our frontend framework and wasm-pack to port the crypto library Rust code as WASM to be run on the browser. The first thing the web application would ask participants is to generate entropy by moving their mouses around the screen and writing some "secret" into an input element. Behind the scenes, we would take the mouse x,y position and the instance timestamp plus the text secret and input it as the seed generation for the random secret that would go into the contribute function in WASM.

After that, the website would ask the participants to sign-in and depending on the method, an extra BLS signature step would be added (only for SIWE). This method would sign the participant's secret with his wallet to let them prove their participation authenticity later in the future.

Then the participant would enter into the lobby page which would show how many participants are in the lobby at that moment and the chances of being accepted (there was a time when these chances were less than 0.5%). The browser would keep pinging the sequencer every now and then. The participants could move to another tab to keep working and the pinging would continue but if they run out of battery, close their laptop, close the browser or log out from their session then the pinging would stop and they would need to re-do the process again (including a new entropy generation).

If a slot were assigned, the client would have around 90 seconds to download the file, perform the computation and upload the new file. The browser will load the generated entropy into the WASM code through the wrapper functions and get the new SRS ready to be sent to the sequencer. A verification check would be performed in the client just in case any function became corrupted. If a false value were returned, we would notify the participant to post a GitHub issue asap (this particular case never happened).

The biggest challenge we faced was on the deployment part. We didn't want anyone to trust us with the client implementation so we decided to build it and upload it to IPFS which returned a hash of the frontend content that can be used to access the web application itself (the frontend was also audited by an [external company](https://github.com/ethereum/kzg-ceremony#audits)).

Inside our code we had two opposite components: third party popups related to custom wallets in the SIWE modals and compiled WASM code. The browser would not let you run both at the same time because it presented a vulnerability risk: the third party code (that you don't control) could run compiled WASM (that you cannot read) and execute a malicious script. To solve it we needed to set up different HTTP headers in the sign-in page and in the contributing page.

The problem with this was that IPFS does not allow you to easily configure HTTP headers (you would need to configure them on the IPFS node settings and not in the application). [Geoff](https://github.com/glamperd) came up with this interesting trick involving service workers:

Service workers work as a middleware between the client and the server, they were specifically designed to run offline Progressive Web Applications and device-cache strategies. We would use them to set up different HTTP headers and then the browser would recognize them and proceed normally. But because we were using a Single Page Application, we would need to refresh the page every time the participant entered the sign-in or the contributing page. So putting together service workers and a refreshing function, we were able to upload the frontend to IPFS that would allow users to login using all SIWE modal wallets and would allow WASM code computation.

- Official client repository: [https://github.com/zkparty/trusted-setup-frontend](https://github.com/zkparty/trusted-setup-frontend)
- DogeKZG repository: [https://github.com/Savid/dogekzg](https://github.com/Savid/dogekzg)
- Other client CLI implementations: [https://github.com/ethereum/kzg-ceremony#client-implementations](https://github.com/ethereum/kzg-ceremony#client-implementations)

## Conclusion

We have a team dedicated to trusted setups in the [PSE discord](https://discord.com/invite/sF5CT5rzrR) that helps developers build and deploy their own ceremonies for zero-knowledge circuits. If you need help or want to contribute to our work, feel free to ping us about questions and issues.
