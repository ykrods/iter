self.addEventListener('install', (event) => {
  console.log("install");
  // activate installed worker without
  // waiting for the open page to be closed
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log("activate");
  // activate newest worker without
  // waiting for reloading when registered
  event.waitUntil(clients.claim());
});
