const STATIC_CACHE = "mario-tracker-static-v2";
const RUNTIME_CACHE = "mario-tracker-runtime-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
];

const EXTERNAL_RESOURCES = [
  "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap",
  "https://html2canvas.hertzen.com/dist/html2canvas.min.js",
];

const putInCache = async (cacheName, request, response) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
};

const isCacheableResponse = (response) =>
  response && (response.ok || response.type === "opaque");

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  const networkResponse = await fetch(request);
  if (isCacheableResponse(networkResponse)) {
    await putInCache(RUNTIME_CACHE, request, networkResponse.clone());
  }

  return networkResponse;
};

const networkFirst = async (request, preloadResponsePromise) => {
  try {
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      await putInCache(RUNTIME_CACHE, request, preloadResponse.clone());
      return preloadResponse;
    }

    const networkResponse = await fetch(request);
    if (isCacheableResponse(networkResponse)) {
      await putInCache(RUNTIME_CACHE, request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match("./index.html")) ||
      new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      await staticCache.addAll(APP_SHELL);

      const runtimeCache = await caches.open(RUNTIME_CACHE);
      await Promise.all(
        EXTERNAL_RESOURCES.map(async (url) => {
          try {
            const response = await fetch(new Request(url, { mode: "no-cors" }));
            if (isCacheableResponse(response)) {
              await runtimeCache.put(url, response);
            }
          } catch {
            // Ignorar fallos de red durante la precarga externa.
          }
        }),
      );
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      const validCaches = [STATIC_CACHE, RUNTIME_CACHE];
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !validCaches.includes(key))
          .map((key) => caches.delete(key)),
      );
    })(),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith("http")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, event.preloadResponse));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
