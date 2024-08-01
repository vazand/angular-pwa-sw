importScripts('./ngsw-worker.js');

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked!');
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_WEBSOCKET') {
    setupWebSocket(event.data.url);
  }
});

function setupWebSocket(url) {
  const websocket = new WebSocket(url);

  websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    showNotification(data.title, data.options);
  };
  websocket.onopen = function () {
    const data = JSON.stringify({"Hello": "server"});
    console.log(data);
    websocket.send(data);
  };
  

  websocket.onclose = function () {
    console.log('WebSocket closed, attempting to reconnect...');
    setTimeout(() => setupWebSocket(url), 5000); // Reconnect after 5 seconds
  };

  websocket.onerror = function (error) {
    console.error('WebSocket error:', error);
  };
}

function showNotification(title, options) {
  self.registration.showNotification(title, options);
}



// importScripts('./ngsw-worker.js');
// self.addEventListener('notificationclick', (event) => {
//   console.log('notification clicked!')
// });
// self.addEventListener('install', (event) => {
//   // Perform install steps
//   console.log('Service worker installing...');
// });

// self.addEventListener('activate', (event) => {
//   console.log('Service worker activating...');
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'INIT_WEBSOCKET') {
//     setupWebSocket(event.data.url);
//   }
// });

// function setupWebSocket(url) {
//   const websocket = new WebSocket(url);

//   websocket.onmessage = function (event) {
//     const data = JSON.parse(event.data);
//     showNotification(data.title, data.options);
//   };

//   websocket.onclose = function () {
//     console.log('WebSocket closed, attempting to reconnect...');
//     setTimeout(() => setupWebSocket(url), 5000); // Reconnect after 5 seconds
//   };

//   websocket.onerror = function (error) {
//     console.error('WebSocket error:', error);
//   };
// }

// function showNotification(title, options) {
//   self.registration.showNotification(title, options);
// }
