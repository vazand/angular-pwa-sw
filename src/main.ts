import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';  // Ensure you have an environment file
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if ('serviceWorker' in navigator && environment.production) {
  navigator.serviceWorker.register('my-service-worker.js').then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope);

    if (registration.active) {
      registration.active.postMessage({
        type: 'INIT_WEBSOCKET',
        url: 'ws://localhost:9000/api/notifications?token=hello'
      });
    } else if (registration.waiting) {
      registration.waiting.addEventListener('statechange', (event) => {
        const target = event.target as ServiceWorker;
        if (target && target.state === 'activated') {
          registration.active?.postMessage({
            type: 'INIT_WEBSOCKET',
            url: 'ws://localhost:9000/api/notifications?token=hello'
          });
        }
      });
    }
  }).catch((error) => {
    console.error('Service Worker registration failed:', error);
  });
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// // import { bootstrapApplication } from '@angular/platform-browser';
// // import { appConfig } from './app/app.config';
// // import { AppComponent } from './app/app.component';

// // bootstrapApplication(AppComponent, appConfig)
// //   .catch((err) => console.error(err));

// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { environment } from './environments/environment';

// if ('serviceWorker' in navigator && environment.production) {
//   navigator.serviceWorker.register('my-service-worker.js').then((registration) => {
//     console.log('Service Worker registered with scope:', registration.scope);

//     if (registration.active) {
//       registration.active.postMessage({
//         type: 'INIT_WEBSOCKET',
//         url: 'http://localhost:9000/api/notifications'
//       });
//     } else if (registration.waiting) {
//       registration.waiting.addEventListener('statechange', (event) => {
//         if (event.target.state === 'activated') {
//           registration.active.postMessage({
//             type: 'INIT_WEBSOCKET',
//             url: '/api/notification'
//           });
//         }
//       });
//     }
//   }).catch((error) => {
//     console.error('Service Worker registration failed:', error);
//   });
// }

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
