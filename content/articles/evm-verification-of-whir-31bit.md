---
authors: ["Alex Kuzmin"]
title: "EVM Verification of WHIR over a 31-bit Field"
image: "/articles/evm-verification-of-whir-31bit/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "A standalone WHIR verifier over the 31-bit KoalaBear field can verify a 2^22 polynomial opening on EVM with 100-bit Johnson-bound soundness for 5.65 MGas in software, or 4.33 MGas with experimental extension-field precompiles. The small field mainly saves calldata; execution remains dominated by extension-field row evaluation." #Short summary
date: "2026-05-28" # Publication date in ISO format
tags: [
    "client-side proving",
    "zkp",
    "zero-knowledge proofs",
    "post-quantum",
    "benchmarks",
    "onchain verification",
  ] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["client-side-proving"]
---

## Abstract

_We implemented a Solidity verifier for standalone WHIR as a PCS over the 31-bit KoalaBear field.[^sol-spartan-whir-repo] WHIR[^whir-paper] is a hash-based, transparent IOPP for constrained Reed--Solomon codes that is plausibly post-quantum sound._

_Opening a committed polynomial of size 2<sup>22</sup> at 100 bits of provable soundness under the Johnson bound costs 5,646,080 gas as an EVM transaction. A separate precompile experiment shows that `EXTFIELD_MAC`, an extension-field inner-product primitive computing_

$$
c + \sum_i a_i b_i \in \mathbb{F}_{p^k},
$$

_together with scalar and batch extension-field precompiles brings the verification cost down to 4,328,805 gas._

_A 31-bit field reduces gas (by ≈14% in our experiment). It shrinks calldata dramatically, but extension-field arithmetic consumes much of that saving._

## 1. The small-field bet

The SNARKs currently verifiable on-chain at reasonable gas cost (almost exclusively Groth16) rely on elliptic-curve pairings and are vulnerable to quantum attacks. Within a SNARK, the post-quantum soundness comes from the polynomial commitment scheme. WHIR is a hash-based IOPP that can be instantiated as a transparent PCS with the smallest proof sizes known to us in this setting, and its verifier is fast. This project is based on _whir&#8209;p3_[^whir-p3], the Rust implementation of WHIR using Plonky3.

_sol&#8209;whir_[^sol-whir-writeup], the earlier Solidity WHIR verifier, used a 254-bit field and relied on the capacity-bound proximity-gap conjecture, which has since been disproven[^rs-random-words][^rs-proximity-gaps][^rs-near-capacity]. Once that conjecture fails, the verifier needs more queries -- and therefore more gas -- to retain the same soundness. Our working assumption was that a small field would buy back enough gas to afford the safer Johnson-bound parameters.

Before building a production-ready verifier, we ran a small lower-security comparison[^lir6_ff5_rsv1] against _sol&#8209;whir_. It answers one narrow question: at comparable parameters, does the 31-bit field (KoalaBear + ext4) reduce EVM gas?

Both verifiers used 80 bits of target security for this comparison only (same as the latest committed version[^sol-whir-repo] of _sol&#8209;whir_).

| Metric                    | KoalaBear + ext4 |  sol-whir |
| ------------------------- | ---------------: | --------: |
| Total verification tx gas |          975,202 | 1,135,052 |
| Intrinsic gas             |           21,000 |    21,000 |
| Calldata gas              |          159,640 |   414,876 |
| Execution remainder       |          794,562 |   699,176 |
| Calldata bytes            |           10,276 |    28,740 |

The KoalaBear verifier is about 14.1% cheaper in total transaction gas. Calldata gas is 61.5% lower, but execution gas is 13.6% higher. The 31-bit field shrinks the proof, but extension field arithmetic eats back part of the advantage.

## 2. Why small fields mostly save calldata

A 31-bit field helps on EVM, but narrowly. It cuts calldata substantially while execution stays expensive, because the verifier must operate over an extension field for soundness and extension arithmetic in Solidity is two orders of magnitude more expensive than `MULMOD`.

KoalaBear is a 31-bit field, $p = 2^{31} - 2^{24} + 1$. That is too small for the verifier challenges: in public-coin arguments the challenge space must be large enough that the prover cannot search through accepting transcripts. The verifier therefore works over an extension $\mathbb{F}_{p^k}$. For the 100-bit Johnson-bound verifier this is the quintic extension $\mathbb{F}_{p^5} = \mathbb{F}_p[X] / (X^5 + X^2 - 1)$.

The calldata benefit comes from representation size. A KoalaBear base-field element needs 31 bits; a quintic extension element is five such limbs packed into 20 bytes; a BN254 element occupies a full 32-byte EVM word. Queried evaluations, challenges, and polynomial values therefore take fewer calldata bytes in the small-field verifier.

| Value type                          | Mathematical size | Encoded size in this comparison |
| ----------------------------------- | ----------------: | ------------------------------: |
| KoalaBear base-field element        |           31 bits |                         4 bytes |
| KoalaBear quintic extension element |          155 bits |                        20 bytes |
| BN254 base-field element            |          254 bits |                        32 bytes |

The smaller representation does not make extension-field arithmetic cheap. A BN254 verifier gets native `ADDMOD` and `MULMOD` at 8 gas each. For KoalaBear extension fields there is no dedicated opcode, so the verifier implements multiplication as polynomial multiplication followed by reduction modulo the irreducible, entirely in Solidity. We implemented three extension degrees because different soundness targets need different sizes:

- **quartic** ($\mathbb{F}_{p^4}$, irreducible $X^4 - 3$) for the lower-security 80-bit comparison against BN254;
- **quintic** ($\mathbb{F}_{p^5}$, irreducible $X^5 + X^2 - 1$) for the 100-bit Johnson-bound verifier;
- **octic** ($\mathbb{F}_{p^8}$, irreducible $X^8 - 3$) as a higher-algebraic-security comparison at the same soundness level.

The unamortized per-call cost of the quintic kernels, compiled with `solc 0.8.28` and `via_ir = true` (Yul optimizer pipeline enabled), against the EVM's native scalar-field arithmetic:

| Work item             | BN254 / EVM cost | KoalaBear extension-field cost in this verifier |
| --------------------- | ---------------: | ----------------------------------------------: |
| Scalar field add      |  `ADDMOD`: 8 gas |            ext5 add: 394 gas; ext5 sub: 409 gas |
| Scalar field multiply |  `MULMOD`: 8 gas |    ext5 multiply: 979 gas; ext5 square: 642 gas |

Per-element multiplication gas grows roughly with the convolution work. The verifier spends most of its execution on row evaluations, equality products, constraint weights, and final checks, all over the extension field, and runs many thousands of these multiplications -- which is what drives execution gas.

Small fields reduce calldata; the resulting verifier is dominated by extension arithmetic and has to amortize it rather than naively perform the individual operations. The next section explains how we did that.

## 3. What we optimized in Solidity

The verifier is hard-wired for one WHIR parameter set. Folding schedule, round count, query counts, row widths, and extension degree are all baked into schedule-specific Solidity constants and specialized verifier code. A runtime-configurable verifier would be worse at both gas and bytecode size. The latter matters because EIP&#8209;170 limits deployed runtime code to 24,576 bytes per contract; the actual bytecode measurements are in Section 6.

We tracked bytecode size throughout optimization, but gas was the priority. The high-security quintic and octic verifiers still exceed EIP&#8209;170 as single contracts (see Section 6), so deployability requires splitting the verifier across helper contracts or libraries.

The first priority was extension-field arithmetic. The largest wins came from constant-factor engineering: packing extension elements into one EVM word, delaying modular reduction until the end of a bounded limb computation, specializing squaring, and fusing verifier kernels so intermediate extension values are not repeatedly unpacked and repacked.

From _sol&#8209;whir_ we took the EVM patterns that had already proven themselves: reading the proof directly from calldata as a custom byte string, batched Merkle openings (aka "multiproof"), and Foundry tests around every measurable phase. The WHIR state machine and the field arithmetic were rewritten from scratch against _whir&#8209;p3_.

Other large wins came from specialized Merkle and Keccak handling for 20-byte digests, transcript-native observation, STIR row evaluators specialized for known row widths, and scratch-memory reuse.

Every change went through the same loop:

1. Pick a candidate from the profile -- Foundry flamegraph, phase-by-phase gas, or microbenchmark. Inspect compiled assembly when a hand-written rewrite of a hot kernel looked plausible.
2. Implement it.
3. Re-measure the real verifier path on the same fixture.
4. Check `forge build --sizes` against the EIP&#8209;170 budget.
5. Keep the change only if it saves gas, preserves transcript and proof compatibility, and fits the contract-size budget. Otherwise revert.

Many candidates were reverted. `via_ir` often already generated better code than a hand-written rewrite, and several rewrites that did save gas significantly grew the contract size. Other attempted changes were rejected because they tied on gas with no bytecode benefit. This profiling loop is how we decided to stop the software pass and move to the precompile experiment (Section 5). Single-digit-percent improvements may still exist, but the remaining visible opportunities were too small to change the main conclusion.

## 4. What exactly was measured

For Reed--Solomon proximity testing, verifier cost depends heavily on the assumed relation between code rate, query count, and soundness. Until 2025 it was common to choose FRI-style and WHIR-style verifier parameters from capacity-bound estimates, which give the smallest verifier for a claimed security level. Recent Reed–Solomon proximity-gap results rule out the up-to-capacity forms of the conjectures used for aggressive parameter selection, including the WHIR mutual-correlated-agreement up-to-capacity conjecture.[^rs-random-words][^rs-proximity-gaps][^rs-near-capacity] We therefore use Johnson-bound parameters for the main verifier measurement, so the reported security claim rests on a proven bound.

We chose the target soundness of 100 bits. 96 bits, the level common in modern proof-system configurations and benchmarks,[^ethproofs-security] is uncomfortably close to attacker capability: Bitcoin's annual hashrate is approaching 2^96^ operations,[^bitcoin-hashrate] leaving about a year of margin. 128-bit Johnson-bound security would need a larger extension degree and more queries, and would be substantially more expensive.

The committed polynomial size is 2^22^, the upper bound treated as relevant in _sol&#8209;whir_.[^sol-whir-writeup] It is large enough for many modern circuits.

The verifier uses 80-bit effective Merkle digests, following both _sol&#8209;whir_ and deployed STARK verifiers such as StarkNet's, where this digest-masking convention is the practical default for hash-based proof systems.[^sol-whir-writeup] A no-truncation measurement remains future work.

WHIR schedule selection was a separate search. The candidate had to be chosen as a trade-off between prover time and verifier gas cost. The sweep covered a wide range on most parameters (folding factor, first-round folding behavior, starting inverse rate, initial Reed--Solomon domain reduction), bounded by two protocol- and use-case-driven cutoffs. The first is on proof-of-work grinding: _whir&#8209;p3_ carries the grinding witness as a single base-field element, so the bit capacity usable for grinding without modifying the protocol was capped at `pow_bits = 30`. The second is on prover time. The verifier is meant for practical (ideally client-side) proving, so we treated 600 seconds on an M4 Pro as the cutoff for real measurements.

The Pareto front[^pareto-front] plot below shows the measured schedules and nearby interpolated schedules used for the quintic selection (quartic extension was insufficient to reach 100 bits of security). Horizontal axis: synthetic verifier score, in gas-equivalent units, derived from the WHIR schedule and Solidity microbenchmarks.[^verifier-score-formula] Vertical axis: prover time in seconds, measured where available and interpolated elsewhere. Points on the frontier are schedules where improving one objective costs the other.

![WHIR verifier Pareto front: prover time vs verifier score|690x475](/articles/evm-verification-of-whir-31bit/pareto.svg)

The implemented point on this frontier is `constant_pow28_ff4_lir4_rsv3`; the label format is decoded in the score footnote.[^verifier-score-formula] We chose it for the lowest verifier score among all the frontier points. The choice deliberately sacrifices prover time to minimize EVM verification gas.

The selected verifier parameters are:

| Quantity                  |                    Value |
| ------------------------- | -----------------------: |
| Base field                |        KoalaBear, 31-bit |
| Extension field           | quintic, $X^5 + X^2 - 1$ |
| Target soundness estimate |                 100 bits |
| Bound used                |            Johnson bound |
| Committed polynomial size |                 $2^{22}$ |
| Folding factor            |                        4 |
| Starting log inverse rate |                        4 |
| RS initial reduction      |                        3 |
| Proof-of-work bits        |                       28 |
| Proof calldata size       |             54,436 bytes |

Prover time for this point was about 274 seconds on an M4 Pro laptop.

For this configuration the transaction total decomposes as:

| Component                  |           Gas |
| -------------------------- | ------------: |
| Execution remainder        |     4,768,744 |
| Calldata                   |       856,336 |
| Intrinsic transaction cost |        21,000 |
| **Total transaction gas**  | **5,646,080** |

Below is the phase breakdown. The phase sum is 447 gas lower than the execution remainder above; the mismatch is due to gas spent by the profiling harness around the labeled verifier phases.

| Phase                 |           Gas |
| --------------------- | ------------: |
| Setup                 |        20,864 |
| Initial sumcheck      |        27,353 |
| Round0 parse          |         2,799 |
| Round0 STIR           |       703,346 |
| Round0 sumcheck       |        27,243 |
| Round1 parse          |         2,784 |
| Round1 STIR           |       925,758 |
| Round1 sumcheck       |        27,301 |
| Round2 parse          |         2,793 |
| Round2 STIR           |       582,564 |
| Round2 sumcheck       |        27,209 |
| Observe final poly    |        63,759 |
| Final STIR            |       669,008 |
| Final sumcheck        |        37,047 |
| Constraint evaluation |     1,512,664 |
| Final value check     |       135,805 |
| **Phase sum**         | **4,768,297** |

Constraint evaluation (1,512,664 gas) and STIR (2,880,676 gas total) dominate. Sumcheck phases sum to 146,153 gas, about 3% of the phase sum. This is one reason we chose Spartan&#8209;WHIR for the future work on the full SNARK: Spartan's IOP is mostly sumcheck, so the verifier should remain dominated by WHIR rather than by the IOP layer.

Explicit ext5 mul/square/sub functions account for only about 5.8% of gas. Most extension arithmetic is inside fused row-evaluation and constraint-evaluation kernels.

The same shape (STIR and constraint evaluation dominate, sumcheck small) holds for the quartic and octic verifiers. Section 6 gives total transaction gas for those two variants. We omit a second per-phase table because the qualitative breakdown is the same and the absolute numbers scale roughly with the per-element extension cost discussed in Section 2.

## 5. Precompile experiment

The precompile experiment asks whether a small set of new EVM primitives could materially reduce the cost of transparent, hash-based verification. The verifier gas cost gap between pairing-based SNARKs and post-quantum systems will matter more as pressure toward PQ verification grows.

Two questions: which primitive would materially reduce this verifier's gas, and is it general enough to be a credible EIP rather than an accelerator for a particular implementation of WHIR?

We ran the experiment on an Anvil node patched with precompile implementations. The starting set was the obvious general targets:

| Primitive       | Operation                                          |
| --------------- | -------------------------------------------------- |
| `EXT5_MUL(a,b)` | $a \cdot b$ in $\mathbb{F}_p[X] / (X^5 + X^2 - 1)$ |
| `EXT8_MUL(a,b)` | $a \cdot b$ in $\mathbb{F}_p[X] / (X^8 - 3)$       |
| Batch variants  | Apply `EXTk_MUL` elementwise                       |

These are easy to specify: fixed field id, fixed extension layout, two inputs, one output. They turned out to have limited effect on their own. A standalone extension-field multiplication is often too small to pay for `STATICCALL` transport, memory packing, and returndata handling. Batch multiplication is valuable when the verifier already has many independent products in the right shape, but several hot loops have serial dependencies or incompatible data layouts.

The productive primitive came from profiling. The STIR row-evaluation hot path is an extension-field inner product:

$$
c + \sum_i a_i b_i.
$$

That led to the `EXTFIELD_MAC` precompile. `EXTFIELD_MAC` computes exactly this operation over a selected extension field. Its interface is deliberately simple:

- field id;
- vector length;
- optional accumulator flag;
- pairs of packed extension-field elements;
- one packed extension-field output.

The same inner-product shape appears in FRI, STIR, WHIR, and sumcheck-style verifier kernels over small-prime extension fields. The evidence here is still limited to this verifier; claims about other systems require measurements in those systems.

The measured precompile-related reductions are:

| Precompile-related change                                             | Approx. saving |
| --------------------------------------------------------------------- | -------------: |
| Scalar/batch extension-field precompiles plus `EXTFIELD_MAC` row dots |        910,600 |
| MAC input templating                                                  |         57,741 |
| **Precompile-related reduction**                                      |    **968,341** |

The fully integrated experimental branch measures 4,328,805 transaction gas.

We inspected the remaining profile for another operation that was both general enough for an EIP and large enough to save gas and we did not find any besides `EXTFIELD_MAC`. The remaining hot code was either too specific to this verifier, too serial to amortize a precompile call, or better handled as ordinary Solidity optimization.

## 6. Results across the measured variants and deployability

The software measurements are:

| Verifier                   | Security model        | Total tx gas | Calldata gas | Execution remainder |
| -------------------------- | --------------------- | -----------: | -----------: | ------------------: |
| Quintic KoalaBear verifier | 100-bit Johnson bound |    5,646,080 |      856,336 |           4,768,744 |
| Octic KoalaBear verifier   | 100-bit Johnson bound |    6,367,262 |      753,800 |           5,592,462 |

The experimental precompile-backed measurements are:

| Verifier                                       | Total tx gas | Notes                                            |
| ---------------------------------------------- | -----------: | ------------------------------------------------ |
| Quintic verifier with experimental precompiles |    4,328,805 | ext5 scalar/batch arithmetic plus `EXTFIELD_MAC` |
| Octic verifier with experimental precompiles   |    4,345,429 | ext8 scalar/batch arithmetic plus `EXTFIELD_MAC` |

The octic result shows how much the VM primitive matters. In software, the octic verifier is more expensive than the quintic verifier. With the experimental extension-field precompiles, the octic and quintic transaction gas are almost the same.

Deployability requires splitting the implementation into helper contracts or libraries, followed by a new measurement of the resulting call overhead. The split is still future work.

| Packed-proof quintic verifier variant     | Runtime bytecode | EIP&#8209;170 status |
| ----------------------------------------- | ---------------: | -------------------- |
| `rsv3_pow28` software                     |         33,119 B | 8,543 B over         |
| `rsv4` software                           |         32,870 B | 8,294 B over         |
| `rsv3_pow28` experimental precompile path |         29,551 B | 4,975 B over         |

## 7. What remains to be done

The open items, all flagged above:

| Item                                    | Why it remains                                                                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No-truncation Merkle digest measurement | The reported verifier keeps the 80-bit digest masking convention fixed. A measurement with full digests remains to be done.                                                            |
| Deployable bytecode split               | The high-security packed-proof verifier exceeds the EIP&#8209;170 contract-size limit as a single contract. The helper-contract or library split has to be implemented and remeasured. |
| Full Spartan-WHIR verifier              | This report measures standalone WHIR. The full SNARK composition remains future work.                                                                                                  |

## 8. Conclusion

WHIR verification on EVM is feasible under a provable proximity bound at nontrivial parameters: 100-bit Johnson-bound soundness, $|f| = 2^{22}$, 5.65&nbsp;MGas in software and 4.33&nbsp;MGas with the experimental precompile path.

The small-field choice gives a real but limited gas improvement. It reduces calldata substantially, after which execution is dominated by extension-field row evaluation. The precompile that helps most in the custom-node experiment is `EXTFIELD_MAC`, an accumulated inner product over extension-field elements.

At today's prices of 0.554 gwei and \$2,359 per ETH, the 5.65&nbsp;MGas software path costs about \$3.98, and the 4.33&nbsp;MGas precompile path costs about \$3.05. That is much more than Groth16 verification, but it is in the same gas range as deployed STARK settlement: StarkNet's 2021 checkpoint post cited roughly 5&nbsp;MGas for on-chain STARK verification,[^starknet-checkpoints] and a 2024 StarkNet cost note reports roughly 6&nbsp;MGas per SHARP train for proof verification.[^starknet-2024]

The comparison to those earlier STARK verifiers needs care, because the systems and security assumptions differ. "On the Concrete Security of Non-interactive FRI"[^concrete-fri-security] reports that some of those deployments only carried 59 bits of provable FRI security once the conjectured assumptions are removed, and the 2021 checkpoint post does not specify a circuit size in a directly comparable way.[^starknet-estimated-params] The cost picture has also changed. On the date of the 2021 post, Ethereum's average gas price was about 50.1 gwei and ETH was about \$2,889, so a 5&nbsp;MGas verification cost roughly 0.25 ETH, or about \$724 (before EIP-1559). Today, at sub-gwei or low-single-digit-gwei L1 gas prices, and certainly on L2s, a 5--6&nbsp;MGas verification is a tractable settlement cost. What is new here is that a WHIR verifier stays under 6&nbsp;MGas with provable Johnson-bound 100-bit soundness rather than under capacity-bound assumptions that have since been disproven.

WHIR is also well-suited to recursive verification. This EVM verifier instantiates WHIR with Keccak because Ethereum has the `KECCAK256` opcode, but a Poseidon-based WHIR instance is much faster to prove and much easier to verify recursively, since Poseidon is designed for arithmetic circuits. One plausible architecture is to recursively aggregate many application proofs over Poseidon, then verify one final WHIR proof on EVM with the Keccak-based verifier measured here.

## Acknowledgements

Thanks to Miha Stopar for helpful reviews and suggestions on the implementation plan and PRs.

[^sol-spartan-whir-repo]: `sol-spartan-whir` repository: https://github.com/privacy-ethereum/sol-spartan-whir.

[^sol-whir-writeup]: _sol&#8209;whir_ writeup, "On the Gas Efficiency of the WHIR Polynomial Commitment Scheme," Ethereum Research: https://ethresear.ch/t/on-the-gas-efficiency-of-the-whir-polynomial-commitment-scheme/21301.

[^sol-whir-repo]: _sol&#8209;whir_ repository: https://github.com/privacy-ethereum/sol-whir.

[^whir-p3]: _whir&#8209;p3_ repository: https://github.com/tcoratger/whir-p3/. At the time of writing, the WHIR codebase is integrated natively into Plonky3: https://github.com/Plonky3/Plonky3.

[^whir-paper]: Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, and Eylon Yogev, "WHIR: Reed-Solomon Proximity Testing with Super-Fast Verification," IACR ePrint 2024/1586: https://eprint.iacr.org/2024/1586.

[^verifier-score-formula]: For a schedule $s$, the scorer computes $\operatorname{score}(s)=\alpha\cdot(M(s)+F(s)+T(s)+S(s)+C(s))$. Here $M$ is the Merkle/STIR-row term from query counts, compression counts, row-fold costs, OOD leaves, and PoW verification; $F$ is folding work from equality-product steps, inversions, and packed-element validation; $T$ is transcript observation work; $S$ is sumcheck observation plus round-polynomial extrapolation; $C=16\cdot\text{nonzero calldata bytes}+4\cdot\text{zero calldata bytes}$. The scale $\alpha$ calibrates the raw microbenchmark score to measured quintic native verifier transaction gas. The raw sweep covered `pow_bits = 27..30`, first-round folding factor `ff = 1..22`, starting log inverse rate `lir = 1..6`, initial Reed--Solomon reduction `rsv = 1..ff`, and both constant folding and `ConstantFromSecondRound(first, rest)` schedules with `rest < first`. Labels use that convention: `constant_pow28_ff4_lir4_rsv3` means constant folding, 28 proof-of-work bits, folding factor 4, starting log inverse rate 4, and initial Reed--Solomon reduction 3; `cfsr_pow28_ff5_rest3_lir4_rsv4` means `ConstantFromSecondRound(5, 3)` with the same remaining fields.

[^rs-random-words]: Benjamin E. Diamond and Angus Gruen, "On the Distribution of the Distances of Random Words," IACR ePrint 2025/2010: https://eprint.iacr.org/2025/2010.

[^rs-proximity-gaps]: Elizabeth C. Crites and Alistair Stewart, "On Reed-Solomon Proximity Gaps Conjectures," IACR ePrint 2025/2046: https://eprint.iacr.org/2025/2046.

[^rs-near-capacity]: Antonio Kambiré, "Proximity Gaps Conjecture Fails Near Capacity over Prime Fields," arXiv:2604.09724: https://arxiv.org/abs/2604.09724.

[^concrete-fri-security]: Alexander R. Block and Pratyush Ranjan Tiwari, "On the Concrete Security of Non-interactive FRI," IACR ePrint 2024/1161: https://eprint.iacr.org/2024/1161.

[^starknet-checkpoints]: "Checkpoints for Faster Finality in StarkNet," Ethereum Research: https://ethresear.ch/t/checkpoints-for-faster-finality-in-starknet/9633.

[^starknet-2024]: "Starknet Costs and Fees," https://community.starknet.io/t/starknet-costs-and-fees/113853

[^EIP&#8209;170]: EIP&#8209;170, "Contract code size limit": https://eips.ethereum.org/EIPS/EIP&#8209;170.

[^ethproofs-security]: Ethproofs benchmark table, configured-security column: https://ethproofs.org/csp-benchmarks.

[^bitcoin-hashrate]: Vitalik Buterin, Bitcoin hashrate and 96-bit security margin: https://x.com/VitalikButerin/status/1996954146604204363.

[^starknet-estimated-params]: For the SHARP parameters extracted by Block–Tiwari, the relevant FRI parameter is k=26, i.e. FRI input degree bound 2^26, at rate 1/32, hence evaluation domain size 2^31. In StarkEx terminology this corresponds to logNSteps = 22 through the relation log trace length = logNSteps + 4; so logNSteps = 22 corresponds to FRI input degree 2^26.

[^lir6_ff5_rsv1]: Quaritc verifier source code, https://github.com/privacy-ethereum/sol-spartan-whir/tree/main/src/whir/lir6

[^pareto-front]: https://en.wikipedia.org/wiki/Pareto_front
