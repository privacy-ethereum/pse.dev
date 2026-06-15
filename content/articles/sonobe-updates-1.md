---
authors: ["Winderica"]
title: "Sonobe Updates 2026 Part 1: Audit Report" # The title of your article
image: "/articles/articles-name-folder/cover.webp" # Image used as cover,  Keep in mind the image size, where possible use .webp format, possibly images less then 200/300kb
tldr: "Ahead of Sonobe's first release, we had our folding-schemes and IVC library audited by both a human auditor and an AI auditor. This article summarizes their findings." #Short summary
date: "2026-06-01" # Publication date in ISO format
canonical: "https://github.com/privacy-ethereum/sonobe/issues/262"
tags: ["Sonobe", "folding schemes"] # (Optional) Add relevant tags as an array of strings to categorize the article
projects: ["sonobe"]
---

## Overview

Sonobe is a cryptographic library for folding schemes and IVC, developed by 0xPARC and PSE. It is currently maintained by @winderica.

Over the past year, the library has been refactored for better modularization and user/developver experience, and now we plan to publish the first crates.io release. We believe folding schemes will be a future infrastructure of scalable and private blockchains and wish to make sure our library is secure enough to support various applications.

To this end, we have been working with a human auditor, Aleph_v (Twitter: https://twitter.com/alpeh_v), and an AI auditor, V12 (https://v12.sh/) to find potential vulnerabilities in Sonobe. We have a limited scope for our first audits, so we can focus on core schemes and features used by existing downstream projects. Specifically, the audits cover the following modules.

- Folding schemes
  - Nova
- Folding-to-IVC compilers
  - CycleFold
- Primitives
  - Gadgets for emulated field & group
  - Relations & constraint systems
  - Commitment schemes
  - Transcripts
  - Utilities

Additionally, the AI auditor also reported findings in additional out-of-scope schemes.

We are grateful to both auditors for their thorough reviews, which identified a number of vulnerabilities and areas for improvement across the codebase. This report consolidates the findings from the human and AI audits, summarizes their impact and remediation status, and provides a postmortem analysis of the underlying causes. We also compare the two audit approaches, highlighting where they overlapped and where their strengths diverged, with the aim of providing useful context for teams considering AI-assisted auditing tools.

## Summarization of Findings

The table below summarizes the in-scope findings. Each bug has been assigned a stable label of the form `<severity>-<index>`, using its final classification.

| Severity | Classified Bugs | Found by Human | Found by AI | Found by Both |
|----------|-----------------|----------------|-------------|---------------|
| Critical | 2               | —              | —           | [C-01](#C-01), [C-02](#C-02) |
| High     | 2               | —              | [H-02](#H-02) | [H-01](#H-01) |
| Medium   | 4               | [M-01](#M-01), [M-02](#M-02), [M-03](#M-03), [M-04](#M-04) | — | — |
| Low      | 4               | [L-01](#L-01), [L-04](#L-04) | [L-03](#L-03) | [L-02](#L-02) |
| Invalid  | 6               | [I-02](#I-02), [I-04](#I-04), [I-05](#I-05) | [I-01](#I-01), [I-03](#I-03), [I-06](#I-06) | — |

Below is a synthesis of what the data in the report says about the two auditors' performance, where they overlap, and where their failure modes diverge.

### Topline numbers

Counting only in-scope findings (out-of-scope AI submissions are noted separately at the end):

| Metric                                | Human         | AI           | Both         |
| ------------------------------------- | ------------- | ------------ | ------------ |
| Valid findings contributed to         | 10 / 12 (83%) | 6 / 12 (50%) | 4 / 12 (33%) |
| Invalid findings submitted            | 3             | 3            | 0            |
| Total submissions                     | 13            | 9            | 4            |
| **Precision (valid / total)**         | **77%**       | **67%**      | **100%**     |
| Unique valid findings (sole reporter) | 6             | 2            | —            |

Adding the 6 out-of-scope AI submissions (5 valid, 1 invalid per the report's own assessment) lifts AI's overall precision to ~73% (11/15). The shared findings are 100% valid by construction — every co-reported bug landed.

### Takeaways for audit methodology

1. **The two auditors are complementary.**

    Pairing the human auditor with the AI auditor paid off: eight valid findings came from only one side. That split matters. If we had used only one auditor:
    - **Human-only:** would have missed H-02, an R1CS panic / soundness leak at the API boundary, and L-03, a Poseidon DoS / panic issue. Both are downstream-facing and outside the IVC critical path.
    - **AI-only:** would have missed all four Medium findings and two of the four Low findings: the emulated-arithmetic and RLC cluster, plus the Fiat-Shamir domain separator.

    A single-auditor review would have left meaningful gaps. Outside the Critical bucket, the two auditors found largely different classes of bugs.

2. **Take co-reported bugs seriously.**

    The overlap landed exactly where redundancy matters most: the two Critical findings. These bugs break the protocol end-to-end, so independent confirmation is valuable.

    Every co-reported finding was valid. When both auditors independently flagged the same surface, it was genuinely broken. That is a good reason to run both pipelines in parallel on future reviews.

3. **Human review was stronger on math-heavy primitives and circuit bugs.**

    The Medium and Low tier is where subtle completeness and soundness bugs tend to live. In this snapshot, the AI missed many of them. The human auditor found issues that required deeper mathematical or cryptographic reasoning:

    - **M-02:** `gcd(α, p−1) ≠ 1` makes the S-box non-bijective. This requires understanding the Poseidon security argument.
    - **M-03:** `enforce_congruent` uses the wrong quotient bound: `x/m` instead of `(x−y)/m`. This requires tracing a signed-arithmetic invariant.
    - **M-04:** the field element zero has two representations under an inclusive upper bound, weakening Fiat-Shamir challenge sampling. This requires connecting an off-by-one error to soundness.
    - **L-04:** `enforce_not_equal` should require at least one limb to differ, not all limbs. This is a quantifier inversion that only shows up if you understand what the gadget is meant to prove.

4. **AI scanning was useful at the public API boundary.**

    H-02 and L-03 are real trust-boundary bugs that a math-focused review could easily under-prioritize. The AI caught interface-level issues that show up as panics or unchecked input handling:

    - **H-02:** `R1CS::new` accepts ill-formed matrices, so a column index outside the assignment vector can trigger a Rust panic via `z[*col]`.
    - **L-03:** `poseidon_custom_config` forwards unchecked `rate`, `capacity`, and `full_rounds` values to arkworks, leading either to an `assert_eq!` panic or an unbounded allocation.

5. **Human false positives can still be useful.**

    The human auditor’s invalid findings were reasonable concerns, not noise. Closing them required real cryptographic or protocol-level justification.

    - **I-02, curve cofactor:** the auditor reasonably flagged what looked like a missing subgroup check. Resolving it required a non-trivial Hasse-bound argument showing that the cofactor is forced to be 1 in this setting.
    - **I-04, trivial `<2,0>` instances:** the concern that trivial running instances could satisfy relaxed R1CS is reasonable. The protocol designer must rule this out; folding-based IVC does.
    - **I-05, 128-bit challenge:** the birthday-attack concern was plausible enough that it was closed only after discussion with the original author.

6. **AI false positives are more likely when protocol-wide context matters.**

    The AI was effective at spotting local bugs, but weaker at reasoning across multiple modules and protocol layers.

    This showed up in I-03. The AI reported that the running instance for the CycleFold circuit was treated as opaque. In fact, the soundness is guaranteed by the in-circuit constraints _together with_ the out of circuit logic: it is absorbed into the public input `x` by the augmented step circuit and checked later by the IVC verifier, but the AI missed this inter-module connection.

## In-Scope Bugs

### Sponges and Transcripts

In Sonobe, we are using our own implementation of sponges and Fiat-Shamir transcripts. It turns out that our implementation is not very robust and has some vulnerabilities if not carefully handled. While we have already patched these vulnerabilities, our long term plan is to migrate to the [`spongefish`](https://github.com/arkworks-rs/spongefish) transcript library for better security.

#### <a id="H-01"></a>[H-01] [High] (human, AI) Same digests for states with different shapes

Both the human auditor and the AI auditor (in F-48560) found that, since shape information of the preimage is not absorbed into the sponge/transcript, two pairs of initial and current states with different shapes may produce the same digest. This allows an attacker to take a proof for one accepted state transition and pass [IVC verification](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/ivc/src/compilers/cyclefold/mod.rs#L364-L370) for another semantically different transition that flattens to the same absorbed field sequence.

```rs
    fn verify<FC: FCircuit<Field = Self::Field>>(
        Key(dk1, dk2, (hash_config, pp_hash)): &Self::VerifierKey<FC>,
        i: usize,
        initial_state: &FC::State,
        current_state: &FC::State,
        Proof(W, U, w, u, cf_W, cf_U): &Self::Proof<FC>,
    ) -> Result<(), Error> {
        // ...

        let u_x = sponge
            .add(&i)
            .add(initial_state)
            .add(current_state)
            .add(U)
            .add(cf_U)
            .get_field_element();

        if u.public_inputs() != [u_x] {
            return Err(Error::IVCVerificationFail);
        }

        // ...
    }
```

This can be exploited when the user implements the step circuit trait [`FCircuit`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/circuits/mod.rs#L62-L111) in a naive way, such that the associated types `State` and `StateVar` are dynamic data structures (e.g., vectors) whose sizes are not guaranteed to be the same throughout multiple invocations of the step circuit.

```rs
pub trait FCircuit {
    // ...

    type State: Clone + PartialEq + Absorbable;
    type StateVar: GR1CSVar<Self::Field, Value = Self::State>
        + AllocVar<Self::State, Self::Field>
        + AbsorbableVar<Self::Field>;

    // ...
}
```

For instance, the following pairs of states have different shapes but produce the same digest:
- `initial_state = vec![1], current_state = vec![2, 3]`
- `initial_state = vec![1, 2], current_state = vec![3]`

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/257, which correctly absorbs and compares the sizes of initial and current states.

#### <a id="L-01"></a>[L-01] [Low] (human) Incorrect domain separator handling

The human auditor also spotted a bug in our transcript domain separation method [`Transcript::separate_domain`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/transcripts/mod.rs#L76-L90). We mistakenly used `F::MODULUS_BIT_SIZE.div_ceil(8)` as the chunk size of 8-bit values and derived a field element from each chunk. This implied that each chunk could contain more bits than the field capacity. For instance, given a 254-bit field order, each chunk has $\lceil 254 / 8 \rceil \times 8 = 256$ bits, which may cause overflows.

```rs
    fn separate_domain(&self, domain: &[u8]) -> Self {
        let mut new_sponge = self.clone();


        let mut input = domain.len().to_le_bytes().to_vec();
        input.extend_from_slice(domain);


        let limbs = input
            .chunks(F::MODULUS_BIT_SIZE.div_ceil(8) as usize)
            .map(|chunk| F::from_le_bytes_mod_order(chunk))
            .collect::<Vec<_>>();


        new_sponge.add_field_elements(&limbs);


        new_sponge
    }
```

Consequently, different domain separators may produce the same sponge/transcript, resulting in potential collisions. This does not affect the domain separators internally used by Sonobe's IVC implementation, but the method itself is public and may be called by downstream code. Although transcript collisions are not independently harmful if different elements are absorbed, but they do make other attacks easier.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/252, which replaces `div_ceil` with `div_floor` to compute the correct chunk size.

### `zip`s

There are multiple places in Sonobe where variable-length vectors are zipped without checking length consistency. This is highly dangerous because in Rust, `zip` returns an iterator whose length depends on the shortest inputs, and subsequent computations may not be executed as intended for the remaining items.

All `zip`-related bugs are fixed in https://github.com/privacy-ethereum/sonobe/pull/254, which adds explicit length checks and replaces `zip` with `zip_eq` provided by `itertools`.

#### <a id="C-01"></a>[C-01] [Critical] (human, AI) Relaxed R1CS verification bypass

Both the human auditor and the AI auditor (in F-48685) found that it's possible to _completely_ bypass the [satisfiability check](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/arithmetizations/r1cs/mod.rs#L257-L270) against relaxed R1CS.

```rs
    fn check_evaluation(
        w: &RelaxedWitness<&[F]>,
        _u: &RelaxedInstance<&[F]>,
        v: Self::Evaluation,
    ) -> Result<(), Error> {
        cfg_iter!(w.e)
            .zip(&v)
            .all(|(e, v)| e == v)
            .then_some(())
            .ok_or(Error::UnsatisfiedAssignments(
                "Evaluation does not match error term".into(),
            ))
    }
```

Here, we wish to compare the error term `e` in the adversarially controlled relaxed witness `w` with the evaluation vector `v`. However, by providing an empty error term `e`, the evaluation check line `.all(|(e, v)| e == v)` can be skipped, producing an `Ok(())` even if the witness itself is invalid.

`check_evaluation` is called by the folding scheme's decider algorithm, which is then called by the IVC's verifier. It is clear to see that this bug makes the entire IVC verification path insecure.

#### <a id="L-02"></a>[L-02] [Low] (human, AI) Silent truncation in slice equivalence gadgets

Both the human auditor and the AI auditor (in F-48590) found that the [slice equivalence gadget](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/algebra/ops/eq.rs#L26-L31) zips the two slices without first checking that they have the same length:

```rs
impl<T: EquivalenceGadget<T>> EquivalenceGadget<[T]> for [T] {
    fn enforce_equivalent(&self, other: &[T]) -> Result<(), SynthesisError> {
        self.iter()
            .zip(other)
            .try_for_each(|(a, b)| a.enforce_equivalent(b))
    }
}
```

When the inputs differ in length, `zip` silently truncates to the shorter side and equality is enforced only on the common prefix, while trailing elements on the longer slice go entirely unconstrained. The bug is not currently triggered inside Sonobe, because every internal caller passes slices whose lengths are determined at circuit synthesis time. However, the gadget is part of our public API and would behave incorrectly under dynamically sized inputs.

#### <a id="M-01"></a>[M-01] [Medium] (human) Silent truncation in random linear combinations

The human auditor found that the RLC helpers [`scalar_rlc`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/algebra/ops/rlc.rs#L31) and [`slice_rlc`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/algebra/ops/rlc.rs#L56) zip the input iterator against the coefficient slice without checking that the two have matching lengths:

```rs
fn scalar_rlc(self, coeffs: &[Coeff]) -> Self::Value {
    self.zip(coeffs).map(|(v, c)| v * c).sum::<I::Item>()
}

fn slice_rlc(self, coeffs: &[Coeff]) -> Vec<Self::Value> {
    let mut iter = self
        .zip(coeffs)
        .map(|(v, c)| v.iter().map(|x| x.clone() * c));
    let first = iter.next().unwrap();

    iter.fold(first.collect(), |acc, v| {
        acc.into_iter().zip(v).map(|(a, b)| a + b).collect()
    })
}
```

Both helpers silently truncate to the shorter of the two iterators. They are not currently invoked on any in-scope code path, but the auditor flagged them out of an abundance of caution: random linear combinations are routinely used to bind parallel actions together at the critical combination points of many folding schemes, so a silent length mismatch can erase part of the inputs and introduce a soundness gap. In an in-circuit context, the same mismatch synthesizes an underconstrained circuit.

### Hash functions

There are some concerns that the hash functions supported by Sonobe are insecure, either due to the attacks to the hash function itself, or caused by potential misconfigurations.

#### <a id="I-01"></a>[I-01] [Invalid] (AI) Griffin

The AI auditor (in F-48679) reported that [`GriffinSponge`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/transcripts/griffin/sponge.rs) is exposed as a first-class `Transcript` backend even though the Griffin permutation has been broken. The AI was concerned that downstream users could select Griffin and obtain Fiat-Shamir challenges from a primitive that no longer behaves like a random oracle.

We regard this as invalid because the [Griffin module documentation](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/transcripts/griffin/mod.rs) already warns explicitly that the underlying permutation is broken and must not be used in production:

```rs
//! Implementation of the Griffin circuit-friendly hash function and its
//! parameter generation, as well as out-of-circuit widgets and in-circuit
//! gadgets for permutation, hashing, sponges, and transcripts.
//!
//! According to the Griffin [paper], it is very efficient in terms of the
//! number of constraints, but later an [attack] on Griffin and similar hash
//! functions was discovered.
//! Therefore, it is recommended to avoid using Griffin in production.
```

The implementation is kept only for benchmarking and research purposes, and no in-tree code path uses it for proving or verification.

#### <a id="L-03"></a>[L-03] [Low] (AI) Unchecked inputs to Poseidon config generation function

The AI auditor (in F-48670) spotted that [`poseidon_custom_config`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/transcripts/poseidon/mod.rs#L10-L28) forwards `full_rounds`, `partial_rounds`, `rate`, and `capacity` straight to arkworks without any validation:

```rs
pub fn poseidon_custom_config<F: PrimeField>(
    full_rounds: usize,
    partial_rounds: usize,
    alpha: u64,
    rate: usize,
    capacity: usize,
) -> PoseidonConfig<F> {
    let (ark, mds) = find_poseidon_ark_and_mds::<F>(
        F::MODULUS_BIT_SIZE as u64,
        rate,
        full_rounds as u64,
        partial_rounds as u64,
        0,
    );

    PoseidonConfig::new(full_rounds, partial_rounds, alpha, mds, ark, rate, capacity)
}
```

Two concrete consequences follow:

- Any `capacity != 1` triggers an `assert_eq!` panic inside `PoseidonConfig::new`, because `find_poseidon_ark_and_mds` hardcodes a `rate + 1` state width while `PoseidonConfig::new` later asserts a `rate + capacity` width. The function therefore turns into a panic primitive whenever a caller passes any other capacity.
- Large `full_rounds`, `partial_rounds`, or `rate` values cause `find_poseidon_ark_and_mds` to eagerly allocate an `ark` table of `(full_rounds + partial_rounds) * (rate + 1)` field elements and a square `mds` matrix of `(rate + 1)^2` elements, providing an unbounded denial-of-service primitive.

This only matters when a downstream consumer routes attacker-controlled values into the config builder. Sonobe itself does not rely on any specific config and only uses the canonical parameters in `poseidon_canonical_config` for unit tests.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/256, which computes the parameters by following the paper's reference implementation.

#### <a id="M-02"></a>[M-02] [Medium] (human) Poseidon config generation can produce insecure instances

The human auditor pointed out that [`poseidon_custom_config`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/transcripts/poseidon/mod.rs#L10-L28) forwards `alpha` straight to `PoseidonConfig::new` without verifying that it is coprime with `F::MODULUS - 1`:

```rs
pub fn poseidon_custom_config<F: PrimeField>(
    full_rounds: usize,
    partial_rounds: usize,
    alpha: u64,
    rate: usize,
    capacity: usize,
) -> PoseidonConfig<F> {
    // ... no gcd(alpha, F::MODULUS - 1) check ...
    PoseidonConfig::new(full_rounds, partial_rounds, alpha, mds, ark, rate, capacity)
}
```

When `gcd(F::MODULUS - 1, alpha) ≠ 1`, the S-box $x \mapsto x^\alpha$ is not a permutation in `F` and the resulting Poseidon instance is no longer collision resistant. The default prime fields used by Sonobe (BN254 and Grumpkin scalars) satisfy the coprimality requirement, but the helper is generic over `F: PrimeField` and would silently produce an insecure configuration if instantiated with a different field.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/256, which enforces the coprimality of `alpha` and `F::MODULUS - 1` when constructing a Poseidon configuration.

### Emulated Field/Group Gadgets

Sonobe implements in-circuit gadgets for emulated field and group elements. The verification of CycleFold instances involves emulated field elements and their operations, and emulated group elements are also required to express primary instances in the augmented step circuit.

Hence, the security of our emulated gadgets directly impacts the security of our augmented step circuit. Most of the bugs reported by the auditors only affects completeness, i.e., preventing an honest prover from generating a valid proof for some correct witnesses. However, there is also one soundness bug, allowing a malicious prover to generate a valid proof for incorrect witnesses.

#### <a id="L-04"></a>[L-04] [Low] (human) Overconstrained `enforce_not_equal`

The human auditor flagged a completeness bug in our custom override of `enforce_not_equal` for `LimbedVar` at [`crates/primitives/src/algebra/field/emulated.rs#L803-L817`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/algebra/field/emulated.rs#L803-L817):

```rs
    fn enforce_not_equal(&self, other: &Self) -> Result<(), SynthesisError> {
        if self.limbs.len() != other.limbs.len() {
            return Err(SynthesisError::Unsatisfiable);
        }
        if self.bounds.len() != other.bounds.len() {
            return Err(SynthesisError::Unsatisfiable);
        }
        for i in 0..self.limbs.len() {
            if self.bounds[i] != other.bounds[i] {
                return Err(SynthesisError::Unsatisfiable);
            }
            self.limbs[i].enforce_not_equal(&other.limbs[i])?;
        }
        Ok(())
    }
```

The loop enforces inequality on every individual limb, while the correct relation is that *at least one* limb must differ. A pair of limbs like `[0, 1]` and `[0, 2]` therefore cannot be proven distinct under this gadget, even though they clearly are. The override is not called anywhere in the existing codebase, but is exposed to other consumers of the primitives crate.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/253, which drops the overconstrained override and falls back to the default `EqGadget::enforce_not_equal` implementation.

#### <a id="M-03"></a>[M-03] [Medium] (human) Incorrect quotient bounds in `enforce_congruent`

The human auditor identified another completeness bug in [`enforce_congruent`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/algebra/field/emulated.rs#L663-L684), the gadget that asserts two limbed numbers are congruent modulo a prime:

```rs
    pub fn enforce_congruent<const RHS_ALIGNED: bool>(
        &self,
        other: &LimbedVar<Base, Target, RHS_ALIGNED>,
    ) -> Result<(), SynthesisError> {
        let cs = self.cs();
        let m = BigInt::from_biguint(Sign::Plus, Target::MODULUS.into());
        // Provide the quotient as hint
        let q = LimbedVar::new_variable_with_inferred_mode(cs.clone(), || {
            let x = compose(self.limbs.value().unwrap_or_default());
            let y = compose(other.limbs.value().unwrap_or_default());
            Ok((
                (x - y).div_floor(&m),
                Bounds(self.lbound().div_floor(&m), self.ubound().div_floor(&m)),
            ))
        })?;

        // ...
    }
```

The honest quotient is `q = (x - y) / m`, but the hinted variable is bounded to `(self.lbound() / m, self.ubound() / m)`, i.e., the range of `x / m` alone, ignoring the subtraction of `y`. As a toy example, proving `9 ≡ 2 (mod 7)` would require the witness `q = (2 - 9) / 7 = -1`, while the bounds derived from `self = 2` collapse to `(0, 0)` and reject any negative value. The (true) statement is therefore unprovable. This gadget is used by the equality-check classes that participate in the decider proof, but does not appear on the core folding scheme/IVC path.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/253, which derives the quotient bounds from `(x - y) / m` rather than from `x / m` alone.

#### <a id="M-04"></a>[M-04] [Medium] (human) Incorrect upper bound for field elements

When [allocating an emulated field element](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/algebra/field/emulated.rs#L1118) in field `G` on a circuit defined over field `F` via `AllocVar` for `LimbedVar`, the upper bound on the limbed value is `G::MODULUS` inclusive:

```rs
impl<F: SonobeField, G: SonobeField, Cfg> AllocVar<G, F> for LimbedVar<F, Cfg, true> {
    fn new_variable<T: Borrow<G>>(
        cs: impl Into<Namespace<F>>,
        f: impl FnOnce() -> Result<T, SynthesisError>,
        mode: AllocationMode,
    ) -> Result<Self, SynthesisError> {
        Self::new_variable(
            cs,
            || {
                f().map(|v| {
                    (
                        BigInt::from_biguint(Sign::Plus, (*v.borrow()).into()),
                        Bounds(Zero::zero(), G::MODULUS.into().into()),
                    )
                })
            },
            mode,
        )
    }
}
```

The human auditor observed that this allows two distinct limb representations of the field element zero: the canonical `0` and `G::MODULUS ≡ 0 (mod G::MODULUS)`. When the limbed var is later absorbed into the transcript, the two representations serialize to different bit strings, so a malicious prover can choose between two distinct Fiat-Shamir challenges at every step that admits a zero. This breaks the single-challenge assumption of the Fiat-Shamir transform, lets the prover sample multiple polynomial opening points instead of one, and degrades the soundness bound proportionally to the number of zero-allowed positions in the transcript.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/253, which uses `G::MODULUS - 1` as the upper bound when allocating an emulated `G` element, so that the field element zero has a unique representation.

#### <a id="I-02"></a>[I-02] [Medium -> Invalid] (human) Missing prime order checks on curve points

The human auditor noted that Sonobe's circuits never assert that the curve points handed to commitment-related gadgets lie in the prime-order subgroup of the configured curve. With a curve that has a non-trivial cofactor, an attacker could supply commitments lying in a small-order subgroup; subsequent scalar multiplications would then return values in a tiny range, and the attacker could search for `rho` cancellations that compensate for prior invalid commitments using only the small-subgroup size rather than the full 128-bit cost of the prime-order operation.

We regard this as invalid for the in-scope configuration: we always require a curve cycle for CycleFold-based IVC, which is enforced by the Rust compiler. Cofactors of some curve _chains_ are indeed greater than 1, but it is mathematically impossible for curve _cycles_ to have non-trivial cofactors, which is a direct consequence of the Hasse bound.

> A 2-cycle consists of elliptic curves $E_1/\mathbb{F}_{p_1}$ and $E_2/\mathbb{F}_{p_2}$ where the prime-order subgroup of each curve has order equal to the base field of the other:
>
> $$r_1 = p_2, \quad r_2 = p_1$$
>
> with $\\#E_i = h_i \cdot r_i$ (cofactor $h_i$). By Hasse's theorem, $\\#E_i = p_i + 1 - t_i$ with $|t_i| \le 2\sqrt{p_i}$. Substituting:
>
> $$h_1 \cdot p_2 = p_1 + 1 - t_1$$
> $$h_2 \cdot p_1 = p_2 + 1 - t_2$$
>
> Eliminating $p_2$ from the first equation and substituting into the second gives:
>
> $$p_1(h_1 h_2 - 1) = 1 - t_1 + h_1(1 - t_2)$$
>
> Left side grows linearly in $p_1$ (when $h_1 h_2 \ge 2$).
>
> Right side is bounded by:
>
> $$|1 - t_1 + h_1(1 - t_2)| \;\le\; 1 + 2\sqrt{p_1} + h_1 + 2h_1\sqrt{p_2} \;\approx\; O(\sqrt{p_1})$$
>
> For large $p_1$, $p_1 \gg O(\sqrt{p_1})$, so the equation has no solution unless $h_1 h_2 = 1$, i.e., $h_1 = h_2 = 1$.
>
> Even for the smallest non-trivial case ($h_1 = 2, h_2 = 1$), we can work out that solutions only exist when $p_1 \lesssim 23$. For anything at cryptographic scale (128+ bit primes), non-unit cofactors are impossible.


### R1CS

As a popular constraint system, R1CS is supported by most of folding schemes. Normally the R1CS structures are honestly generated, e.g., by a trusted party or a verifier. However, we must examine R1CS matrices carefully in scenarios where they might be specified by a malicious prover.

#### <a id="H-02"></a>[H-02] [High] (AI) Unchecked R1CS structure

The AI auditor (in F-48681) found that [`R1CS::new`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/arithmetizations/r1cs/mod.rs) accepts an `R1CSConfig` plus sparse matrices without verifying that the stored row counts and column indices satisfy the advertised arithmetization dimensions:

```rs
    pub fn new(cfg: R1CSConfig, [A, B, C]: [Matrix<F>; 3]) -> Self {
        Self { cfg, A, B, C }
    }
```

Both [`AbstractNova::generate_keys`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/fs/src/nova/algorithms/prover.rs) variants then preserve the malformed `R1CS` inside the generated key material. Subsequent evaluation in [`R1CS::evaluate_at`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/arithmetizations/r1cs/mod.rs) trusts the column metadata and uses direct `z[*col]` indexing:

```rs
        self.evaluate_rows(|((a, b), c)| {
            let az = a.iter().map(|(val, col)| z[*col] * val).sum::<F>();
            let bz = b.iter().map(|(val, col)| z[*col] * val).sum::<F>();
            let cz = c.iter().map(|(val, col)| z[*col] * val).sum::<F>();
            // ...
            Ok(az * bz - z[0] * cz)
        })
```

Two distinct downstream symptoms follow:

- Native and in-circuit evaluation paths trust the rows physically present, so a shortened matrix is silently truncated and the relation enforced is weaker than the `R1CSConfig` claims. Combined with the `zip`-based [`check_evaluation`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/arithmetizations/r1cs/mod.rs#L257-L270), a malformed running instance can erase trailing error terms.
- A column index outside the assignment vector produces a panic via the indexing expression `z[*col]` instead of a typed error. The malformed `R1CS` survives key generation, and the panic surfaces in later `decide_*`, `sample`, or `prove` calls.

Sonobe's own preprocessing pipeline only constructs `R1CS` instances from synthesized arkworks circuits, which guarantee well-formed dimensions. The bug primarily matters at the public API boundary if a downstream consumer ever deserializes plugin-supplied or attacker-controlled circuits. The recommended remediation is to validate row counts and column indices in `R1CS::new` before storing the matrices.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/260, where we added validity check to the creation of R1CS structures by default.

### IVC

After the redesign, Sonobe now features a compiler based on CycleFold that automatically converts a supported folding scheme to an IVC, without manually implementing the logic.

Thus, a secure compiler is crucial to the security of all IVC schemes it produces.

#### <a id="C-02"></a>[C-02] [Critical] (human, AI) Base case fails to anchor the claimed initial state

Both the human auditor and the AI auditor (in F-48689) found that the augmented circuit does not bind the executed transition to the claimed starting state at step `i = 0`. In [`AugmentedCircuit::compute_next_state`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/ivc/src/compilers/cyclefold/circuits.rs#L89-L151), both `initial_state` and `current_state` are allocated as plain witnesses and the only base-case handling consists of swapping in dummy running instances:

```rs
        let initial_state = FC::StateVar::new_witness(cs.clone(), || Ok(initial_state))?;
        let current_state = FC::StateVar::new_witness(cs.clone(), || Ok(current_state))?;

        let U_dummy = AllocVar::new_constant(cs.clone(), FS1::RU::dummy(self.arith1_config))?;
        // ...

        // 1.d. If this is the base case (`i = 0`), then we should instead use
        //      the dummy running instance as the next running instance.
        let actual_UU = is_basecase.select(&U_dummy, &UU)?;

        // ...

        // 2.d. If this is the base case (`i = 0`), then we should instead use
        //      the dummy running instance as the next running instance.
        let actual_cf_UU = is_basecase.select(&cf_U_dummy, &cf_UU)?;

        // 3. Update state by invoking the step circuit.
        let (next_state, external_outputs) =
            self.step_circuit
                .generate_step_constraints(i, current_state, external_inputs)?;
```

The step circuit is always executed against the `current_state` witness, and the constraint system never asserts `current_state == initial_state` even when `is_basecase` is true. Since `initial_state` enters the public hash `u.x = H(i, initial_state, current_state, U, cf_U)` only as a free witness, a prover can supply any hidden `current_state` at `i = 0`, run one honest step from it, and still hash the resulting statement against an unrelated advertised `initial_state`. The first proof then attests only to `H(1, initial_state, next_state, dummy, dummy)` together with the folding relations, but not to the actual predecessor state that produced `next_state`. The verifier checks the same public hash and the recursive consistency conditions, so it accepts execution traces whose initial state was never bound.

The human auditor demonstrated this with a concrete test case that executes steps of $x_i^3 + x_i + 5 = x_{i+1}$, claims an initial state of `x = 0`, but in fact starts at `x = 2`. After two steps the system reaches `3395` instead of the correct `135`, and the verifier still accepts the proof.

This has been fixed in https://github.com/privacy-ethereum/sonobe/pull/255, which conditionally enforces equality between `initial_state` and `current_state` when `i = 0`.

#### <a id="I-03"></a>[I-03] [Invalid] (AI) Verifier accepts wrong secondary instances

The AI auditor (in F-48635) reported that [`CycleFoldBasedIVC::verify`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/ivc/src/compilers/cyclefold/mod.rs#L317-L346) does not re-derive `cf_U` from the primary proof. Instead, it only checks satisfiability via `FS2::decide_running`, so a malicious caller could substitute any valid secondary witness-instance pair while the verifier still accepts the proof.

We regard this as invalid because `cf_U` is in fact bound to the primary proof through the public hash chain. The [verifier sponge construction](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/ivc/src/compilers/cyclefold/mod.rs#L364-L370) absorbs `cf_U` together with the rest of the public state:

```rs
        let u_x = sponge
            .add(&i)
            .add(initial_state)
            .add(current_state)
            .add(U)
            .add(cf_U)
            .get_field_element();

        if u.public_inputs() != [u_x] {
            return Err(Error::IVCVerificationFail);
        }
```

Substituting an unrelated `cf_U` therefore changes `u_x` and the verifier rejects the proof at the `u.public_inputs() == [u_x]` check. The AI's claim that `cf_U` is "treated as opaque" by the verifier is incorrect.

#### <a id="I-04"></a>[I-04] [Medium -> Invalid] (human) Trivial instances in <2, 0> folding

The human auditor noted that Nova's [<2, 0> folding-mode verifier circuit](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/fs/src/nova/circuits/verifier.rs#L66), which folds two running instances instead of one running instance and one incoming instance, does not enforce that if `u = 0` for either input instance, then `cm_e = O` and `cm_w = O`:

```rs
    fn verify_hinted(
        _vk: &Self::VerifierKey,
        transcript: &mut impl TranscriptGadget<CM::ConstraintField>,
        [U1, U2]: [&Self::RU; 2],
        _: [&Self::IU; 0],
        proof: &Self::Proof<2, 0>,
    ) -> Result<(Self::RU, Self::Challenge), SynthesisError> {
        let rho_bits = transcript.add(&(U1, U2))?.add(proof)?.challenge_bits(B)?;
        let rho = CM::ScalarVar::from_bits_le(&rho_bits)?;

        Ok((
            Self::RU {
                u: (U2.u.clone() * &rho + &U1.u).try_into()
                    .map_err(|_| SynthesisError::Unsatisfiable)?,
                cm_e: /* ... folded with rho^2 ... */,
                cm_w: /* ... folded with rho ... */,
                x: /* ... folded with rho ... */,
            },
            rho_bits.try_into().unwrap(),
        ))
    }
```

In a relaxed R1CS the equation `Az ∘ Bz - u · Cz = e` is trivially satisfied by setting `u = 0` and `e = Az ∘ Bz` for any assignment, so allowing such trivial relaxed instances into the fold breaks the soundness of the accumulator. In the default <1, 1> folding mode this is prevented implicitly: a relaxed instance with `u = 0` would break the hash chain in the augmented circuit and could not be passed in as the running instance. The <2, 0> verifier circuit, which folds two relaxed instances together, has no equivalent guard.

However, we regard this as invalid for the following reasons.

- It is totally possible that a valid running instance has `u = 0` but `cm_e != O` and `cm_w != O`, since these components are simply computed via random linear combinations. `u = 0` indeed looks like a trivial case for the relaxed R1CS equation, but analogously, for encryption schemes, a ciphertext that happens to be the plaintext also looks like a trivial case. However, we should not reject such trivial cases, because it gives the adversary a hint that the plaintext must be different from the ciphertext, and this is also the case in our scenario.
- IVC always requires <1, 1> folding, where the running instance is updated by accumulating the incoming instances and is never directly supplied by the adversary. We expose the <2, 0> folding APIs because some advanced use cases may require folding-based PCD, just as what we are doing in [PlasmaBlind](https://github.com/winderica/plasma-blind). However, the running instances in PCD should eventually come from incoming instances as well, rather than from the adversary. We assume that the downstream integrator is experienced enough to ensure this in their protocol, which should be a fair assumption since such use cases already require deep understanding of the IVC and PCD protocols.
- Native support for folding-based PCD is planned but is currently out of scope. We will make sure <2, 0> folding is carefully handled when implementing this feature.

### Challenge size

There are concerns regarding the challenge size of Nova, configured by the constant generic `CHALLENGE_BITS` in [`AbstractNova`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/fs/src/nova/mod.rs#L38-L40).

```rs
pub struct AbstractNova<CM, TF, const CHALLENGE_BITS: usize = 128> {
    _t: PhantomData<(CM, TF)>,
}
```

#### <a id="I-05"></a>[I-05] [Invalid] (Human) Default challenge size is too small

The human auditor raised a concern that the default challenge size `CHALLENGE_BITS = 128` might be too small, resulting in only 64 bits of security due to birthday attack.

We regard this as invalid after discussion with Srinath Setty, one of Nova's authors. He mentioned that the security level should still be 128 bits if the challenge bits are obtained by sampling a Fiat-Shamir challenge in a 256-bit field and truncating its bit-decomposition into 128 bits, which is exactly what we are doing.

#### <a id="I-06"></a>[I-06] [Invalid] (AI) User controllable challenge size

The AI auditor found two potential issues with user controllable challenge size. Specifically, `CHALLENGE_BITS` can be controlled by users but the code does not check any misconfiguration, which may lead to the following attacks:

- (F-48613) With `CHALLENGE_BITS = 0`, an attacker can forge accepted recursive proofs for histories that never happened.
- (F-48510) With `CHALLENGE_BITS` greater than or equal to the base field size of the primary curve, the same challenge can admit multiple bit strings that differ by whole field moduli.

We regard both attacks as invalid, as we provide a safe default value and assume that it is the user's responsibility if they change the default value. Nevertheless, we will improve the documentation and explicitly inform the user that they should prefer the default configuration unless they know what they are doing.

## Out-of-scope Bugs

### Unbounded verifier allocations

The AI auditor (in F-48642) found that vectors in Mova and HyperNova proofs and instances have unbounded sizes controllable by attackers, requiring excessive allocations in subsequent transcript operations. For example, `Mova::verify` consumes the attacker-controlled `proof.h1_coeffs` and `U.r_e.len()` before any size invariant from the arithmetic configuration is enforced:

```rs
let h1 = DensePolynomial::from_coefficients_vec([&U.v[..], &proof.h1_coeffs].concat());

transcript.add(U);
transcript.add(u);
transcript.add(&proof.cm_w);

let r_e = transcript.challenge_field_elements(U.r_e.len());

transcript.add(&proof.h1_coeffs);
```

Both `r_e` and the densified polynomial `h1` are sized directly from the deserialized proof, so a single oversized request drives the verifier into excessive challenge squeezes and polynomial allocations. The same pattern affects `MovaProof.h1_coeffs`, `NIMFSProof.sc_proof` / `sigmas` / `thetas`, and `mova::RunningInstance.r_e` across `Mova::verify` and `HyperNova::verify`. A service that deserializes untrusted proofs into these public structs can therefore be forced into unbounded memory and CPU work. Mova and HyperNova are out of scope for this audit.

### Sum-to-zero check unsound under signed remaining-limb bounds

The AI auditor (in F-48657) found that the `enforce_equal_unaligned` method in `crates/primitives/src/algebra/field/emulated.rs` handles mismatched limb lengths by summing the trailing limbs and forcing the sum to zero:

```rs
        // Enforce the remaining limbs to be zero.
        // Instead of doing that one by one, we check if their sum is
        // zero using a single constraint.
        // This is sound, as the upper bounds of the limbs and their sum
        // are guaranteed to be less than `F::MODULUS_MINUS_ONE_DIV_TWO`
        // (i.e., all of them are "non-negative"), implying that all
        // limbs should be zero to make the sum zero.
        remaining_limbs[1..]
            .iter()
            .sum::<FpVar<F>>()
            .enforce_equal(&FpVar::zero())?;
        Bounds::add_many(remaining_bounds)
            .filter_safe::<F>()
            .ok_or(SynthesisError::Unsatisfiable)?;
```

The inline comment claims this is sound because the tail limbs are non-negative, but the only check performed is `Bounds::add_many(remaining_bounds).filter_safe::<F>()`, which merely ensures that the sum fits inside the signed field range and accepts negative lower bounds (`lb >= -MODULUS_MINUS_ONE_DIV_TWO`). After `sub_unaligned` or `mul_unaligned` against a signed quotient, a malicious prover can therefore produce canceling positive/negative limbs (e.g. `(+X, -X, 0, …)`) whose field-sum is zero even though the integer represented is non-zero. This bypasses both `LimbedVar::modulo` and `LimbedVar::enforce_congruent`, which are the reduction and equality primitives behind `EmulatedFieldVar`.

This bug is only present in [`5ffe1fa`](https://github.com/privacy-ethereum/sonobe/commit/5ffe1fa91fbbb7ecf68cf226416ce82e4ea0155e) but not in [`842b45a`](https://github.com/privacy-ethereum/sonobe/commit/842b45a8630668afc49054071a4cf3e42fb75f5d), since it was already fixed by https://github.com/privacy-ethereum/sonobe/commit/7af1d5b2809ae7b2ea473195983c3eeb25529073.

### Public parameters are not bound into the transcript

The AI auditor (in F-48688) found that `CycleFoldBasedIVC::generate_keys` hardcoded `pp_hash` to `Zero::zero()`:

```rs
let pp_hash = Zero::zero(); // TODO
```

That constant was threaded through both prover and verifier keys, the `T::new_with_pp_hash` transcript construction, and the in-circuit sponge in `AugmentedCircuit::compute_next_state`. As a result, proofs and accumulator states were not domain-separated by the actual public parameters even though the API implied they were. Callers could therefore replay or substitute proofs across different parameter generations whenever the underlying relation still happened to verify.

This bug is only present in [`5ffe1fa`](https://github.com/privacy-ethereum/sonobe/commit/5ffe1fa91fbbb7ecf68cf226416ce82e4ea0155e) but not in [`842b45a`](https://github.com/privacy-ethereum/sonobe/commit/842b45a8630668afc49054071a4cf3e42fb75f5d), since it was already fixed by https://github.com/privacy-ethereum/sonobe/commit/19c220fea449e361173c67e24f8b694a314ac170.

### Panic in Pedersen Gadget With Empty Inputs

The AI auditor (in F-48672) found that `PedersenGadget::msm` in [`crates/primitives/src/commitments/pedersen.rs`](https://github.com/privacy-ethereum/sonobe/blob/842b45a8630668afc49054071a4cf3e42fb75f5d/crates/primitives/src/commitments/pedersen.rs) immediately indexes `g[n - 1]` (and on the even branch also `g[n - 2]`) without checking whether `n == 0`:

```rs
fn msm(g: &[C::Var], v: &[Vec<Boolean<CF2<C>>>]) -> Result<C::Var, SynthesisError> {
    let mut res = C::Var::zero();
    let n = v.len();
    if n % 2 == 1 {
        res += g[n - 1].scalar_mul_le(v[n - 1].to_bits_le()?.iter())?;
    } else {
        res += g[n - 1].joint_scalar_mul_be(
            &g[n - 2],
            v[n - 1].to_bits_le()?.iter(),
            v[n - 2].to_bits_le()?.iter(),
        )?;
    }
    // ...
}
```

When `v` is empty, `n - 1` underflows the `usize` and the slice access immediately panics. Both `CommitmentOpsGadget` implementations call into `msm`, so the in-circuit `open` paths panic during synthesis when given an empty committed vector. The out-of-circuit `PedersenKey::commit` quietly accepts the same empty vector, as `ark_ec::VariableBaseMSM::msm_unchecked` truncates to the shorter slice. Thus, an in-circuit/off-circuit trust boundary mismatch lets a downstream service that synthesizes attacker-controlled openings be reliably crashed. The Pedersen gadget is currently not reached on Sonobe's critical path, but the public API surface remains exposed to downstream consumers. The Pedersen commitment scheme is in scope for this audit, but the in-circuit gadget specifically is out of scope as it is not used on the IVC path.

### Missing dimension checks in HyperNova

The AI auditor (in F-48687) found that several HyperNova verification paths trust attacker-controlled vector lengths instead of enforcing the CCS shape. For example, `HyperNova::verify` derives the sumcheck dimension directly from `proof.sc_proof.len()`:

```rs
    let d = V::degree();
    let s = proof.sc_proof.len();
    let t = V::n_matrices();
    // ...

    let beta = transcript.challenge_field_elements(s);
    // ...
    let vp_aux_info = VPAuxInfo {
        max_degree: d + 1,
        num_variables: s,
    };
    // ...
    let (claimed_eval, r_x_prime) =
        SumCheck::verify(sum_v_j_gamma, &proof.sc_proof, &vp_aux_info, transcript)?;
```

`HyperNova2::verify` and `HyperNovaGadget::verify_hinted` mirror the same pattern, and in the running-instance path `HyperNovaKey::check_relation` reaches `eval_relation`, which reads `mle.fix_variables(&u.r_x)[0]` without checking that `u.r_x.len()` matches `log_constraints()`, while `check_evaluation` compares expected values against `u.v` with `zip` so trailing coordinates are silently dropped. An `s = 0` proof can therefore bypass meaningful sumcheck validation. HyperNova is out of scope for this audit.

### Empty evaluations panic in MLE

The AI auditor (in F-48598) reported that `MLEHelper::from_evaluations` computes `log2(l)` directly from `evaluations.len()` and panics on an empty input vector, providing a denial-of-service primitive against any caller that forwards attacker-controlled data into the helper.

We regard this as invalid because arkworks' `log2` explicitly returns 0 when the input is 0.
