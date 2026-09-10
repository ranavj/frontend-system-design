# Build 1 · Same App, 3 Ways — CSR vs SSR vs SSG

> Ek bilkul simple "Quote of the moment" app — **teen tareeke se** banake, **"View
> Source" aur refresh-behavior** se asli farak dekhna hai.

## App kya hai (bahut chhota, jaan-boojh kar)

Ek quote (text + author) dikhana hai, jo ek chhoti list mein se **random pick** hoti
hai. Bas itna hi — poora focus "kab/kahan quote decide hoti hai" pe hai, app ki
complexity pe nahi.

## Teeno versions — farak yahi hai: "quote KAB decide hoti hai"

| | Quote kab pick hoti hai | View Source mein kya dikhega | Refresh karne pe |
|---|---|---|---|
| **CSR** (`csr.html`) | **Browser mein**, page load hone ke BAAD (JS chalne par) | `<div id="quote">Loading...</div>` — khaali! | Naya random quote (browser phir se pick karta hai) |
| **SSR** (`ssr-server.js`) | **Server pe, HAR REQUEST ke liye** | Poora quote text already HTML mein hai | Naya random quote (server phir se pick karta hai) |
| **SSG** (`ssg-build.js` → `ssg-output.html`) | **"Build time" pe, EK HI BAAR** (jab aap `node ssg-build.js` chalate ho) | Poora quote text already HTML mein hai | **WAHI quote** — jab tak `ssg-build.js` dobara na chalao |

**SSR aur SSG ka View Source EK JAISA dikhega** (dono mein poora content hai) — asli
farak sirf **refresh karne par** pata chalta hai.

## React/Angular is concept ko kaise handle karte hain

Ye teeno strategies koi "vanilla JS ka jugaad" nahi hain — **Next.js (React) aur
Angular Universal, dono, EXACTLY isi choice ko ek first-class feature banate hain:**

```js
// Next.js — SSR: har request pe chalta hai
export async function getServerSideProps() {
  const quote = pickRandomQuote();
  return { props: { quote } };
}

// Next.js — SSG: sirf BUILD TIME pe ek baar chalta hai
export async function getStaticProps() {
  const quote = pickRandomQuote();
  return { props: { quote } };
}

// CSR — kuch bhi special nahi, normal useEffect + useState
useEffect(() => { fetchQuote().then(setQuote); }, []);
```

**Farak sirf itna hai:** Next.js aapko decide karne deta hai — `getServerSideProps`
likho to SSR, `getStaticProps` likho to SSG, kuch na likho (sirf component ke andar
`useState`/`useEffect`) to CSR. **Concept bilkul wahi hai jo aap abhi vanilla mein
bana rahe ho — Next.js sirf ek naam/syntax deta hai isko.**

Angular Universal mein bhi concept same hai — `TransferState` API se decide hota hai
server pe kya render ho aur client ko kya "transfer" ho.

## Ab se: TypeScript-based

Is build se aage, jahan bhi hum plain JS likh rahe thay, wahan ab **TypeScript** likhenge
— taaki TS ki practice bhi saath-saath hoti rahe. Teen files, teen `.ts` sources:

- `csr.ts` — browser code, `tsc` se compile hoke `csr.js` banti hai, `csr.html`
  `<script type="module" src="csr.js">` se usko load karta hai.
- `ssr-server.ts` — Node server, direct `tsx` se chalta hai (koi compile step nahi
  chahiye, `tsx` on-the-fly TS ko chalata hai).
- `ssg-build.ts` — Node script, `tsx` se hi chalta hai.

Pehle ek baar: `npm install` (isी folder ke andar) — `typescript` + `tsx` + `@types/node`
install karega.

## Steps (khud likhna hai)

### 1. `csr.ts`
Ek `Quote` interface, `QUOTES: Quote[]` array, aur `setTimeout` (fake delay) ke andar
random quote pick karke `#quote` div ka `innerHTML` set karna hai.

### 2. `ssr-server.ts`
Ek Node `http` server jo **har request pe** random quote pick kare, aur **poora HTML
string (quote ke saath already embedded)** bheje.

### 3. `ssg-build.ts`
Ek script jo **ek baar chalke**, random quote pick kare, aur ek `ssg-output.html` file
**disk pe likh de** (poore HTML ke saath, quote embedded).

## Run & Verify

```bash
npm install   # ek baar

# CSR — pehle TS ko JS mein compile karo
npm run build:csr

# ⚠️ csr.html ko "open csr.html" (file://) se MAT kholo — type="module" scripts
# file:// origin se CORS error dete hain. Ek local server chalao:
python3 -m http.server 8130
# phir browser mein: http://localhost:8130/csr.html

# SSR — server chalao, phir refresh-refresh karke dekho (View Source bhi karo)
npm run ssr
# http://localhost:8120 kholo

# SSG — pehle "build" karo, phir file kholo
npm run ssg
open ssg-output.html
# Ab isko baar-baar kholo — quote KABHI nahi badlegi, jab tak dobara build na karo
```

Type-check sirf karna ho (bina run kiye): `npm run typecheck`.

**Sabse zaroori check:** CSR mein "View Source" (Cmd+Option+U) karo — `Loading...`
dikhega, quote nahi (kyunki quote sirf JS chalne ke baad DOM mein aati hai, "source"
mein kabhi nahi hoti). SSR/SSG mein "View Source" mein **quote text seedha maujood**
hoga.

**CSR ko HTTP server se hi kyun kholna padta hai:** `type="module"` script hamesha ek
`fetch`-jaisi request ke through load hota hai, jo CORS rules follow karta hai.
`file://` se khola gaya page origin `"null"` count hota hai, aur module-fetch usko
allow nahi karta — isliye browser error deta hai. Yehi wajah hai ki har modern
framework (Vite, Angular CLI, Next.js) apna khud ka dev server chalata hai — sirf
hot-reload ke liye nahi, module scripts `file://` se chalte hi nahi.

## Ship

`notes.md` mein reflection likho → `PROGRESS.md` mein ✅ → commit.
