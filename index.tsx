
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("System initialization sequence started...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Critical Failure: Could not find root element to mount the application.");
}

// Mark the root as loaded to hide diagnostic error screens in index.html
rootElement.setAttribute('data-status', 'loaded');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("React render cycle completed successfully.");
