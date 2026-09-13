import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import { StoreProvider } from "./store/StoreContext";
import { ThemeProvider } from "./store/ThemeContext";
import { LanguageProvider } from "./store/LanguageContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <StoreProvider>
            <Layout />
          </StoreProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </ErrorBoundary>,
);
