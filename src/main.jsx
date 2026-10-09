import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { applyTheme } from './utils/applyTheme';
import './index.css';
import App from './App.jsx';

// Apply runtime theme overrides from siteConfig before first render
applyTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
