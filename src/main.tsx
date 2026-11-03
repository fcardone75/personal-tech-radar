import '@fontsource-variable/dm-sans';
import '@fontsource-variable/space-grotesk';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LocaleProvider } from './i18n/LocaleContext';
import './style.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
