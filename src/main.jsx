import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FinanceProvider } from './contexts/FinanceContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './chartSetUp';
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <QueryClientProvider client={queryClient}>
        <App />
        </QueryClientProvider>
      </FinanceProvider>
    </BrowserRouter>
  </StrictMode>,
);
