---
title: Summon Major Update
image: "/articles/summon-major-update/cover.webp"
tldr: I’m excited to share the biggest Summon update yet. 🎉
authors: ["Andrew Morris"]
date: 2025-05-21
tags:
  [
    summon,
    mpc,
    typescript,
    privacy,
    developer-tools,
    release-notes,
    circuits,
    cryptography,
    compiler,
  ]
projects: ["mpc-framework"]
canonical: "https://mpc.pse.dev/blog/summon-major-update"
---

I’m excited to share the biggest Summon update yet. 🎉

## Wait - What's Summon?

[Summon](https://github.com/privacy-scaling-explorations/summon) is a dialect of TypeScript for generating boolean circuits! We use this to great effect in [MPC Framework](https://mpc.pse.dev/), since it requires the computation inside the MPC cryptography to be a boolean circuit. It's so much more than a TypeScript library - it's a very special runtime that transforms branching (`if/else/for/while/switch`) into flat circuitry.

## 1 · Streamlined IO with `Summon.IO`

### Before

```js
export default function main(a: number, b: number) {
  const plus = a + b
  const gt = a > b

  return [plus, gt]
}

// and separately provide mpcSettings:
const mpcSettings = [
  {
    name: "alice",
    inputs: ["a"],
    outputs: ["main[0]", "main[1]"],
  },
  {
    name: "bob",
    inputs: ["b"],
    outputs: ["main[0]", "main[1]"],
  },
]
```

### After

```js
default function main(io: Summon.IO) {
    const a = io.input('alice', 'a', summon.number());
    const b = io.input('bob', 'b', summon.number());

    io.outputPublic('plus', a + b);
    io.outputPublic('gt', a > b);
}

// mpcSettings is generated automatically
```

_Shorter, self‑contained, and each output has a real name._

Per-party outputs are also coming, and will fit neatly into this API: `io.output(partyName, outputName, value)`.

Type information is available via [`summon.d.ts`](https://github.com/privacy-scaling-explorations/summon/blob/main/summon.d.ts):

![intellisense demo](/articles/summon-major-update/intellisense-light.webp)

## 2 · Typed Inputs (now with `bool`)

The third argument of `io.input` specifies the type:

![number example](/articles/summon-major-update/number-example-light.webp)

![bool example](/articles/summon-major-update/bool-example-light.webp)

`bool`s now work properly, so you can pass `true`/`false` instead of `1`/`0`. This is both better devX and removes unnecessary bits.

Output bools are also new, decoding correctly as `true`/`false` (the values you get out of `await session.output()`).

This also sets us up to support arrays/etc and grow into comprehensive typing à la [zod](https://zod.dev/?id=basic-usage) or [io‑ts](https://github.com/gcanti/io-ts/blob/master/index.md).

## 3 · Public Inputs

Need a single program that adapts to many input sizes/participants? Public inputs let you accept these at **compile time**:

```js
const N = io.inputPublic("N", summon.number())
let votes: boolean[] = []

for (let i = 0; i < N; i++) {
  const vote = io.input(`party${i}`, `vote${i}`, summon.bool())
  votes.push(vote)
}
```

Pass them via CLI:

```bash
summonc program.ts \
  --public-inputs '{ "N": 10 }' \
  --boolify-width 8
```

or the `summon-ts` API:

```js
const { circuit } = summon.compile({
  path: "program.ts",
  boolifyWidth: 8,
  publicInputs: { N: 10 },
  files: {
    /* ... */
  },
})
```

See it in action: **JumboSwap** [circuit](https://github.com/privacy-scaling-explorations/jumboswap/blob/3f81b87/src/circuit/main.ts).

## 4 · Faster Branch Merging

Merging has to occur whenever your program branches on signals:

```js
const value = cond ? x : y
```

Circuits can't evaluate only one side of this like CPUs do, so the Summon compiler has to emit wires for both branches and then merge them together like this:

```js
value = merge(condA, x, condB, y)
//      = (condA * x) + (condB * y) // old method
//      = (condA * x) XOR (condB * y) // new method
```

So, `+` became `XOR` which is great because `XOR` is almost free, but why is this allowed?

The key is that `condA` and `condB` cannot be true simultaneously. In this example we have `condB == !condA`, but we don't have to rely on that. These conditions are _always_ non-overlapping - there is only ever one "real" branch with `cond == 1`. This means each bit of the addition cannot produce a carry and is equivalent to `XOR`, because `XOR` is 1-bit addition.

This caused some real speedups in our demos:

- [**JumboSwap**](https://mpc.pse.dev/apps/jumboswap): ≈4× faster
- [**Lizard‑Spock**](https://mpc.pse.dev/apps/lizard-spock): ≈20 % faster

## Join Us!

- [Telegram group](https://t.me/+FKnOHTkvmX02ODVl)
- [Discord](https://discord.gg/btXAmwzYJS) (Channel name: 🔮-mpc-framework)
- [Github Repo](https://github.com/privacy-scaling-explorations/mpc-framework) ⭐️
- [Website](https://mpc.pse.dev)

Thanks for building privacy‑preserving magic with us! 🪄
