// Build 1 · CSR — browser JS jo page load hone ke BAAD quote decide karta hai.
//
// ⚠️ Ye ek GUIDE hai — khud complete karo.
//
// Ye file compile hoke csr.js banegi (npm run build:csr), aur csr.html usi
// csr.js ko <script type="module" src="csr.js"> se load karta hai.

interface Quote {
  text: string;
  author: string;
}

const QUOTES_LIST: Quote[] = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
];

// TODO: setTimeout se ek "fake network delay" simulate karo (jaise 500ms) —
// taaki "Loading..." genuinely thodi der dikhe, real fetch() jaisa.
// Uske andar:
//   1. QUOTES_LIST array mein se RANDOM ek INDEX pick karo
//      (Math.floor(Math.random() * QUOTES_LIST.length))
//   2. us index se poora Quote OBJECT nikalo (QUOTES_LIST[index]) — sirf index nahi,
//      pura object chahiye taaki .text aur .author dono mil sakein.
//   3. document.getElementById("quote") se element nikalo — TypeScript isko
//      `HTMLElement | null` type dega (DOM query kabhi bhi null ho sakta hai),
//      isliye null-check ya `!` (non-null assertion) lagana padega.
//   4. .innerHTML set karo: `"${quote.text}" — ${quote.author}`
setTimeout(() => {
  // TODO
  let quote = (Math.floor(Math.random() * QUOTES_LIST.length));
  console.log(quote);
  let getQuote = QUOTES_LIST[quote];
  let element : HTMLElement | null = document.getElementById("quote");
  if (element) {
    element.innerHTML = `"${getQuote.text}" — ${getQuote.author}`
  }
}, 500);
