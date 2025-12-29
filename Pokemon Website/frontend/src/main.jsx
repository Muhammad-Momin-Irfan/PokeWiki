import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Required for routing
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import the provider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Wrap in Router so <Link> works */}
    <BrowserRouter>
      {/* 2. Wrap in AuthProvider so User State is global */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);