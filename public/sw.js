self.addEventListener('install', (event) => {
  console.log("install");
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log("activate");
  // event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== location.origin) {
    return;
  }

  const re = new RegExp("^/(?<projectId>[0-9a-z-]+)/files/(?<name>.+)$");
  const match = url.pathname.match(re);
  if (!match) {
    return;
  }

  event.respondWith(idbResponse(match.groups));
});

function idbResponse({ projectId, name }) {
  return new Promise((resolve, reject) => {
    // XXX: prefer to use dexie
    const request = self.indexedDB.open(`iter-${projectId}`);

    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      db.onerror = (event) => {
        reject(event);
      };
      db.transaction("uploads")
        .objectStore("uploads")
        .get(name).onsuccess = (event) => {
          if (event.target.result) {
            const response = new Response(
              event.target.result.blob,
              { headers: { "Content-Type": event.target.result.blob.type }},
            );
            resolve(response);
          } else {
            const response = new Response(
              "Not Found",
              {
                status: 404,
                headers: {"Content-Type": "text/html" },
              },
            );
            resolve(response);
          }
        }
    };
  });
}
