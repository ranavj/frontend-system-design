# 🗺️ Frontend System Design — 12-Week Build-First Roadmap

> **Kis ke liye:** Vijay. React/Angular/TS mein comfortable, ab **system design** ki depth chahiye —
> woh cheezein jo "senior frontend" banati hain: network internals, rendering strategies, caching,
> state architecture, offline/resilience, a11y + security.
>
> **Philosophy:** No passive reading. Har topic ke saath ek **chhota practical build** hai jise khud
> implement karoge. Vanilla JS = concept (scratch-first), React + TS = week-end capstone.
> FastAPI mini-server sirf tab jab demo ko server chahiye.
>
> **Goal:** 12 hafte baad — koi bhi frontend system design sawaal aaye, tumne woh cheez **khud banayi**
> hai, isliye jawaab de sakte ho aur "kyun A over B" articulate kar sakte ho.

---

## 🧭 Roadmap kaise padhna hai

- **Shipping loop (har build):**
  1. **SPIKE** — sirf itna padho ki build shuru ho jaaye. Deep dive baad mein.
  2. **BUILD** — scope chhota rakho, ek concept, ek working demo. Library se pehle khud likho.
  3. **SHIP & EXPLAIN** — commit karo, README mein "kyun A over B" likho, tracker mein checkbox tick.
- **Vanilla = concept, React+TS = capstone.** Concept builds bina framework; week-end capstone React mein.
- **FastAPI:** jis week ko server chahiye, us week ke `server/` folder mein chhota FastAPI app.
- **Frontend bridge:** har concept ko apne roz ke React/JS kaam se jodo — "ye DevTools mein kahan dikhta hai?"
- **Tracker:** [`artifact/roadmap-tracker.html`](artifact/roadmap-tracker.html) — browser mein kholo, checkbox tick karo.

---

## 🔵 PHASE 1 — FOUNDATIONS: The Network & The Browser  (Weeks 1–2)

> Concepts ko code karke pakdo — network timing khud measure karo, event loop khud order karo.

### Week 1 · The Network — `week-01-network/`
| # | Build | Detail | Stack |
|---|-------|--------|-------|
| 1 | **Request timing logger** | Node script jo DNS / TCP / TLS / TTFB alag-alag measure kare (perf hooks) | Node/vanilla |
| 2 | **Conditional-cache proxy** | chhota cache jo `ETag` / `Cache-Control` respect kare (304 handling) | Node + FastAPI |
| 3 | **H1 vs H2 waterfall** | 30 images dono protocols pe load karke timing chart | Node + FastAPI |
| 4 | **CORS playground** | server + preflight ko live dekho & toggle karo | FastAPI + vanilla |

**Capstone → Network Inspector mini-tool:** koi URL daalo → resources ka timing waterfall + cache/headers breakdown. (`perf API` · `waterfall UI` · `headers parse`)

### Week 2 · The Browser — `week-02-browser/`
| # | Build | Detail | Stack |
|---|-------|--------|-------|
| 5 | **Event-loop visualizer** | sync / setTimeout / Promise / queueMicrotask ka order predict & log | vanilla |
| 6 | **debounce & throttle** | dono khud scratch se + live demo page | vanilla |
| 7 | **Reflow vs repaint meter** | properties toggle karke layout thrashing measure | vanilla |
| 8 | **CRP demo** | render-blocking vs `async/defer` ka paint time compare | vanilla |

**📚 Reference:** [High Performance Browser Networking](https://hpbn.co/) (Grigorik) · [In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) (Jake Archibald) · [Critical Rendering Path](https://web.dev/articles/critical-rendering-path) (web.dev)

---

## 🟣 PHASE 2 — RENDERING: Strategies & Performance  (Weeks 3–4)

> Ek hi app ko alag-alag render karke farq feel karo, phir slow page optimize karo.

### Week 3 · Where to render — `week-03-rendering/`
| # | Build | Detail |
|---|-------|--------|
| 1 | **Same app, 3 ways** | ek app ko CSR, SSR (`renderToString`) & SSG mein banao, compare |
| 2 | **Manual hydration** | server HTML → client listeners attach karke "hydrate" |
| 3 | **Streaming SSR** | `renderToPipeableStream` se progressive HTML stream |
| 4 | **Islands demo** | mostly-static page + 2 interactive islands, alag hydrate |

### Week 4 · Make it fast — `week-04-performance/`
| # | Build | Detail |
|---|-------|--------|
| 5 | **Virtualized list** | 10k rows windowed list scratch se (no library) |
| 6 | **Lazy image loader** | IntersectionObserver + blur-up, zero CLS |
| 7 | **Web Worker offload** | heavy compute worker mein, main thread unblock measure |
| 8 | **Lighthouse rescue** | slow page → green LCP/INP/CLS (before/after) |

**Capstone → Infinite-scroll news feed:** virtualization + lazy images + IO pagination, Lighthouse ≥ 90 on 10k+ items.
**📚 Reference:** [Rendering Patterns](https://www.patterns.dev/vanilla/rendering-patterns/) · [Learn Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) · [Perils of Rehydration](https://www.joshwcomeau.com/react/the-perils-of-rehydration/)

---

## 🟢 PHASE 3 — DATA: Communication & Client Caching  (Weeks 5–6)

> Real-time transports khud implement karo, phir apna mini data-fetching library banao.

### Week 5 · Talking to the server — `week-05-comms/`
| # | Build | Detail |
|---|-------|--------|
| 1 | **Live counter × 3** | same feature polling, SSE & WebSocket teeno se, trade-offs note |
| 2 | **REST vs GraphQL client** | ek "todos" API dono style mein consume |
| 3 | **Cursor pagination** | infinite query + "load more" (offset se compare) |
| 4 | **AbortController search** | stale requests cancel + in-flight dedupe |

### Week 6 · Data on the client — `week-06-caching/`
| # | Build | Detail |
|---|-------|--------|
| 5 | **Mini React Query** | cache + stale-while-revalidate + background refetch khud likho |
| 6 | **Optimistic like button** | instant update + failure pe rollback |
| 7 | **IndexedDB list** | bade dataset persist + query (idb) |
| 8 | **Normalized store** | entities-by-id cache + selector for a feed |

**Capstone → Typeahead search + live chat:** debounce + cancel + cache + keyboard nav. Stretch: WebSocket chat, optimistic send, auto-reconnect.
**📚 Reference:** [FE System Design Playbook](https://www.greatfrontend.com/front-end-system-design-playbook) · [TanStack Query](https://tanstack.com/query/latest) · [IndexedDB](https://web.dev/articles/indexeddb)

---

## 🟠 PHASE 4 — STRUCTURE: Architecture & State  (Weeks 7–8)

> Patterns ko code karke samjho — apna Redux likho, state machine banao, micro-frontend chalao.

### Week 7 · Structuring the app — `week-07-architecture/`
| # | Build | Detail |
|---|-------|--------|
| 1 | **Compound component** | Tabs/Accordion context ke saath (`<Tabs><Tab/>` API) |
| 2 | **Component-lib starter** | Button/Input variants + design tokens |
| 3 | **Monorepo** | pnpm workspaces, shared `ui` package 2 apps mein |
| 4 | **Micro-frontend** | Module Federation (Vite) se remote component load |

### Week 8 · Managing state — `week-08-state/`
| # | Build | Detail |
|---|-------|--------|
| 5 | **Mini-Redux** | `createStore`, dispatch, subscribe, reducers scratch se |
| 6 | **State-category app** | local vs URL vs server vs global, ek app mein saaf |
| 7 | **Selectors + memo** | derived state, `reselect`-style memoizer |
| 8 | **Checkout state machine** | multi-step flow XState (ya khud ka FSM) se |

**Capstone → Analytics dashboard:** filters URL state, data server state (mini-query), UI local. Widget arch + shared lib.
**📚 Reference:** [Design Patterns](https://www.patterns.dev/) · [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) · [App state management](https://kentcdodds.com/blog/application-state-management-with-react)

---

## 🔴 PHASE 5 — RESILIENCE: Scale, Offline & Reliability  (Weeks 9–10)

> Service worker, background sync aur chhota CRDT khud likho — flaky network handle karna seekho.

### Week 9 · Offline & sync — `week-09-offline/`
| # | Build | Detail |
|---|-------|--------|
| 1 | **Service worker cache** | assets cache-first, API network-first fallback |
| 2 | **Installable PWA** | manifest + offline fallback + install prompt |
| 3 | **Background sync queue** | offline actions queue, reconnect pe flush |
| 4 | **Tiny CRDT** | LWW register ya G-counter, 2 replicas merge |

### Week 10 · Reliability — `week-10-reliability/`
| # | Build | Detail |
|---|-------|--------|
| 5 | **Error boundary** | fallback UI + reset + error report |
| 6 | **Retry with backoff** | `fetch` wrapper: exponential backoff + jitter + max retries |
| 7 | **RUM collector** | Web Vitals capture → log endpoint |
| 8 | **i18n switcher** | en/hi lazy bundles + RTL toggle |

**Capstone → Offline-first notes app:** IndexedDB + service worker + background sync + CRDT conflict resolution. Airplane mode mein likho, online aake merge.
**📚 Reference:** [Learn PWA](https://web.dev/learn/pwa) · [The Offline Cookbook](https://web.dev/articles/offline-cookbook) · [CRDT.tech](https://crdt.tech/)

---

## 🔷 PHASE 6 — SYNTHESIS: Systems, A11y, Security & Interview  (Weeks 11–12)

> Cross-cutting cheezein build karo, phir sab kuch timed mock builds mein synthesize karo.

### Week 11 · Cross-cutting builds — `week-11-crosscutting/`
| # | Build | Detail |
|---|-------|--------|
| 1 | **Token-based theming** | CSS vars design tokens + light/dark themeable components |
| 2 | **Accessible Modal** | focus trap, ESC, ARIA, focus restore (WAI-ARIA spec) |
| 3 | **Accessible Combobox** | full keyboard nav (arrows/enter/esc), screen-reader friendly |
| 4 | **Break & fix security** | XSS demo banao phir CSP se fix; CSRF token flow |

### Week 12 · Interview synthesis — `week-12-interview/`
| # | Do this | Detail |
|---|---------|--------|
| 5 | **RADIO checklist** | reusable template (Requirements→Architecture→Data→API→Optimize) |
| 6 | **Timed mock 1** | 45 min mein autocomplete ka core design + build |
| 7 | **Timed mock 2** | news feed: whiteboard + core code, trade-offs bolo |
| 8 | **Record & review** | ek design khud ko explain karke record, self-review |

**Capstone → Ship a mini design-system:** 3–4 fully accessible, themeable, documented components. Stretch: 3 timed mocks record + self-review.
**📚 Reference:** [The RADIO Framework](https://www.greatfrontend.com/front-end-system-design-playbook) · [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) · [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

---

## 📊 Bird's-eye view

```
PHASE 1              PHASE 2            PHASE 3          PHASE 4           PHASE 5            PHASE 6
Foundations          Rendering          Data             Structure         Resilience         Synthesis
Wk 1–2               Wk 3–4             Wk 5–6           Wk 7–8            Wk 9–10            Wk 11–12
Network+Browser  →   Render+Perf    →   Comms+Cache  →   Arch+State    →   Offline+Reli   →   A11y+Security+Interview
```

**Milestone (Week 12 ke baad):** koi bhi frontend system design tutorial/interview aaye — har layer tumne khud banayi hai, isliye samajh + articulate dono aayenge.

---

## 🔗 Sync partners

- [`python-foundations`](../python-foundations/ROADMAP.md) — is repo ke FastAPI backends ki Python neev
- [`rag-mastery`](../rag-mastery/ROADMAP.md) — full-stack RAG capstone yahan ke frontend patterns use karta hai
