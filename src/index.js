import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (typeof window !== 'undefined') {
  const { worker } = require('./mocks/browser');
  worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    onUnhandledRequest: 'bypass',
  });
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
