import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SettlementProvider } from "./hooks/SettlementContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettlementProvider>
      <App />
    </SettlementProvider>
  </StrictMode>
);
