// API contract — inspect-server.js jo JSON deta hai, uska shape.
// Ye file "documentation jo compile hoti hai" hai: backend ka response badla, to yahan bhi badlo,
// aur TS turant bata dega ki UI mein kahan-kahan asar pada.

export interface Stages {
  dns: number;
  tcp: number;
  tls: number; // http ho to 0
  ttfb: number;
  download: number;
}

export interface CacheInfo {
  cacheControl: string | null;
  etag: string | null;
  lastModified: string | null;
  age: string | null;
  contentType: string | null;
  contentEncoding: string | null;
  server: string | null;
  maxAge: number | null;
  hasValidator: boolean;
  verdict: string;
}

export interface InspectResult {
  url: string;
  status: number;
  stages: Stages;
  total: number;
  bottleneck: keyof Stages | null;
  bytes: number;
  headers: Record<string, string | string[]>;
  cache: CacheInfo;
}

// Server error path pe {error: "..."} bhejta hai — isliye response do mein se kuch bhi ho sakta hai.
export interface InspectError {
  error: string;
}

export type InspectResponse = InspectResult | InspectError;

// Type guard — ek runtime check jo TS ko bhi convince karta hai ki aage kaunsa type hai.
// (Iske bina `if ("error" in data)` ke baad bhi TS ko narrow karna manually padta.)
export function isError(data: InspectResponse): data is InspectError {
  return "error" in data;
}
