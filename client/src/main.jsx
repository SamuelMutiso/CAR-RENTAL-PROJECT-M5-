import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>);