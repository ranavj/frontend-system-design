# 🏗️ frontend-system-design

> **Frontend System Design, learned by shipping code — through a frontend developer's lens.**
> Har concept pehle **vanilla JS mein scratch se** banega (taaki magic na lage), phir week-end pe ek
> **React + TypeScript capstone** mein sab jud jaata hai. No passive reading — sirf build.

[![Progress](https://img.shields.io/badge/Progress-Week%201%2F12-orange)]()
[![Track](https://img.shields.io/badge/Track-Build--first-blue)]()
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20%2B%20React%20%2B%20FastAPI-green)]()

---

## 🎯 Ye repo kya hai?

Main ek **frontend developer** hoon (React / Angular / TypeScript). Ye repo ek **12-week, build-first
frontend system design journey** hai. Har topic ko padhne ke bajaye **implement** karta hoon:
apna debounce, apna mini-Redux, apna service worker, apni virtualized list.

Ye meri teesri "linked" learning repo hai — [`rag-mastery`](../rag-mastery) aur
[`python-foundations`](../python-foundations) ki tarah hi DNA:

- 🛠️ **Scratch-first:** har concept pehle **bina library** vanilla JS mein — request timing khud measure,
  event loop khud order, mini-Redux khud likho
- 🚀 **Capstone-second:** week ke end pe ek **React + TS** project jo us week ke saare builds ko jodta hai
- 🐍 **FastAPI on demand:** jahan demo ko server chahiye (CORS, SSE, WebSocket, SSR, streaming),
  us week ka apna **mini FastAPI server** hota hai
- 🔗 **Frontend-first samajh:** har cheez ko roz ke React/JS kaam se joda gaya

## 📂 Structure

```
frontend-system-design/
├── ROADMAP.md          ← poora 12-week / 6-phase plan
├── PROGRESS.md         ← har week ke baad update; naye session mein pehle yeh padho
├── artifact/
│   └── roadmap-tracker.html   ← live checkbox tracker (Claude artifact ki copy — synced)
└── week-<NN>-<slug>/   ← har week = ek project
    ├── README.md               ← is week kya banega + kaise chalao
    ├── notes.md                ← concept notes + frontend analogies
    ├── NN-<build>/             ← vanilla concept builds (scratch-first)
    ├── server/                 ← FastAPI mini-server (agar demo ko chahiye)
    └── capstone-<slug>/        ← React + TS capstone
```

## 🗺️ Roadmap (6 Phases · 12 Weeks)

| Phase | Weeks | Focus | Status |
|-------|-------|-------|--------|
| 🔵 Foundations   | 1–2   | Network & Browser (DNS/TCP/TLS/TTFB, event loop, CRP) | ⏳ Week 1 |
| 🟣 Rendering     | 3–4   | CSR/SSR/SSG, hydration, Core Web Vitals, virtualization | ⬜ |
| 🟢 Data          | 5–6   | polling/SSE/WebSocket, mini React-Query, caching | ⬜ |
| 🟠 Structure     | 7–8   | compound components, mini-Redux, state machines | ⬜ |
| 🔴 Resilience    | 9–10  | service workers, PWA, background sync, CRDT | ⬜ |
| 🔷 Synthesis     | 11–12 | a11y, security, RADIO framework, timed mocks | ⬜ |

Poore builds ke liye [`ROADMAP.md`](ROADMAP.md) dekho.

## 🔗 Sync — teen patri, ek train

Ye teen alag git repos hain, lekin **jodwaan**:

| Repo | Kya sikhata hai | Rishta |
|------|------------------|--------|
| [`python-foundations`](../python-foundations) | JS → AI-ready **Python** (scratch se) | is repo ke **FastAPI backends** ki Python neev |
| [`rag-mastery`](../rag-mastery) | **RAG / GenAI** (Python + Claude) | Phase 5 capstone (React + FastAPI + Chroma) yahan ke frontend patterns use karta hai |
| **frontend-system-design** (yeh) | **Frontend system design** (build-first) | rag-mastery ke full-stack app ka frontend brain |

**Rule:** yahan pattern seekho → rag-mastery ke full-stack capstone mein use karo. Backend Python?
python-foundations se aati hai. Live tracker: [`artifact/roadmap-tracker.html`](artifact/roadmap-tracker.html).

## ⚙️ Conventions

- **Scratch-first:** library uthane se pehle khud likhne ki koshish karo.
- **Har build ship karta hai:** working demo + `notes.md` ("kya seekha / kis React kaam se juda / kyun A over B").
- **Khud type karo** — copy-paste = kuch nahi seekha.
- **Commit format:** `FE Wk<NN>: <build>` (e.g. `FE Wk01: request timing logger`).
- **Shipping loop:** SPIKE (bas itna padho ki shuru ho) → BUILD (chhota, khud likho) → SHIP & EXPLAIN (push + README mein "kyun" + tracker tick).

## ▶️ Quick start

```bash
cd frontend-system-design
# Week 1 se shuru — network fundamentals, vanilla + Node
cat ROADMAP.md          # plan padho
cd week-01-network
cat README.md           # is week ka guide
```

Phir `ROADMAP.md` → **Phase 1 · Week 1** se shuru.
