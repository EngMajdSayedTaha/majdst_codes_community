// Entry point for React application
import React from 'react';
import ReactDOM from 'react-dom/client';
import clarity from '@microsoft/clarity';
import App from './App';
import '../styles/variables.css';
import '../styles/globals.css';
import '../styles/theme.css';

const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

if (clarityProjectId) {
  clarity.init(clarityProjectId);
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found. Make sure index.html has an element with id="root"');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);