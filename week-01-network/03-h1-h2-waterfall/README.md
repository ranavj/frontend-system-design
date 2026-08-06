# Build 3 · H1 vs H2 Waterfall

> 30 "images" ko HTTP/1.1 aur HTTP/2 dono pe load karke waterfall timing compare karo —
> head-of-line blocking apni aankhon se dekho, na ki sirf concept mein.

## Goal (kya dikhega)

Do buttons — "Load via HTTP/1.1" aur "Load via HTTP/2". Click karne pe 30 image requests
jaate hain, aur ek waterfall chart banta hai (jaisa DevTools Network tab). Expected farak:

- **H1** → bars **batches mein** shuru hongi (~6 ek saath, phir agla batch — connection limit)
- **H2** → bars **saath-saath** shuru hongi (ek hi multiplexed connection)
- **Total time** H2 mein kam hoga

## Setup — pehle cert banao (ek baar)

HTTP/2 sirf TLS ke andar negotiate hota hai (ALPN) — isliye localhost ke liye bhi ek
self-signed certificate chahiye. Isi folder mein chalao:

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

Ye do files banayega: `key.pem` (private key) aur `cert.pem` (certificate) — dono
**commit nahi honi chahiye** (`.gitignore` mein already excluded).

## Steps (khud type karo — `server.js` mein TODOs hain)

1. `handleRequest` complete karo — URL se image index nikaalo, `ARTIFICIAL_DELAY_MS` ka
   `setTimeout` wait karke ek dummy image buffer response mein bhejo.
   (Delay isliye taaki localhost pe bhi waterfall mein farak dikhe — warna sab kuch <1ms mein khatam ho jaata.)
2. H2 mode mein `http2.createSecureServer(options, handleRequest)` banao, port 8002 pe listen karo.
3. `client.html` mein `run(origin)` complete karo — 30 image requests bhejo (fetch ya `<img>`),
   sabke khatam hone ka wait karo (`Promise.all`).
4. `performance.getEntriesByType("resource")` se timing entries nikaalo (origin se filter karke),
   har entry ka `startTime` + `duration` se ek horizontal bar draw karo.

## Run (do terminals + browser)

```bash
# Terminal 1 — HTTP/1.1 server
node server.js h1

# Terminal 2 — HTTP/2 server
node server.js h2
```

Phir `client.html` ko browser mein seedha kholo (file:// se bhi chalega) aur dono buttons try karo.
HTTP/2 button pe pehli baar cert warning aayega ("Not Secure") — "Advanced → Proceed" karo,
kyunki cert self-signed hai (Build 2/Day 2 revision mein iska concept discuss hua tha).

**Bonus check:** DevTools → Network tab → "Protocol" column add karo — H1 run mein `http/1.1`,
H2 run mein `h2` dikhna chahiye. Yehi ALPN negotiation ka result hai, live.

## Ship

`notes.md` (Week ka) bharo → `PROGRESS.md` mein Build 3 ✅ → tracker tick → commit.

## Reference
- [Node `http2` module](https://nodejs.org/api/http2.html)
- [Resource Timing API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing)
- [HPBN — HTTP/2 chapter](https://hpbn.co/http2/)
