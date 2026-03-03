import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logError } from './lib/logger';

// Manejo global de errores
window.addEventListener('error', (event) => {
	logError(event.error || event.message, 'Global Error');
});

window.addEventListener('unhandledrejection', (event) => {
	logError(event.reason, 'Unhandled Promise Rejection');
});

createRoot(document.getElementById("root")!).render(<App />);
