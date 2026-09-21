const CACHE_NAME = "monica-portfolio-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",

  "./imag/logo.jpg",
  "./imag/verano.JPG",
  "./imag/voluntariado.jpg",
  "./imag/navidad.jpg",
  "./imag/semanasanta.jpg",
  "./imag/escritura.jpg",
  "./imag/actividadesmonis.jpg",

  "./imag/certificado1.png",
  "./imag/certificado2.png",
  "./imag/certificado3.png",
  "./imag/certificado4.png",
  "./imag/certificado5.png",
  "./imag/certificado6.png"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache =>
        cache.addAll(FILES_TO_CACHE)
      )

  );

  self.skipWaiting();

});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys
          .filter(key =>
            key !== CACHE_NAME
          )
          .map(key =>
            caches.delete(key)
          )

      )

    )

  );

  self.clients.claim();

});

self.addEventListener("fetch", event => {

  if (
    event.request.method !== "GET"
  )
    return;

  event.respondWith(

    caches.match(event.request)
      .then(cached => {

        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(response => {

            if (
              !response ||
              response.status !== 200 ||
              response.type === "opaque"
            ) {
              return response;
            }

            const clone =
              response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache =>
                cache.put(
                  event.request,
                  clone
                )
              );

            return response;

          })
          .catch(() =>
            caches.match(
              "./index.html"
            )
          );

      })

  );

});