# Build 5 · Event-Loop Visualizer

> Sync code, `setTimeout`, `Promise.then`, `queueMicrotask` — inका asli execution order
> **predict karo, phir chalake dekho** kitna sahi socha.

## Kyun ye build

Ye poora concept — sync code turant chalna, `.then()`/microtask hamesha macrotask
(`setTimeout`) se pehले chalna, chahe delay `0` ho — **isko is session mein already
bahut deeply explore kiya ja chuka hai** (Promise executor sync hai, `.then()` hamesha
deferred hai, `await` = generator ka `yield` + auto-driver, `EventEmitter.emit()` sync hai
jabki timers macrotask hain). Ye build usी samajh ko ek **visual tool** mein badalta hai.

## Goal (kya dikhega)

Ek page — button dabाओ, ek fixed sequence of calls chalti hai jo mix hai:
- sync `console.log`-jaisa direct call
- `setTimeout(fn, 0)`
- `Promise.resolve().then(fn)`
- `queueMicrotask(fn)`

Har call apna label ek **color-coded log** mein add karta hai (sync = ek rang, microtask =
doosra, macrotask = teesra) — taaki **visually** dikhे ki kaunsa kis queue se aaya.

## Steps (khud likhna hai — `index.html` mein TODOs hain)

1. `log(text, kind)` helper poora likha hai — DOM mein colored line add karta hai.
2. **Tumhara kaam:** `run()` function ke andar ek sequence banao jisमein kam se kam
   5-6 calls hon — mix of sync/setTimeout/Promise/queueMicrotask — jaisा ROADMAP mein
   diya hai.
3. **Predict pehले:** `run()` likhने se pehले, ek comment mein apna guess likho ki
   kaunsa print pehле aayega, kaunsa baad mein. Phir chalake check karo — sahi tha kya?
4. Stretch: 2-3 alag sequences banao (jaise nested `.then().then()`, ya `setTimeout` ke
   andar se `Promise` create karna) aur dekho order kaisा badalता hai.

## Run

Bas `index.html` browser mein kholो — koi server nahi chahiye.

## Reference
- [In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) — Jake Archibald (already ROADMAP mein tha)
- Is session ki apni Promise/generator/`async`-`await` deep-dive — sabसे accha reference khud tumhara conversation history hai

## Ship

`notes.md` (Week 2 ka, naya banao) bharo → `PROGRESS.md` mein Build 5 ✅ → commit.
