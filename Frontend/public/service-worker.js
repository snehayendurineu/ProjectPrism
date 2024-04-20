// Cache Name for the Service Worker
const cacheName = "Prism-cache-v1";

// Files to be cached in the service worker
const filesToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json",
  "/assets/default_project.svg",
  "/assets/features.svg",
  "/assets/Prism_large.png",
  "/assets/Prism_logo.png",
  "/assets/Prism.png",
  "/logo_large.png",
  "/logo_small.png",
  "/public/manifest.json",
  "/public/index.html",
  "/src/App.tsx",
];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(cacheName).then((cache) => {
//       return cache.addAll(filesToCache);
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
